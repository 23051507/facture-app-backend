import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum TypeClient {
  PARTICULIER = 'PARTICULIER',
  ENTREPRISE = 'ENTREPRISE',
  PME = 'PME',
  ADMINISTRATION = 'ADMINISTRATION',
}

@Entity('clients')
export class Client {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ length: 200 })
  raison_sociale: string;

  @ApiProperty({ enum: TypeClient })
  @Column({ type: 'enum', enum: TypeClient })
  type_client: TypeClient;

  @ApiProperty({ nullable: true })
  @Column({ unique: true, length: 255, nullable: true })
  email: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 30, nullable: true })
  telephone: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 255, nullable: true })
  adresse_rue: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 100, nullable: true })
  adresse_ville: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 20, nullable: true })
  adresse_code_postal: string;

  @ApiProperty()
  @Column({ length: 100, default: 'Cameroun' })
  adresse_pays: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 50, nullable: true })
  numero_tva: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 100, nullable: true })
  numero_registre: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  notes_internes: string;

  @ApiProperty()
  @Column({ default: true })
  est_actif: boolean;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}