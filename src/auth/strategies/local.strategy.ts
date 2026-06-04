import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'mot_de_passe', // 👈 c'est ça qui manquait
    });
  }

  async validate(email: string, mot_de_passe: string) {
    const user = await this.authService.validateUser(email, mot_de_passe);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    return user;
  }
}