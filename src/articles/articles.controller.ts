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
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('Articles')
@Controller('articles')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un article' })
  @ApiResponse({ status: 201, description: 'Article créé avec succès' })
  @ApiResponse({ status: 409, description: 'Code référence déjà utilisé' })
  async create(@Body() dto: CreateArticleDto) {
    const article = await this.articlesService.create(dto);
    return {
      success: true,
      message: 'Article créé avec succès',
      data: article,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lister les articles' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Liste des articles' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    const result = await this.articlesService.findAll(+page, +limit, search);
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
  @ApiOperation({ summary: "Détail d'un article" })
  @ApiResponse({ status: 200, description: 'Article trouvé' })
  @ApiResponse({ status: 404, description: 'Article introuvable' })
  async findOne(@Param('id') id: string) {
    const article = await this.articlesService.findOne(id);
    return {
      success: true,
      data: article,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Modifier un article' })
  @ApiResponse({ status: 200, description: 'Article modifié avec succès' })
  async update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    const article = await this.articlesService.update(id, dto);
    return {
      success: true,
      message: 'Article modifié avec succès',
      data: article,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archiver un article' })
  @ApiResponse({ status: 200, description: 'Article archivé avec succès' })
  async archiver(@Param('id') id: string) {
    await this.articlesService.archiver(id);
    return {
      success: true,
      message: 'Article archivé avec succès',
    };
  }
}