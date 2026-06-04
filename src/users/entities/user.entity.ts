import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'ADMIN',
  CO_ADMIN = 'CO_ADMIN',
  COMMERCIAL = 'COMMERCIAL',
  COMPTABLE = 'COMPTABLE',
  LECTEUR = 'LECTEUR',
}

@Entity('utilisateurs')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ length: 100 })
  nom: string;

  @ApiProperty()
  @Column({ length: 100 })
  prenom: string;

  @ApiProperty()
  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  mot_de_passe_hash: string;

  @ApiProperty({ enum: UserRole })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.LECTEUR })
  role: UserRole;

  @ApiProperty()
  @Column({ default: true })
  est_actif: boolean;

  @ApiProperty({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  derniere_connexion: Date;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}