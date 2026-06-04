import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Client } from './client.entity';

@Entity('contacts_client')
export class ContactClient {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ApiProperty()
  @Column({ length: 100 })
  nom: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 100, nullable: true })
  prenom: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 100, nullable: true })
  poste: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 255, nullable: true })
  email: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 30, nullable: true })
  telephone: string;

  @ApiProperty()
  @Column({ default: false })
  est_principal: boolean;
}