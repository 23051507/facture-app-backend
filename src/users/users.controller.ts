import {
  Controller,
  Get,
  Put,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Utilisateurs')
@Controller('users')
@UseGuards(AuthGuard('jwt')) // toutes les routes sont protégées
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Récupérer son profil' })
  @ApiResponse({ status: 200, description: 'Profil récupéré avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async getProfile(@Request() req) {
    const user = await this.usersService.getProfile(req.user.id);
    return {
      success: true,
      data: user,
    };
  }

  @Put('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Modifier son profil' })
  @ApiResponse({ status: 200, description: 'Profil modifié avec succès' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(req.user.id, dto);
    return {
      success: true,
      message: 'Profil modifié avec succès',
      data: user,
    };
  }

  @Put('me/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Changer son mot de passe' })
  @ApiResponse({ status: 200, description: 'Mot de passe changé avec succès' })
  @ApiResponse({ status: 401, description: 'Ancien mot de passe incorrect' })
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    await this.usersService.changePassword(req.user.id, dto);
    return {
      success: true,
      message: 'Mot de passe changé avec succès',
    };
  }
}