import { Module } from '@nestjs/common';
import { CalculService } from './services/calcul.service';

@Module({
  providers: [CalculService],
  exports: [CalculService],
})
export class CommonModule {}