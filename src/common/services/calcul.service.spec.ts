import { Test, TestingModule } from '@nestjs/testing';
import { CalculService } from './calcul.service';

describe('CalculService', () => {
  let service: CalculService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculService],
    }).compile();

    service = module.get<CalculService>(CalculService);
  });

  describe('calculerLigne', () => {
    it('calcule correctement une ligne sans remise sans TVA', () => {
      const result = service.calculerLigne({
        quantite: 2,
        prix_unitaire_ht: 1000,
        taux_remise: 0,
        taux_tva: 0,
      });
      expect(result.montant_ht_ligne).toBe(2000);
      expect(result.montant_remise).toBe(0);
      expect(result.montant_tva_ligne).toBe(0);
      expect(result.montant_ttc_ligne).toBe(2000);
    });

    it('calcule correctement une ligne avec remise et TVA', () => {
      const result = service.calculerLigne({
        quantite: 2,
        prix_unitaire_ht: 1000,
        taux_remise: 10,  // 10% de remise
        taux_tva: 19.25,  // TVA Cameroun
      });
      expect(result.montant_remise).toBe(200);       // 2000 × 10%
      expect(result.montant_ht_ligne).toBe(1800);    // 2000 - 200
      expect(result.montant_tva_ligne).toBe(346.5);  // 1800 × 19.25%
      expect(result.montant_ttc_ligne).toBe(2146.5); // 1800 + 346.5
    });
  });

  describe('calculerDocument', () => {
    it('calcule correctement les totaux du document', () => {
      const lignes = [
        service.calculerLigne({
          quantite: 2,
          prix_unitaire_ht: 1000,
          taux_remise: 0,
          taux_tva: 19.25,
        }),
        service.calculerLigne({
          quantite: 1,
          prix_unitaire_ht: 500,
          taux_remise: 0,
          taux_tva: 19.25,
        }),
      ];

      const result = service.calculerDocument({
        lignes,
        taux_remise_globale: 5, // 5% de remise globale
        frais_supplementaires: 100,
      });

      expect(result.montant_ht).toBe(2500);           // 2000 + 500
      expect(result.montant_remise_globale).toBe(125); // 2500 × 5%
      expect(result.montant_tva).toBe(481.25);         // (2000 + 500) × 19.25%
      expect(result.montant_ttc).toBe(2956.25);        // 2500 - 125 + 481.25 + 100
    });
  });
});