import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facture } from './entities/facture.entity';
import { LigneFacture } from './entities/ligne-facture.entity';
import { Paiement } from './entities/paiement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Facture, LigneFacture, Paiement])],
  exports: [TypeOrmModule],
})
export class FacturesModule {}