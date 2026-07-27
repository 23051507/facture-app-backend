import {
  Controller,
  Get,
  Post,
  Delete,
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
import { FacturesService } from './factures.service';
import { CreateFactureDto } from './dto/create-facture.dto';
import { EnregistrerPaiementDto } from './dto/enregistrer-paiement.dto';

@ApiTags('Factures')
@Controller('factures')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class FacturesController {
  constructor(private readonly facturesService: FacturesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une facture manuellement' })
  @ApiResponse({ status: 201, description: 'Facture créée avec succès' })
  async create(@Body() dto: CreateFactureDto, @Request() req) {
    const facture = await this.facturesService.create(dto, req.user);
    return {
      success: true,
      message: 'Facture créée avec succès',
      data: facture,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lister les factures' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Liste des factures' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const result = await this.facturesService.findAll(+page, +limit);
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
  @ApiOperation({ summary: "Détail d'une facture" })
  @ApiResponse({ status: 200, description: 'Facture trouvée' })
  @ApiResponse({ status: 404, description: 'Facture introuvable' })
  async findOne(@Param('id') id: string) {
    const facture = await this.facturesService.findOne(id);
    return {
      success: true,
      data: facture,
    };
  }

  @Post('from-devis/:devisId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Convertir un devis en facture' })
  @ApiResponse({ status: 201, description: 'Facture créée depuis le devis' })
  async convertirDevis(
    @Param('devisId') devisId: string,
    @Request() req,
  ) {
    const facture = await this.facturesService.convertirDevisEnFacture(
      devisId,
      req.user,
    );
    return {
      success: true,
      message: 'Devis converti en facture avec succès',
      data: facture,
    };
  }

  @Post(':id/duplicate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Dupliquer une facture' })
  @ApiResponse({ status: 201, description: 'Facture dupliquée' })
  async dupliquer(@Param('id') id: string, @Request() req) {
    const facture = await this.facturesService.dupliquer(id, req.user);
    return {
      success: true,
      message: 'Facture dupliquée avec succès',
      data: facture,
    };
  }

  @Post(':id/payment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enregistrer un paiement' })
  @ApiResponse({ status: 200, description: 'Paiement enregistré' })
  @ApiResponse({ status: 400, description: 'Paiement invalide' })
  async enregistrerPaiement(
    @Param('id') id: string,
    @Body() dto: EnregistrerPaiementDto,
    @Request() req,
  ) {
    const facture = await this.facturesService.enregistrerPaiement(
      id,
      dto,
      req.user,
    );
    return {
      success: true,
      message: 'Paiement enregistré avec succès',
      data: facture,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Annuler une facture' })
  @ApiResponse({ status: 200, description: 'Facture annulée' })
  @ApiResponse({ status: 400, description: 'Facture non annulable' })
  async annuler(@Param('id') id: string) {
    const facture = await this.facturesService.annuler(id);
    return {
      success: true,
      message: 'Facture annulée avec succès',
      data: facture,
    };
  }
}