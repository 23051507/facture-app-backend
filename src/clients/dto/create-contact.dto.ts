import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Taka' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nom: string;

  @ApiProperty({ example: 'Michel', required: false })
  @IsOptional()
  @IsString()
  prenom?: string;

  @ApiProperty({ example: 'Directeur Commercial', required: false })
  @IsOptional()
  @IsString()
  poste?: string;

  @ApiProperty({ example: 'taka@temiservices.cm', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+237600000000', required: false })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  est_principal?: boolean;
}