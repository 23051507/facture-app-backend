import { Injectable } from '@nestjs/common';

export interface LigneCalculInput {
  quantite: number;
  prix_unitaire_ht: number;
  taux_remise: number;  // en %
  taux_tva: number;     // en %
}

export interface LigneCalculResult {
  montant_remise: number;
  montant_ht_ligne: number;
  montant_tva_ligne: number;
  montant_ttc_ligne: number;
}

export interface DocumentCalculInput {
  lignes: LigneCalculResult[];
  taux_remise_globale: number;  // en %
  frais_supplementaires: number;
}

export interface DocumentCalculResult {
  montant_ht: number;
  montant_remise_globale: number;
  montant_tva: number;
  montant_ttc: number;
}

@Injectable()
export class CalculService {

  // Calcule les montants d'une ligne
  calculerLigne(input: LigneCalculInput): LigneCalculResult {
    const brut = this.arrondir(input.quantite * input.prix_unitaire_ht);
    const montant_remise = this.arrondir(brut * (input.taux_remise / 100));
    const montant_ht_ligne = this.arrondir(brut - montant_remise);
    const montant_tva_ligne = this.arrondir(montant_ht_ligne * (input.taux_tva / 100));
    const montant_ttc_ligne = this.arrondir(montant_ht_ligne + montant_tva_ligne);

    return {
      montant_remise,
      montant_ht_ligne,
      montant_tva_ligne,
      montant_ttc_ligne,
    };
  }

  // Calcule les montants totaux du document
  calculerDocument(input: DocumentCalculInput): DocumentCalculResult {
    const montant_ht = this.arrondir(
      input.lignes.reduce((sum, l) => sum + l.montant_ht_ligne, 0),
    );

    const montant_remise_globale = this.arrondir(
      montant_ht * (input.taux_remise_globale / 100),
    );

    const montant_tva = this.arrondir(
      input.lignes.reduce((sum, l) => sum + l.montant_tva_ligne, 0),
    );

    const montant_ttc = this.arrondir(
      montant_ht - montant_remise_globale + montant_tva + input.frais_supplementaires,
    );

    return {
      montant_ht,
      montant_remise_globale,
      montant_tva,
      montant_ttc,
    };
  }

  // Arrondir à 2 décimales — évite les erreurs de virgule flottante
  private arrondir(valeur: number): number {
    return Math.round(valeur * 100) / 100;
  }
}