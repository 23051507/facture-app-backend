import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Récupérer le profil de l'utilisateur connecté
  async getProfile(userId: string): Promise<Omit<User, 'mot_de_passe_hash'>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    const { mot_de_passe_hash, ...result } = user;
    return result;
  }

  // Modifier son profil
  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<Omit<User, 'mot_de_passe_hash'>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    // On met à jour uniquement les champs fournis
    Object.assign(user, dto);
    const saved = await this.userRepository.save(user);
    const { mot_de_passe_hash, ...result } = saved;
    return result;
  }

  // Changer son mot de passe
  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    // Vérifier l'ancien mot de passe
    const isMatch = await bcrypt.compare(
      dto.ancien_mot_de_passe,
      user.mot_de_passe_hash,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Ancien mot de passe incorrect');
    }

    // Hasher et sauvegarder le nouveau
    const hash = await bcrypt.hash(dto.nouveau_mot_de_passe, 12);
    await this.userRepository.update(userId, { mot_de_passe_hash: hash });
  }
}