import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'Taka' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'Michel' })
  @IsString()
  @IsNotEmpty()
  prenom: string;

  @ApiProperty({ example: 'michel@temiservices.cm' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'MotDePasse123!' })
  @IsString()
  @MinLength(8)
  mot_de_passe: string;

  @ApiProperty({ enum: UserRole, example: UserRole.COMMERCIAL })
  @IsEnum(UserRole)
  role: UserRole;
}