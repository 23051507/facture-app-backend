import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum TypeDocument {
  DEVIS = 'DEVIS',
  FACTURE = 'FACTURE',
  LES_DEUX = 'LES_DEUX',
}

@Entity('modeles_document')
export class ModeleDocument {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ length: 100 })
  nom: string;

  @ApiProperty({ enum: TypeDocument })
  @Column({ type: 'enum', enum: TypeDocument })
  type_document: TypeDocument;

  @ApiProperty()
  @Column({ type: 'jsonb' })
  configuration_json: object;

  @ApiProperty({ nullable: true })
  @Column({ length: 500, nullable: true })
  logo_url: string;

  @ApiProperty()
  @Column({ default: false })
  est_defaut: boolean;

  @ApiProperty()
  @Column({ default: false })
  est_systeme: boolean;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;
}