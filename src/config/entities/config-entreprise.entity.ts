import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('config_entreprise')
export class ConfigEntreprise {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ length: 200 })
  nom_entreprise: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  adresse_complete: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 255, nullable: true })
  email_contact: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 30, nullable: true })
  telephone: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 50, nullable: true })
  numero_tva: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 100, nullable: true })
  numero_rccm: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 500, nullable: true })
  logo_url: string;

  @ApiProperty()
  @Column({ length: 20, default: 'DEV' })
  prefixe_devis: string;

  @ApiProperty()
  @Column({ length: 20, default: 'FACT' })
  prefixe_facture: string;

  @ApiProperty()
  @Column({ default: 0 })
  compteur_devis: number;

  @ApiProperty()
  @Column({ default: 0 })
  compteur_facture: number;

  @ApiProperty()
  @Column({ length: 3, default: 'XAF' })
  devise_defaut: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 19.25 })
  taux_tva_defaut: number;

  @ApiProperty()
  @Column({ default: 30 })
  delai_paiement_defaut: number;
}