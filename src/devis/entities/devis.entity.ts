import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Client } from '../../clients/entities/client.entity';
import { ContactClient } from '../../clients/entities/contact-client.entity';
import { ModeleDocument } from '../../config/entities/modele-document.entity';
import { LigneDevis } from './ligne-devis.entity';

export enum StatutDevis {
  BROUILLON = 'BROUILLON',
  ENVOYE = 'ENVOYE',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
  EXPIRE = 'EXPIRE',
}

@Entity('devis')
export class Devis {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ unique: true, length: 50 })
  numero_devis: string;

  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => ContactClient, { nullable: true })
  @JoinColumn({ name: 'contact_id' })
  contact: ContactClient;

  @ApiProperty({ enum: StatutDevis })
  @Column({ type: 'enum', enum: StatutDevis, default: StatutDevis.BROUILLON })
  statut: StatutDevis;

  @ApiProperty()
  @Column({ type: 'date' })
  date_emission: Date;

  @ApiProperty()
  @Column({ type: 'date' })
  date_validite: Date;

  @ApiProperty({ nullable: true })
  @Column({ type: 'date', nullable: true })
  date_acceptation: Date;

  @ApiProperty()
  @Column({ length: 500 })
  objet: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 100, nullable: true })
  reference_interne: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  montant_ht: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  montant_remise_globale: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taux_remise_globale: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  montant_tva: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  montant_ttc: number;

  @ApiProperty()
  @Column({ length: 3, default: 'XAF' })
  devise: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  conditions_paiement: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  notes_client: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  notes_internes: string;

  @ManyToOne(() => ModeleDocument, { nullable: true })
  @JoinColumn({ name: 'modele_id' })
  modele: ModeleDocument;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @OneToMany(() => LigneDevis, (ligne) => ligne.devis)
  lignes: LigneDevis[];

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}