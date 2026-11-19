import { Platform } from 'react-native';

// Mock pour react-native-html-to-pdf sur Web
if (Platform.OS === 'web') {
  console.warn('[HTMLToPDF] HTML to PDF non disponible sur le Web - utilisation de window.print()');
}

const HTMLToPDFMock = {
  convert: (options) => {
    if (Platform.OS === 'web') {
      // Créer une fenêtre d'impression avec le HTML
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(options.html);
        printWindow.document.close();
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
      }
      return Promise.resolve({ filePath: 'printed' });
    }
    return Promise.reject(new Error('Non supporté sur cette plateforme'));
  },
};

export default HTMLToPDFMock;
export const HTMLToPDF = HTMLToPDFMock;