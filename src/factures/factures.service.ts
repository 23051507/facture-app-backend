import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Facture, StatutFacture } from './entities/facture.entity';
import { LigneFacture } from './entities/ligne-facture.entity';
import { Devis, StatutDevis } from '../devis/entities/devis.entity';
import { LigneDevis } from '../devis/entities/ligne-devis.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FacturesService {
  constructor(
    @InjectRepository(Facture)
    private readonly factureRepository: Repository<Facture>,
    @InjectRepository(LigneFacture)
    private readonly ligneFactureRepository: Repository<LigneFacture>,
    @InjectRepository(Devis)
    private readonly devisRepository: Repository<Devis>,
    @InjectRepository(LigneDevis)
    private readonly ligneDevisRepository: Repository<LigneDevis>,
  ) {}

  private async genererNumeroFacture(): Promise<string> {
    const annee = new Date().getFullYear();
    const count = await this.factureRepository.count();
    const numero = String(count + 1).padStart(3, '0');
    return `FACT-${annee}-${numero}`;
  }

  async convertirDevisEnFacture(devisId: string, user: User): Promise<Facture> {
    const devis = await this.devisRepository.findOne({
      where: { id: devisId },
      relations: {
        client: true,
        contact: true,
        lignes: { article: true },
      },
    });

    if (!devis) throw new NotFoundException('Devis introuvable');

    if (devis.statut !== StatutDevis.ACCEPTE) {
      throw new BadRequestException(
        'Seul un devis accepté peut être converti en facture',
      );
    }

    const dateEcheance = new Date();
    dateEcheance.setDate(dateEcheance.getDate() + 30);

    const facture = this.factureRepository.create({
      numero_facture: await this.genererNumeroFacture(),
      devis: { id: devis.id },
      client: { id: devis.client.id },
      contact: devis.contact ? { id: devis.contact.id } : undefined,
      statut: StatutFacture.EMISE,
      date_emission: new Date(),
      date_echeance: dateEcheance,
      objet: devis.objet,
      reference_interne: devis.reference_interne,
      montant_ht: devis.montant_ht,
      montant_remise_globale: devis.montant_remise_globale,
      taux_remise_globale: devis.taux_remise_globale,
      montant_tva: devis.montant_tva,
      montant_ttc: devis.montant_ttc,
      montant_paye: 0,
      montant_restant: devis.montant_ttc,
      devise: devis.devise,
      conditions_paiement: devis.conditions_paiement,
      notes_client: devis.notes_client,
      notes_internes: devis.notes_internes,
      created_by: user,
    });

    const factureSaved = await this.factureRepository.save(facture);

    const lignesFacture = devis.lignes.map((ligne: LigneDevis) =>
      this.ligneFactureRepository.create({
        facture: { id: factureSaved.id },
        article: ligne.article ? { id: ligne.article.id } : undefined,
        ordre: ligne.ordre,
        designation: ligne.designation,
        description: ligne.description,
        quantite: ligne.quantite,
        unite_mesure: ligne.unite_mesure,
        prix_unitaire_ht: ligne.prix_unitaire_ht,
        taux_remise: ligne.taux_remise,
        montant_remise: ligne.montant_remise,
        taux_tva: ligne.taux_tva,
        montant_ht_ligne: ligne.montant_ht_ligne,
        montant_tva_ligne: ligne.montant_tva_ligne,
        montant_ttc_ligne: ligne.montant_ttc_ligne,
      }),
    );

    await this.ligneFactureRepository.save(lignesFacture);

    await this.devisRepository.update(devis.id, {
      statut: StatutDevis.ACCEPTE,
    });

    return this.findOne(factureSaved.id);
  }

  async findAll(page = 1, limit = 10): Promise<{ data: Facture[]; total: number }> {
    const [data, total] = await this.factureRepository.findAndCount({
      relations: { client: true, created_by: true },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findOne(id: string): Promise<Facture> {
    const facture = await this.factureRepository.findOne({
      where: { id },
      relations: {
        client: true,
        contact: true,
        devis: true,
        lignes: { article: true },
        created_by: true,
      },
    });
    if (!facture) throw new NotFoundException('Facture introuvable');
    return facture;
  }
}