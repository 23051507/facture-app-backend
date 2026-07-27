import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facture } from './entities/facture.entity';
import { LigneFacture } from './entities/ligne-facture.entity';
import { Paiement } from './entities/paiement.entity';
import { Devis } from '../devis/entities/devis.entity';
import { LigneDevis } from '../devis/entities/ligne-devis.entity';
import { FacturesService } from './factures.service';
import { FacturesController } from './factures.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Facture,
      LigneFacture,
      Paiement,
      Devis,
      LigneDevis,
    ]),
    CommonModule,
  ],
  controllers: [FacturesController],
  providers: [FacturesService],
  exports: [FacturesService],
})
export class FacturesModule {}