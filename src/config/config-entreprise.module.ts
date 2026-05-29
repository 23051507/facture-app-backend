import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEntreprise } from './entities/config-entreprise.entity';
import { ModeleDocument } from './entities/modele-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigEntreprise, ModeleDocument])],
  exports: [TypeOrmModule],
})
export class ConfigEntrepriseModule {}