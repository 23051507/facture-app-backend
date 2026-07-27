import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
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

export class CreateLigneFactureDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  ordre: number;

  @ApiProperty({ example: 'Développement application mobile' })
  @IsString()
  @IsNotEmpty()
  designation: string;

  @ApiProperty({ required: false })
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

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taux_remise?: number;

  @ApiProperty({ example: 19.25, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taux_tva?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  article_id?: string;
}

export class CreateFactureDto {
  @ApiProperty({ example: 'uuid-client' })
  @IsUUID()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  contact_id?: string;

  @ApiProperty({ example: '2026-07-27' })
  @IsDateString()
  date_emission: string;

  @ApiProperty({ example: '2026-08-27' })
  @IsDateString()
  date_echeance: string;

  @ApiProperty({ example: 'Développement site web e-commerce' })
  @IsString()
  @IsNotEmpty()
  objet: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reference_interne?: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taux_remise_globale?: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  frais_supplementaires?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  libelle_frais?: string;

  @ApiProperty({ example: 'XAF', required: false })
  @IsOptional()
  @IsString()
  devise?: string;

  @ApiProperty({ required: false })
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

  @ApiProperty({ type: [CreateLigneFactureDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLigneFactureDto)
  lignes: CreateLigneFactureDto[];
}