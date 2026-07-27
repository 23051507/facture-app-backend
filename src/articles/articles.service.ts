import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create(dto: CreateArticleDto): Promise<Article> {
    if (dto.code_reference) {
      const existing = await this.articleRepository.findOne({
        where: { code_reference: dto.code_reference },
      });
      if (existing) {
        throw new ConflictException('Un article avec ce code existe déjà');
      }
    }

    const article = this.articleRepository.create(dto);
    return this.articleRepository.save(article);
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{ data: Article[]; total: number }> {
    const query = this.articleRepository
      .createQueryBuilder('article')
      .where('article.est_actif = :actif', { actif: true })
      .orderBy('article.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      query.andWhere(
        '(article.designation ILIKE :search OR article.code_reference ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) throw new NotFoundException('Article introuvable');
    return article;
  }

  async update(id: string, dto: UpdateArticleDto): Promise<Article> {
    const article = await this.findOne(id);
    Object.assign(article, dto);
    return this.articleRepository.save(article);
  }

  async archiver(id: string): Promise<void> {
    const article = await this.findOne(id);
    article.est_actif = false;
    await this.articleRepository.save(article);
  }
}