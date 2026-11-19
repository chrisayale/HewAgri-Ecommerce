import { Platform } from 'react-native';

// Imprimer un reçu thermique format ticket (80mm / 58mm) sur le Web
export const printReceiptWeb = async (receiptData) => {
  if (Platform.OS !== 'web') {
    return { success: false, error: 'Not on web platform' };
  }

  return new Promise((resolve) => {
    try {
      // Créer le HTML du reçu
      const html = generateReceiptHTML(receiptData);

      // Ouvrir une nouvelle fenêtre pour l'impression
      const printWindow = window.open('', '_blank', 'width=400,height=600');

      if (!printWindow) {
        resolve({ success: false, error: 'Popup blocked' });
        return;
      }

      printWindow.document.write(html);
      printWindow.document.close();

      // Attendre que le contenu soit chargé puis imprimer
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();

          // Fermer la fenêtre après impression (avec délai pour laisser le temps à l'utilisateur)
          setTimeout(() => {
            printWindow.close();
            resolve({ success: true });
          }, 1000);
        }, 500);
      };
    } catch (error) {
      console.error('Print error:', error);
      resolve({ success: false, error: error.message });
    }
  });
};

// Générer le HTML du reçu avec styles d'impression thermiques
const generateReceiptHTML = (data) => {
  const {
    type, // 'delivery', 'sale', 'command'
    transaction,
    cooperative,
    num_enregistrement,
    client,
    products,
    total,
    date = new Date().toLocaleDateString('fr-FR')
  } = data;

  const isDelivery = type === 'delivery';
  const title = isDelivery ? 'Confirmation de livraison' : 'Reçu de vente';

  let productsHTML = '';
  if (products && products.length > 0) {
    products.forEach(prod => {
      const name = prod.produit || prod.__tbl_ecom_produit?.produit || 'Produit';
      const qte = prod.qte || prod.__tbl_ecom_hasproducts?.qte || 0;
      const unity = prod.unity || prod.__tbl_ecom_unitesmesure?.unity || prod.__tbl_ecom_unitesmesures?.unity || '';
      const prix = prod.prix_total || (prod.prix_unit * qte) || 0;

      productsHTML += `
        <div class="product-line">
          <span class="product-name">${name}</span>
          <span class="product-qty">${qte} ${unity}</span>
        </div>
        <div class="product-price">${prix.toLocaleString()} CDF</div>
        <hr class="separator-thin">
      `;
    });
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title} - ${transaction}</title>
      <style>
        @page {
          size: 80mm auto;
          margin: 0;
        }

        @media print {
          body {
            margin: 0;
            padding: 0;
            width: 80mm;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            line-height: 1.3;
          }
          .no-print { display: none !important; }
          .receipt { width: 76mm; padding: 2mm; }
        }

        @media screen {
          body {
            margin: 20px;
            padding: 0;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.4;
            background: #f5f5f5;
          }
          .receipt {
            width: 320px;
            max-width: 100%;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            padding: 20px;
            border-radius: 4px;
          }
          .print-btn {
            display: block;
            width: 100%;
            padding: 12px;
            margin: 20px 0;
            background: #2E7D32;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
          }
          .print-btn:hover { background: #1B5E20; }
        }

        .receipt {
          font-family: 'Courier New', monospace;
        }

        .header {
          text-align: center;
          border-bottom: 1px dashed #000;
          padding-bottom: 8px;
          margin-bottom: 8px;
        }

        .shop-name {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 2px;
        }

        .shop-tagline {
          font-size: 10px;
        }

        .separator {
          border-top: 1px dashed #000;
          margin: 8px 0;
        }

        .separator-thin {
          border-top: 1px dotted #000;
          margin: 4px 0;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          margin: 4px 0;
          font-size: 11px;
        }

        .info-label { color: #333; }
        .info-value { font-weight: bold; text-align: right; }

        .product-line {
          display: flex;
          justify-content: space-between;
          margin: 4px 0;
          font-size: 11px;
        }

        .product-name { flex: 1; }
        .product-qty { text-align: right; margin-left: 8px; }

        .product-price {
          text-align: right;
          font-weight: bold;
          font-size: 11px;
        }

        .total-section {
          border-top: 2px dashed #000;
          padding-top: 8px;
          margin-top: 8px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          font-weight: bold;
          margin: 6px 0;
        }

        .footer {
          text-align: center;
          margin-top: 12px;
          padding-top: 8px;
          border-top: 1px dashed #000;
          font-size: 10px;
          color: #666;
        }

        .qr-placeholder {
          text-align: center;
          margin: 8px 0;
          padding: 8px;
          border: 1px dashed #999;
          font-size: 10px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="text-align: center; margin-bottom: 20px;">
        <button class="print-btn" onclick="window.print()">🖨️ Imprimer / Enregistrer PDF</button>
        <p style="font-size: 12px; color: #666;">Utilisez Ctrl+P (Cmd+P sur Mac) pour imprimer ou enregistrer en PDF</p>
      </div>

      <div class="receipt">
        <div class="header">
          <div class="shop-name">HewAgri</div>
          <div class="shop-tagline">L'agriculture digitale en RDC c'est nous</div>
        </div>

        <hr class="separator">

        <div class="info-row">
          <span class="info-label">Référence:</span>
          <span class="info-value">${transaction}</span>
        </div>

        ${cooperative ? `
        <div class="info-row">
          <span class="info-label">Coopérative:</span>
          <span class="info-value">${cooperative}</span>
        </div>
        ` : ''}

        ${num_enregistrement ? `
        <div class="info-row">
          <span class="info-label">N° Enreg.:</span>
          <span class="info-value">${num_enregistrement}</span>
        </div>
        ` : ''}

        ${client ? `
        <div class="info-row">
          <span class="info-label">Client:</span>
          <span class="info-value">${client.nom || ''} ${client.postnom || ''}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Contact:</span>
          <span class="info-value">${client.phone || ''}</span>
        </div>
        ` : ''}

        <div class="info-row">
          <span class="info-label">Date:</span>
          <span class="info-value">${date}</span>
        </div>

        <hr class="separator">

        <div class="product-header" style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; margin-bottom: 4px;">
          <span>Produit</span>
          <span style="text-align: right;">Qté</span>
        </div>
        <hr class="separator-thin">

        ${productsHTML}

        <div class="total-section">
          <div class="total-row">
            <span>TOTAL</span>
            <span>${total?.toLocaleString() || '0'} CDF</span>
          </div>
        </div>

        <hr class="separator">

        <div class="footer">
          ${isDelivery ? `
            <p>Confirmation de livraison pour ${client?.nom || ''} ${client?.postnom || ''}</p>
            <p>en date du ${date}</p>
          ` : `
            <p>Reçu de vente - ${title}</p>
            <p>Merci pour votre confiance !</p>
          `}
          <p style="margin-top: 8px;">--- fin ---</p>
        </div>

        <div class="qr-placeholder">
          [ QR Code: ${transaction} ]
        </div>
      </div>

      <script>
        // Auto-print si paramètre présent
        if (window.location.search.includes('autoPrint=true')) {
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          };
        }
      </script>
    </body>
    </html>
  `;
};

// Interface unifiée pour l'impression (Web + Native)
export const printReceipt = async (data) => {
  if (Platform.OS === 'web') {
    return printReceiptWeb(data);
  }

  // Native: utiliser le module natif existant
  try {
    const printer = require('../printer').default;
    return printer.connectAndPrintReceipt(data);
  } catch (error) {
    console.error('Native print error:', error);
    return { success: false, error: error.message };
  }
};

// Fonction helper pour formater les données de reçu depuis l'app
export const formatReceiptData = (item) => {
  if (!item) return null;

  // Format de livraison (out-delivery)
  if (item['out-delivery']) {
    const { coopec, group, item: asitem, transaction } = item['out-delivery'];
    return {
      type: 'delivery',
      transaction,
      cooperative: coopec?.cooperative,
      num_enregistrement: coopec?.num_enregistrement,
      client: asitem,
      products: Array.from(group || []),
      total: Array.from(group || []).reduce((sum, p) => sum + (p.prix_total || 0), 0)
    };
  }

  // Format vente (out)
  if (item.out) {
    const { coopec, group, item: asitem, transaction } = item.out;
    return {
      type: 'sale',
      transaction,
      cooperative: coopec?.cooperative,
      num_enregistrement: coopec?.num_enregistrement,
      client: asitem,
      products: Array.from(group || []),
      total: Array.from(group || []).reduce((sum, p) => sum + (p.prix_total || 0), 0)
    };
  }

  // Format commande standard
  if (item.__tbl_ecom_produits) {
    return {
      type: 'command',
      transaction: item.transaction,
      cooperative: item.__tbl_ecom_cooperative?.cooperative,
      num_enregistrement: item.__tbl_ecom_cooperative?.num_enregistrement,
      client: null,
      products: Array.from(item.__tbl_ecom_produits || []),
      total: Array.from(item.__tbl_ecom_produits || []).reduce((sum, p) => {
        const hasProducts = p.__tbl_ecom_hasproducts;
        return sum + (hasProducts?.prix_unitaire * hasProducts?.qte || 0);
      }, 0)
    };
  }

  return null;
};

export default {
  printReceipt,
  printReceiptWeb,
  formatReceiptData
};