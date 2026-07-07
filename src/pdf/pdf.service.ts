import { Injectable } from '@nestjs/common';
const PDFDocument = require('pdfkit');

export interface LigneFacturePdf {
  designation: string;
  quantite: number;
  prix_unitaire_ht: number;
  taux_tva: number;
  montant_ttc_ligne: number;
}

export interface FacturePdfData {
  numero_facture: string;
  date_emission: Date;
  date_echeance: Date;
  objet: string;
  client: {
    raison_sociale: string;
    email?: string;
    telephone?: string;
    adresse_ville?: string;
  };
  lignes: LigneFacturePdf[];
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
  devise: string;
}

@Injectable()
export class PdfService {
  async genererFacturePdf(facture: FacturePdfData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ── EN-TÊTE ──
      doc.fontSize(22).fillColor('#2563EB').text('TEMI SERVICES', 50, 50);
      doc.fontSize(18).fillColor('#000000').text('FACTURE', 400, 50, { align: 'right' });
      doc.fontSize(12).fillColor('#6B7280').text(`N° ${facture.numero_facture}`, 400, 75, { align: 'right' });
      doc.fontSize(10).fillColor('#000000')
        .text(`Date: ${new Date(facture.date_emission).toLocaleDateString('fr-FR')}`, 400, 95, { align: 'right' })
        .text(`Échéance: ${new Date(facture.date_echeance).toLocaleDateString('fr-FR')}`, 400, 110, { align: 'right' });

      // ── SÉPARATEUR ──
      doc.moveTo(50, 130).lineTo(550, 130).strokeColor('#2563EB').lineWidth(2).stroke();

      // ── CLIENT ──
      doc.fontSize(10).fillColor('#6B7280').text('FACTURÉ À', 50, 150);
      doc.fontSize(12).fillColor('#000000').text(facture.client.raison_sociale, 50, 165);
      let clientY = 180;
      if (facture.client.email) {
        doc.fontSize(10).text(facture.client.email, 50, clientY);
        clientY += 15;
      }
      if (facture.client.telephone) {
        doc.fontSize(10).text(facture.client.telephone, 50, clientY);
        clientY += 15;
      }
      if (facture.client.adresse_ville) {
        doc.fontSize(10).text(facture.client.adresse_ville, 50, clientY);
      }

      // ── OBJET ──
      doc.fontSize(10).fillColor('#6B7280').text('OBJET', 350, 150);
      doc.fontSize(10).fillColor('#000000').text(facture.objet, 350, 165, { width: 200 });

      // ── TABLEAU EN-TÊTE ──
      const tableTop = 270;
      doc.rect(50, tableTop, 500, 20).fill('#2563EB');
      doc.fillColor('#FFFFFF').fontSize(10)
        .text('Désignation', 55, tableTop + 5, { width: 200 })
        .text('Qté', 255, tableTop + 5, { width: 50, align: 'center' })
        .text('Prix HT', 305, tableTop + 5, { width: 80, align: 'right' })
        .text('TVA', 385, tableTop + 5, { width: 50, align: 'center' })
        .text('Total TTC', 435, tableTop + 5, { width: 110, align: 'right' });

      // ── LIGNES ──
      let y = tableTop + 25;
      facture.lignes.forEach((ligne, index) => {
        if (index % 2 === 0) {
          doc.rect(50, y - 3, 500, 20).fill('#F3F4F6');
        }
        doc.fillColor('#000000').fontSize(10)
          .text(ligne.designation, 55, y, { width: 200 })
          .text(String(ligne.quantite), 255, y, { width: 50, align: 'center' })
          .text(`${Number(ligne.prix_unitaire_ht).toFixed(2)} ${facture.devise}`, 305, y, { width: 80, align: 'right' })
          .text(`${ligne.taux_tva}%`, 385, y, { width: 50, align: 'center' })
          .text(`${Number(ligne.montant_ttc_ligne).toFixed(2)} ${facture.devise}`, 435, y, { width: 110, align: 'right' });
        y += 22;
      });

      // ── TOTAUX ──
      y += 20;
      doc.fontSize(10)
        .text('Total HT :', 350, y)
        .text(`${Number(facture.montant_ht).toFixed(2)} ${facture.devise}`, 435, y, { width: 110, align: 'right' });
      y += 18;
      doc.text('TVA :', 350, y)
        .text(`${Number(facture.montant_tva).toFixed(2)} ${facture.devise}`, 435, y, { width: 110, align: 'right' });
      y += 18;
      doc.moveTo(350, y).lineTo(550, y).strokeColor('#000000').lineWidth(1).stroke();
      y += 5;
      doc.fontSize(12).font('Helvetica-Bold')
        .text('TOTAL TTC :', 350, y)
        .text(`${Number(facture.montant_ttc).toFixed(2)} ${facture.devise}`, 435, y, { width: 110, align: 'right' });

      doc.end();
    });
  }
}