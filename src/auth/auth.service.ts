import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Inject } from '@nestjs/common';
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

  // Vérifie email + mot de passe — utilisé par LocalStrategy
  async validateUser(email: string, mot_de_passe: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) return null; // utilisateur introuvable

    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe_hash);
    if (!isMatch) return null; // mauvais mot de passe

    const { mot_de_passe_hash, ...result } = user;
    return result; // retourne l'user sans le hash
  }

  // Génère les tokens JWT après connexion
  async login(user: Omit<User, 'mot_de_passe_hash'>) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '30d',
    });

    // Mettre à jour la dernière connexion
    await this.userRepository.update(user.id, {
      derniere_connexion: new Date(),
    });

    return {
      access_token,  // token court — pour les requêtes API
      refresh_token, // token long — pour renouveler l'access token
      user,
    };
  }
    async logout(token: string, userId: string): Promise<void> {
    // Décoder le token pour récupérer son expiration
    const decoded = this.jwtService.decode(token) as { exp: number };

    if (decoded?.exp) {
      const now = Math.floor(Date.now() / 1000); // temps actuel en secondes
      const ttl = decoded.exp - now; // temps restant avant expiration

      if (ttl > 0) {
        // Stocker le token dans Redis jusqu'à son expiration naturelle
        await this.redisClient.set(
          `blacklist:${token}`,
          userId,
          'EX',
          ttl,
        );
      }
    }
  }
}