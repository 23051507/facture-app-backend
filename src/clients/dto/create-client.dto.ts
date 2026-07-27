import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { TypeClient } from '../entities/client.entity';

export class CreateClientDto {
  @ApiProperty({ example: 'Temi Services SARL' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  raison_sociale: string;

  @ApiProperty({ enum: TypeClient, example: TypeClient.ENTREPRISE })
  @IsEnum(TypeClient)
  type_client: TypeClient;

  @ApiProperty({ example: 'contact@temiservices.cm', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+237600000000', required: false })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiProperty({ example: '123 Rue de la Paix', required: false })
  @IsOptional()
  @IsString()
  adresse_rue?: string;

  @ApiProperty({ example: 'Yaoundé', required: false })
  @IsOptional()
  @IsString()
  adresse_ville?: string;

  @ApiProperty({ example: '00237', required: false })
  @IsOptional()
  @IsString()
  adresse_code_postal?: string;

  @ApiProperty({ example: 'Cameroun', required: false })
  @IsOptional()
  @IsString()
  adresse_pays?: string;

  @ApiProperty({ example: 'CM123456789', required: false })
  @IsOptional()
  @IsString()
  numero_tva?: string;

  @ApiProperty({ example: 'RC/YAO/2026/001', required: false })
  @IsOptional()
  @IsString()
  numero_registre?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes_internes?: string;
}