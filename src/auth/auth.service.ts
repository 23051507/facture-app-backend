import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(dto: RegisterDto): Promise<Omit<User, 'mot_de_passe_hash'>> {
    // Vérifier si l'email existe déjà
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Un compte avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const hash = await bcrypt.hash(dto.mot_de_passe, 12);

    // Créer l'utilisateur
    const user = this.userRepository.create({
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      mot_de_passe_hash: hash,
      role: dto.role,
    });

    try {
      const saved = await this.userRepository.save(user);
      // Ne jamais retourner le hash du mot de passe
      const { mot_de_passe_hash, ...result } = saved;
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        "Erreur lors de la création du compte",
      );
    }
  }
}