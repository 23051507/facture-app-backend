import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Devis, StatutDevis } from './entities/devis.entity';
import { LigneDevis } from './entities/ligne-devis.entity';
import { Client } from '../clients/entities/client.entity';
import { User } from '../users/entities/user.entity';
import { CalculService } from '../common/services/calcul.service';
import { CreateDevisDto } from './dto/create-devis.dto';
import { UpdateDevisDto } from './dto/update-devis.dto';

@Injectable()
export class DevisService {
  constructor(
    @InjectRepository(Devis)
    private readonly devisRepository: Repository<Devis>,
    @InjectRepository(LigneDevis)
    private readonly ligneDevisRepository: Repository<LigneDevis>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly calculService: CalculService,
  ) {}

  private async genererNumeroDevis(): Promise<string> {
    const annee = new Date().getFullYear();
    const count = await this.devisRepository.count();
    const numero = String(count + 1).padStart(3, '0');
    return `DEV-${annee}-${numero}`;
  }

  async create(dto: CreateDevisDto, user: User): Promise<Devis> {
    const client = await this.clientRepository.findOne({
      where: { id: dto.client_id },
    });
    if (!client) throw new NotFoundException('Client introuvable');

    const lignesCalculees = dto.lignes.map((ligne) => {
      const calcul = this.calculService.calculerLigne({
        quantite: ligne.quantite,
        prix_unitaire_ht: ligne.prix_unitaire_ht,
        taux_remise: ligne.taux_remise ?? 0,
        taux_tva: ligne.taux_tva ?? 0,
      });
      return { ...ligne, ...calcul };
    });

    const totaux = this.calculService.calculerDocument({
      lignes: lignesCalculees,
      taux_remise_globale: dto.taux_remise_globale ?? 0,
      frais_supplementaires: 0,
    });

    const devis = this.devisRepository.create({
      numero_devis: await this.genererNumeroDevis(),
      client: { id: dto.client_id },
      contact: dto.contact_id ? { id: dto.contact_id } : undefined,
      date_emission: new Date(dto.date_emission),
      date_validite: new Date(dto.date_validite),
      objet: dto.objet,
      reference_interne: dto.reference_interne,
      taux_remise_globale: dto.taux_remise_globale ?? 0,
      montant_remise_globale: totaux.montant_remise_globale,
      devise: dto.devise ?? 'XAF',
      conditions_paiement: dto.conditions_paiement,
      notes_client: dto.notes_client,
      notes_internes: dto.notes_internes,
      montant_ht: totaux.montant_ht,
      montant_tva: totaux.montant_tva,
      montant_ttc: totaux.montant_ttc,
      statut: StatutDevis.BROUILLON,
      created_by: user,
    });

    const devisSaved = await this.devisRepository.save(devis);

    const lignes = lignesCalculees.map((ligne) =>
      this.ligneDevisRepository.create({
        devis: { id: devisSaved.id },
        article: ligne.article_id ? { id: ligne.article_id } : undefined,
        ordre: ligne.ordre,
        designation: ligne.designation,
        description: ligne.description,
        quantite: ligne.quantite,
        unite_mesure: ligne.unite_mesure,
        prix_unitaire_ht: ligne.prix_unitaire_ht,
        taux_remise: ligne.taux_remise ?? 0,
        montant_remise: ligne.montant_remise,
        taux_tva: ligne.taux_tva ?? 0,
        montant_ht_ligne: ligne.montant_ht_ligne,
        montant_tva_ligne: ligne.montant_tva_ligne,
        montant_ttc_ligne: ligne.montant_ttc_ligne,
      }),
    );

    await this.ligneDevisRepository.save(lignes);
    return this.findOne(devisSaved.id);
  }

  async findAll(page = 1, limit = 10): Promise<{ data: Devis[]; total: number }> {
    const [data, total] = await this.devisRepository.findAndCount({
      relations: { client: true, created_by: true },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findOne(id: string): Promise<Devis> {
    const devis = await this.devisRepository.findOne({
      where: { id },
      relations: {
        client: true,
        contact: true,
        created_by: true,
        lignes: { article: true },
      },
    });
    if (!devis) throw new NotFoundException('Devis introuvable');
    return devis;
  }

  async update(id: string, dto: UpdateDevisDto): Promise<Devis> {
    const devis = await this.findOne(id);

    if (devis.statut !== StatutDevis.BROUILLON) {
      throw new BadRequestException('Seul un devis en brouillon peut être modifié');
    }

    if (dto.lignes) {
      await this.ligneDevisRepository.delete({ devis: { id } });

      const lignesCalculees = dto.lignes.map((ligne) => {
        const calcul = this.calculService.calculerLigne({
          quantite: ligne.quantite,
          prix_unitaire_ht: ligne.prix_unitaire_ht,
          taux_remise: ligne.taux_remise ?? 0,
          taux_tva: ligne.taux_tva ?? 0,
        });
        return { ...ligne, ...calcul };
      });

      const totaux = this.calculService.calculerDocument({
        lignes: lignesCalculees,
        taux_remise_globale: dto.taux_remise_globale ?? devis.taux_remise_globale,
        frais_supplementaires: 0,
      });

      const lignes = lignesCalculees.map((ligne) =>
        this.ligneDevisRepository.create({
          devis: { id },
          ordre: ligne.ordre,
          designation: ligne.designation,
          description: ligne.description,
          quantite: ligne.quantite,
          unite_mesure: ligne.unite_mesure,
          prix_unitaire_ht: ligne.prix_unitaire_ht,
          taux_remise: ligne.taux_remise ?? 0,
          montant_remise: ligne.montant_remise,
          taux_tva: ligne.taux_tva ?? 0,
          montant_ht_ligne: ligne.montant_ht_ligne,
          montant_tva_ligne: ligne.montant_tva_ligne,
          montant_ttc_ligne: ligne.montant_ttc_ligne,
        }),
      );

      await this.ligneDevisRepository.save(lignes);

      Object.assign(devis, {
        ...dto,
        montant_ht: totaux.montant_ht,
        montant_tva: totaux.montant_tva,
        montant_ttc: totaux.montant_ttc,
        montant_remise_globale: totaux.montant_remise_globale,
        lignes: undefined,
      });
    } else {
      Object.assign(devis, dto);
    }

    await this.devisRepository.save(devis);
    return this.findOne(id);
  }

  async envoyer(id: string): Promise<Devis> {
    const devis = await this.findOne(id);
    if (devis.statut !== StatutDevis.BROUILLON) {
      throw new BadRequestException('Seul un devis en brouillon peut être envoyé');
    }
    devis.statut = StatutDevis.ENVOYE;
    return this.devisRepository.save(devis);
  }

  async convertirEnFacture(id: string): Promise<{ message: string; devis_id: string }> {
    const devis = await this.findOne(id);
    if (devis.statut !== StatutDevis.ACCEPTE) {
      throw new BadRequestException('Seul un devis accepté peut être converti en facture');
    }
    return {
      message: 'Devis prêt pour conversion en facture',
      devis_id: devis.id,
    };
  }

  async dupliquer(id: string, user: User): Promise<Devis> {
    const devis = await this.findOne(id);

    const nouveau = this.devisRepository.create({
      ...devis,
      id: undefined,
      numero_devis: await this.genererNumeroDevis(),
      statut: StatutDevis.BROUILLON,
      created_by: user,
      created_at: undefined,
      updated_at: undefined,
    });

    const saved = await this.devisRepository.save(nouveau);

    const lignes = devis.lignes.map((ligne) =>
      this.ligneDevisRepository.create({
        ...ligne,
        id: undefined,
        devis: { id: saved.id },
      }),
    );

    await this.ligneDevisRepository.save(lignes);
    return this.findOne(saved.id);
  }
}