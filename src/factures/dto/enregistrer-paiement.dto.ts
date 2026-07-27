import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ModePaiement } from '../entities/paiement.entity';

export class EnregistrerPaiementDto {
  @ApiProperty({ example: '2026-07-27' })
  @IsDateString()
  date_paiement: string;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @Min(0)
  montant: number;

  @ApiProperty({ enum: ModePaiement, example: ModePaiement.VIREMENT })
  @IsEnum(ModePaiement)
  mode_paiement: ModePaiement;

  @ApiProperty({ example: 'VIR-2026-001', required: false })
  @IsOptional()
  @IsString()
  reference_transaction?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}