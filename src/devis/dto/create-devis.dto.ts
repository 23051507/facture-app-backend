import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLigneDevisDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  ordre: number;

  @ApiProperty({ example: 'Développement application mobile' })
  @IsString()
  @IsNotEmpty()
  designation: string;

  @ApiProperty({ example: 'Description détaillée', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(0)
  quantite: number;

  @ApiProperty({ example: 'heure', required: false })
  @IsOptional()
  @IsString()
  unite_mesure?: string;

  @ApiProperty({ example: 150000 })
  @IsNumber()
  @Min(0)
  prix_unitaire_ht: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taux_remise?: number;

  @ApiProperty({ example: 19.25, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taux_tva?: number;

  @ApiProperty({ example: 'uuid-article', required: false })
  @IsOptional()
  @IsUUID()
  article_id?: string;
}

export class CreateDevisDto {
  @ApiProperty({ example: 'uuid-client' })
  @IsUUID()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({ example: 'uuid-contact', required: false })
  @IsOptional()
  @IsUUID()
  contact_id?: string;

  @ApiProperty({ example: '2026-06-23' })
  @IsDateString()
  date_emission: string;

  @ApiProperty({ example: '2026-07-23' })
  @IsDateString()
  date_validite: string;

  @ApiProperty({ example: 'Développement site web e-commerce' })
  @IsString()
  @IsNotEmpty()
  objet: string;

  @ApiProperty({ example: 'PROJ-2026-001', required: false })
  @IsOptional()
  @IsString()
  reference_interne?: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taux_remise_globale?: number;

  @ApiProperty({ example: 'XAF', required: false })
  @IsOptional()
  @IsString()
  devise?: string;

  @ApiProperty({ example: 'Paiement à 30 jours', required: false })
  @IsOptional()
  @IsString()
  conditions_paiement?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes_client?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes_internes?: string;

  @ApiProperty({ type: [CreateLigneDevisDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLigneDevisDto)
  lignes: CreateLigneDevisDto[];
}