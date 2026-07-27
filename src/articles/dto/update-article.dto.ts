import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { TypeArticle } from '../entities/article.entity';

export class UpdateArticleDto {
  @ApiProperty({ example: 'ART-001', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  code_reference?: string;

  @ApiProperty({ example: 'Développement application mobile', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  designation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: TypeArticle, required: false })
  @IsOptional()
  @IsEnum(TypeArticle)
  type_article?: TypeArticle;

  @ApiProperty({ example: 150000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  prix_unitaire_ht?: number;

  @ApiProperty({ example: 'heure', required: false })
  @IsOptional()
  @IsString()
  unite_mesure?: string;

  @ApiProperty({ example: 19.25, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taux_tva_defaut?: number;
}