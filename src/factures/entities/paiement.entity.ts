import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Facture } from './facture.entity';
import { User } from '../../users/entities/user.entity';

export enum ModePaiement {
  VIREMENT = 'VIREMENT',
  CHEQUE = 'CHEQUE',
  ESPECES = 'ESPECES',
  MOBILE_MONEY = 'MOBILE_MONEY',
  AUTRE = 'AUTRE',
}

@Entity('paiements')
export class Paiement {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Facture, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'facture_id' })
  facture: Facture;

  @ApiProperty()
  @Column({ type: 'date' })
  date_paiement: Date;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 14, scale: 2 })
  montant: number;

  @ApiProperty({ enum: ModePaiement })
  @Column({ type: 'enum', enum: ModePaiement })
  mode_paiement: ModePaiement;

  @ApiProperty({ nullable: true })
  @Column({ length: 100, nullable: true })
  reference_transaction: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;
}