import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { TypeClient } from '../entities/client.entity';

export class UpdateClientDto {
  @ApiProperty({ example: 'Temi Services SARL', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  raison_sociale?: string;

  @ApiProperty({ enum: TypeClient, required: false })
  @IsOptional()
  @IsEnum(TypeClient)
  type_client?: TypeClient;

  @ApiProperty({ example: 'contact@temiservices.cm', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+237600000000', required: false })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  adresse_rue?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  adresse_ville?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  adresse_code_postal?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  adresse_pays?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  numero_tva?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  numero_registre?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes_internes?: string;
}