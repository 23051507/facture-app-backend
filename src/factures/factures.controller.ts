import {
  Controller,
  Get,
  Post,
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

@ApiTags('Factures')
@Controller('factures')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class FacturesController {
  constructor(private readonly facturesService: FacturesService) {}

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
  @ApiResponse({ status: 400, description: 'Devis non convertible' })
  @ApiResponse({ status: 404, description: 'Devis introuvable' })
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
}