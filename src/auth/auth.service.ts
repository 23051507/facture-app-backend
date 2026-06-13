import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
  ) {}

  async register(dto: RegisterDto): Promise<Omit<User, 'mot_de_passe_hash'>> {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Un compte avec cet email existe déjà');
    }
    const hash = await bcrypt.hash(dto.mot_de_passe, 12);
    const user = this.userRepository.create({
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      mot_de_passe_hash: hash,
      role: dto.role,
    });
    try {
      const saved = await this.userRepository.save(user);
      const { mot_de_passe_hash, ...result } = saved;
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la création du compte",
      );
    }
  }

  async validateUser(email: string, mot_de_passe: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return null;
    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe_hash);
    if (!isMatch) return null;
    const { mot_de_passe_hash, ...result } = user;
    return result;
  }

  async login(user: Omit<User, 'mot_de_passe_hash'>) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '30d' });
    await this.userRepository.update(user.id, {
      derniere_connexion: new Date(),
    });
    return {
      access_token,
      refresh_token,
      user,
    };
  }

  async logout(token: string, userId: string): Promise<void> {
    const decoded = this.jwtService.decode(token) as { exp: number };
    if (decoded?.exp) {
      const now = Math.floor(Date.now() / 1000);
      const ttl = decoded.exp - now;
      if (ttl > 0) {
        await this.redisClient.set(`blacklist:${token}`, userId, 'EX', ttl);
      }
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // On ne révèle pas si l'email existe ou non — sécurité
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisClient.set(`reset_password:${email}`, otp, 'EX', 900);
    // TODO: envoyer l'OTP par email (module email à faire plus tard)
    console.log(`🔑 OTP pour ${email} : ${otp}`);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const storedOtp = await this.redisClient.get(
      `reset_password:${dto.email}`,
    );
    if (!storedOtp || storedOtp !== dto.otp) {
      throw new UnauthorizedException('Code OTP invalide ou expiré');
    }
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }
    const hash = await bcrypt.hash(dto.nouveau_mot_de_passe, 12);
    await this.userRepository.update(user.id, { mot_de_passe_hash: hash });
    await this.redisClient.del(`reset_password:${dto.email}`);
  }
}