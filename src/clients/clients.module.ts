import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ContactClient } from './entities/contact-client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, ContactClient])],
  exports: [TypeOrmModule],
})
export class ClientsModule {}