import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DevisService } from './devis.service';
import { CreateDevisDto } from './dto/create-devis.dto';
import { UpdateDevisDto } from './dto/update-devis.dto';

@ApiTags('Devis')
@Controller('devis')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class DevisController {
  constructor(private readonly devisService: DevisService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un devis' })
  @ApiResponse({ status: 201, description: 'Devis créé avec succès' })
  async create(@Body() dto: CreateDevisDto, @Request() req) {
    const devis = await this.devisService.create(dto, req.user);
    return {
      success: true,
      message: 'Devis créé avec succès',
      data: devis,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lister les devis' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Liste des devis' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const result = await this.devisService.findAll(+page, +limit);
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
  @ApiOperation({ summary: 'Détail d\'un devis' })
  @ApiResponse({ status: 200, description: 'Devis trouvé' })
  @ApiResponse({ status: 404, description: 'Devis introuvable' })
  async findOne(@Param('id') id: string) {
    const devis = await this.devisService.findOne(id);
    return {
      success: true,
      data: devis,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Modifier un devis' })
  @ApiResponse({ status: 200, description: 'Devis modifié avec succès' })
  @ApiResponse({ status: 400, description: 'Devis non modifiable' })
  async update(@Param('id') id: string, @Body() dto: UpdateDevisDto) {
    const devis = await this.devisService.update(id, dto);
    return {
      success: true,
      message: 'Devis modifié avec succès',
      data: devis,
    };
  }

  @Post(':id/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Envoyer un devis au client' })
  @ApiResponse({ status: 200, description: 'Devis envoyé' })
  async envoyer(@Param('id') id: string) {
    const devis = await this.devisService.envoyer(id);
    return {
      success: true,
      message: 'Devis envoyé au client',
      data: devis,
    };
  }

  @Post(':id/convert')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Convertir un devis en facture' })
  @ApiResponse({ status: 200, description: 'Devis converti en facture' })
  @ApiResponse({ status: 400, description: 'Devis non convertible' })
  async convertir(@Param('id') id: string) {
    return this.devisService.convertirEnFacture(id);
  }

  @Post(':id/duplicate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Dupliquer un devis' })
  @ApiResponse({ status: 201, description: 'Devis dupliqué' })
  async dupliquer(@Param('id') id: string, @Request() req) {
    const devis = await this.devisService.dupliquer(id, req.user);
    return {
      success: true,
      message: 'Devis dupliqué avec succès',
      data: devis,
    };
  }
}