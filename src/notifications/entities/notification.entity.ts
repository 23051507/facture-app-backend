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
import { Facture } from '../../factures/entities/facture.entity';

export enum TypeNotification {
  REMINDER = 'reminder',
  CONFIRMATION = 'confirmation',
  ALERT = 'alert',
  INFO = 'info',
}

export enum CanalNotification {
  PUSH = 'push',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  IN_APP = 'in_app',
}

export enum StatutNotification {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

@Entity('notifications')
export class Notification {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Facture, { nullable: true })
  @JoinColumn({ name: 'facture_id' })
  facture: Facture;

  @ApiProperty({ enum: TypeNotification })
  @Column({ type: 'enum', enum: TypeNotification })
  type: TypeNotification;

  @ApiProperty({ enum: CanalNotification })
  @Column({ type: 'enum', enum: CanalNotification })
  channel: CanalNotification;

  @ApiProperty()
  @Column({ length: 255 })
  title: string;

  @ApiProperty()
  @Column({ type: 'text' })
  body: string;

  @ApiProperty({ enum: StatutNotification })
  @Column({ type: 'enum', enum: StatutNotification, default: StatutNotification.PENDING })
  status: StatutNotification;

  @ApiProperty({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  sent_at: Date;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;
}