import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { ContactClient } from './entities/contact-client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(ContactClient)
    private readonly contactRepository: Repository<ContactClient>,
  ) {}

  // Créer un client
  async create(dto: CreateClientDto): Promise<Client> {
    if (dto.email) {
      const existing = await this.clientRepository.findOne({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException('Un client avec cet email existe déjà');
      }
    }

    const client = this.clientRepository.create(dto);
    return this.clientRepository.save(client);
  }

  // Lister les clients
  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{ data: Client[]; total: number }> {
    const query = this.clientRepository.createQueryBuilder('client')
      .where('client.est_actif = :actif', { actif: true })
      .orderBy('client.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      query.andWhere(
        '(client.raison_sociale ILIKE :search OR client.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  // Détail d'un client
  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: { contacts: true },
    });
    if (!client) throw new NotFoundException('Client introuvable');
    return client;
  }

  // Modifier un client
  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, dto);
    return this.clientRepository.save(client);
  }

  // Archiver un client (soft delete)
  async archiver(id: string): Promise<void> {
    const client = await this.findOne(id);
    client.est_actif = false;
    await this.clientRepository.save(client);
  }

  // Ajouter un contact
  async ajouterContact(
    clientId: string,
    dto: CreateContactDto,
  ): Promise<ContactClient> {
    const client = await this.findOne(clientId);

    // Si ce contact est principal, enlever le principal actuel
    if (dto.est_principal) {
      await this.contactRepository.update(
        { client: { id: clientId }, est_principal: true },
        { est_principal: false },
      );
    }

    const contact = this.contactRepository.create({
      ...dto,
      client: { id: client.id },
    });
    return this.contactRepository.save(contact);
  }

  // Modifier un contact
  async modifierContact(
    clientId: string,
    contactId: string,
    dto: CreateContactDto,
  ): Promise<ContactClient> {
    const contact = await this.contactRepository.findOne({
      where: { id: contactId, client: { id: clientId } },
    });
    if (!contact) throw new NotFoundException('Contact introuvable');

    if (dto.est_principal) {
      await this.contactRepository.update(
        { client: { id: clientId }, est_principal: true },
        { est_principal: false },
      );
    }

    Object.assign(contact, dto);
    return this.contactRepository.save(contact);
  }

  // Supprimer un contact
  async supprimerContact(
    clientId: string,
    contactId: string,
  ): Promise<void> {
    const contact = await this.contactRepository.findOne({
      where: { id: contactId, client: { id: clientId } },
    });
    if (!contact) throw new NotFoundException('Contact introuvable');
    await this.contactRepository.remove(contact);
  }
}