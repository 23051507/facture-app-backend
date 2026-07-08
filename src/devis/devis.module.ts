import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Devis } from './entities/devis.entity';
import { LigneDevis } from './entities/ligne-devis.entity';
import { Client } from '../clients/entities/client.entity';
import { DevisService } from './devis.service';
import { DevisController } from './devis.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Devis, LigneDevis, Client]),
    CommonModule,
  ],
  controllers: [DevisController],
  providers: [DevisService],
  exports: [DevisService],
})
export class DevisModule {}