import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Devis } from './devis.entity';
import { Article } from '../../articles/entities/article.entity';

@Entity('lignes_devis')
export class LigneDevis {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Devis, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'devis_id' })
  devis: Devis;

  @ManyToOne(() => Article, { nullable: true })
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @ApiProperty()
  @Column({ type: 'int' })
  ordre: number;

  @ApiProperty()
  @Column({ length: 255 })
  designation: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  quantite: number;

  @ApiProperty({ nullable: true })
  @Column({ length: 30, nullable: true })
  unite_mesure: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  prix_unitaire_ht: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taux_remise: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  montant_remise: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taux_tva: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  montant_ht_ligne: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  montant_tva_ligne: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  montant_ttc_ligne: number;
}