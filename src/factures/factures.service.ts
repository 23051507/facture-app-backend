import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Facture, StatutFacture } from './entities/facture.entity';
import { LigneFacture } from './entities/ligne-facture.entity';
import { Paiement } from './entities/paiement.entity';
import { Devis, StatutDevis } from '../devis/entities/devis.entity';
import { LigneDevis } from '../devis/entities/ligne-devis.entity';
import { User } from '../users/entities/user.entity';
import { CalculService } from '../common/services/calcul.service';
import { CreateFactureDto } from './dto/create-facture.dto';
import { EnregistrerPaiementDto } from './dto/enregistrer-paiement.dto';

@Injectable()
export class FacturesService {
  constructor(
    @InjectRepository(Facture)
    private readonly factureRepository: Repository<Facture>,
    @InjectRepository(LigneFacture)
    private readonly ligneFactureRepository: Repository<LigneFacture>,
    @InjectRepository(Paiement)
    private readonly paiementRepository: Repository<Paiement>,
    @InjectRepository(Devis)
    private readonly devisRepository: Repository<Devis>,
    @InjectRepository(LigneDevis)
    private readonly ligneDevisRepository: Repository<LigneDevis>,
    private readonly calculService: CalculService,
  ) {}

  private async genererNumeroFacture(): Promise<string> {
    const annee = new Date().getFullYear();
    const count = await this.factureRepository.count();
    const numero = String(count + 1).padStart(3, '0');
    return `FACT-${annee}-${numero}`;
  }

  // Créer une facture manuellement
  async create(dto: CreateFactureDto, user: User): Promise<Facture> {
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
      frais_supplementaires: dto.frais_supplementaires ?? 0,
    });

    const facture = this.factureRepository.create({
      numero_facture: await this.genererNumeroFacture(),
      client: { id: dto.client_id },
      contact: dto.contact_id ? { id: dto.contact_id } : undefined,
      statut: StatutFacture.BROUILLON,
      date_emission: new Date(dto.date_emission),
      date_echeance: new Date(dto.date_echeance),
      objet: dto.objet,
      reference_interne: dto.reference_interne,
      taux_remise_globale: dto.taux_remise_globale ?? 0,
      montant_remise_globale: totaux.montant_remise_globale,
      frais_supplementaires: dto.frais_supplementaires ?? 0,
      libelle_frais: dto.libelle_frais,
      montant_ht: totaux.montant_ht,
      montant_tva: totaux.montant_tva,
      montant_ttc: totaux.montant_ttc,
      montant_paye: 0,
      montant_restant: totaux.montant_ttc,
      devise: dto.devise ?? 'XAF',
      conditions_paiement: dto.conditions_paiement,
      notes_client: dto.notes_client,
      notes_internes: dto.notes_internes,
      created_by: user,
    });

    const factureSaved = await this.factureRepository.save(facture);

    const lignes = lignesCalculees.map((ligne) =>
      this.ligneFactureRepository.create({
        facture: { id: factureSaved.id },
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

    await this.ligneFactureRepository.save(lignes);
    return this.findOne(factureSaved.id);
  }

  // Convertir un devis en facture
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
    await this.devisRepository.update(devis.id, { statut: StatutDevis.ACCEPTE });
    return this.findOne(factureSaved.id);
  }

  // Lister les factures
  async findAll(page = 1, limit = 10): Promise<{ data: Facture[]; total: number }> {
    const [data, total] = await this.factureRepository.findAndCount({
      relations: { client: true, created_by: true },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  // Détail d'une facture
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

  // Dupliquer une facture
  async dupliquer(id: string, user: User): Promise<Facture> {
    const facture = await this.findOne(id);

    const nouvelle = this.factureRepository.create({
      ...facture,
      id: undefined,
      numero_facture: await this.genererNumeroFacture(),
      statut: StatutFacture.BROUILLON,
      montant_paye: 0,
      montant_restant: facture.montant_ttc,
      created_by: user,
      created_at: undefined,
      updated_at: undefined,
      devis: undefined,
    });

    const saved = await this.factureRepository.save(nouvelle);

    const lignes = facture.lignes.map((ligne) =>
      this.ligneFactureRepository.create({
        ...ligne,
        id: undefined,
        facture: { id: saved.id },
      }),
    );

    await this.ligneFactureRepository.save(lignes);
    return this.findOne(saved.id);
  }

  // Enregistrer un paiement
  async enregistrerPaiement(
    id: string,
    dto: EnregistrerPaiementDto,
    user: User,
  ): Promise<Facture> {
    const facture = await this.findOne(id);

    if (facture.statut === StatutFacture.PAYEE) {
      throw new BadRequestException('Cette facture est déjà payée');
    }

    if (facture.statut === StatutFacture.ANNULEE) {
      throw new BadRequestException('Cette facture est annulée');
    }

    if (dto.montant > Number(facture.montant_restant)) {
      throw new BadRequestException(
        `Le montant dépasse le restant dû : ${facture.montant_restant}`,
      );
    }

    // Enregistrer le paiement
    const paiement = this.paiementRepository.create({
      facture: { id },
      date_paiement: new Date(dto.date_paiement),
      montant: dto.montant,
      mode_paiement: dto.mode_paiement,
      reference_transaction: dto.reference_transaction,
      notes: dto.notes,
      created_by: user,
    });

    await this.paiementRepository.save(paiement);

    // Mettre à jour les montants
    const nouveauMontantPaye = Number(facture.montant_paye) + dto.montant;
    const nouveauMontantRestant = Number(facture.montant_ttc) - nouveauMontantPaye;

    // Déterminer le nouveau statut
    let nouveauStatut = StatutFacture.PARTIELLEMENT_PAYEE;
    if (nouveauMontantRestant <= 0) {
      nouveauStatut = StatutFacture.PAYEE;
    }

    await this.factureRepository.update(id, {
      montant_paye: nouveauMontantPaye,
      montant_restant: nouveauMontantRestant,
      statut: nouveauStatut,
    });

    return this.findOne(id);
  }

  // Annuler une facture
  async annuler(id: string): Promise<Facture> {
    const facture = await this.findOne(id);
    if (facture.statut === StatutFacture.PAYEE) {
      throw new BadRequestException('Une facture payée ne peut pas être annulée');
    }
    facture.statut = StatutFacture.ANNULEE;
    return this.factureRepository.save(facture);
  }
}