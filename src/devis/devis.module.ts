import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Devis } from './entities/devis.entity';
import { LigneDevis } from './entities/ligne-devis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Devis, LigneDevis])],
  exports: [TypeOrmModule],
})
export class DevisModule {}