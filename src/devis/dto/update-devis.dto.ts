import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsNumber,
  IsString,
  IsUUID,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLigneDevisDto } from './create-devis.dto';

export class UpdateDevisDto {
  @ApiProperty({ example: 'uuid-contact', required: false })
  @IsOptional()
  @IsUUID()
  contact_id?: string;

  @ApiProperty({ example: '2026-07-23', required: false })
  @IsOptional()
  @IsDateString()
  date_validite?: string;

  @ApiProperty({ example: 'Développement site web', required: false })
  @IsOptional()
  @IsString()
  objet?: string;

  @ApiProperty({ example: 'PROJ-2026-001', required: false })
  @IsOptional()
  @IsString()
  reference_interne?: string;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taux_remise_globale?: number;

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

  @ApiProperty({ type: [CreateLigneDevisDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLigneDevisDto)
  lignes?: CreateLigneDevisDto[];
}