import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('Clients')
@Controller('clients')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un client' })
  @ApiResponse({ status: 201, description: 'Client créé avec succès' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  async create(@Body() dto: CreateClientDto) {
    const client = await this.clientsService.create(dto);
    return {
      success: true,
      message: 'Client créé avec succès',
      data: client,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lister les clients' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Liste des clients' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    const result = await this.clientsService.findAll(+page, +limit, search);
    return {
      success: true,
      data: result.data,
      total: result.total,
      page: +page,
      limit: +limit,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Détail d'un client" })
  @ApiResponse({ status: 200, description: 'Client trouvé' })
  @ApiResponse({ status: 404, description: 'Client introuvable' })
  async findOne(@Param('id') id: string) {
    const client = await this.clientsService.findOne(id);
    return {
      success: true,
      data: client,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Modifier un client' })
  @ApiResponse({ status: 200, description: 'Client modifié avec succès' })
  async update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    const client = await this.clientsService.update(id, dto);
    return {
      success: true,
      message: 'Client modifié avec succès',
      data: client,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archiver un client' })
  @ApiResponse({ status: 200, description: 'Client archivé avec succès' })
  async archiver(@Param('id') id: string) {
    await this.clientsService.archiver(id);
    return {
      success: true,
      message: 'Client archivé avec succès',
    };
  }

  @Post(':id/contacts')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter un contact au client' })
  @ApiResponse({ status: 201, description: 'Contact ajouté avec succès' })
  async ajouterContact(
    @Param('id') id: string,
    @Body() dto: CreateContactDto,
  ) {
    const contact = await this.clientsService.ajouterContact(id, dto);
    return {
      success: true,
      message: 'Contact ajouté avec succès',
      data: contact,
    };
  }

  @Put(':id/contacts/:contactId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Modifier un contact' })
  @ApiResponse({ status: 200, description: 'Contact modifié avec succès' })
  async modifierContact(
    @Param('id') id: string,
    @Param('contactId') contactId: string,
    @Body() dto: CreateContactDto,
  ) {
    const contact = await this.clientsService.modifierContact(
      id,
      contactId,
      dto,
    );
    return {
      success: true,
      message: 'Contact modifié avec succès',
      data: contact,
    };
  }

  @Delete(':id/contacts/:contactId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un contact' })
  @ApiResponse({ status: 200, description: 'Contact supprimé avec succès' })
  async supprimerContact(
    @Param('id') id: string,
    @Param('contactId') contactId: string,
  ) {
    await this.clientsService.supprimerContact(id, contactId);
    return {
      success: true,
      message: 'Contact supprimé avec succès',
    };
  }
}