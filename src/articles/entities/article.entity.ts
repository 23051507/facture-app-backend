import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum TypeArticle {
  PRODUIT = 'PRODUIT',
  SERVICE = 'SERVICE',
  FORFAIT = 'FORFAIT',
  ABONNEMENT = 'ABONNEMENT',
}

@Entity('articles')
export class Article {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 50, unique: true, nullable: true })
  code_reference: string;

  @ApiProperty()
  @Column({ length: 255 })
  designation: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ enum: TypeArticle })
  @Column({ type: 'enum', enum: TypeArticle })
  type_article: TypeArticle;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  prix_unitaire_ht: number;

  @ApiProperty({ nullable: true })
  @Column({ length: 30, nullable: true })
  unite_mesure: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  taux_tva_defaut: number;

  @ApiProperty()
  @Column({ default: true })
  est_actif: boolean;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;
}