import { Platform } from 'react-native';

// Mock pour react-native-snackbar sur Web
if (Platform.OS === 'web') {
  console.warn('[Snackbar] react-native-snackbar non disponible sur le Web - utilisation du fallback');
}

const SnackbarMock = {
  // Constantes attendues par le module natif
  LENGTH_SHORT: 2000,
  LENGTH_LONG: 3500,
  LENGTH_INDEFINITE: 0,

  // Méthode show principale
  show: (options) => {
    if (Platform.OS === 'web') {
      const message = typeof options === 'string' ? options : (options?.text || options?.message || 'Notification');
      const duration = options?.duration || SnackbarMock.LENGTH_SHORT;

      // Affichage via console (non bloquant)
      console.info(`[Snackbar] ${message}`, { duration });

      // Optionnel: afficher un toast visuel simple
      if (typeof window !== 'undefined') {
        // Créer ou réutiliser un conteneur de toast
        let toastContainer = document.getElementById('snackbar-toast-container');
        if (!toastContainer) {
          toastContainer = document.createElement('div');
          toastContainer.id = 'snackbar-toast-container';
          toastContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            pointer-events: none;
          `;
          document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.style.cssText = `
          background: #333;
          color: white;
          padding: 12px 24px;
          border-radius: 4px;
          margin-top: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          animation: slideUp 0.3s ease-out;
          pointer-events: auto;
          max-width: 90vw;
          text-align: center;
        `;
        toast.textContent = message;
        toastContainer.appendChild(toast);

        // Supprimer après la durée
        setTimeout(() => {
          toast.style.animation = 'slideDown 0.3s ease-in';
          setTimeout(() => toast.remove(), 300);
        }, duration);
      }
    }
    return Promise.resolve();
  },

  // Méthodes alternatives parfois utilisées
  dismiss: () => Promise.resolve(),
};

export default SnackbarMock;
export const Snackbar = SnackbarMock;
export const LENGTH_SHORT = SnackbarMock.LENGTH_SHORT;
export const LENGTH_LONG = SnackbarMock.LENGTH_LONG;
export const LENGTH_INDEFINITE = SnackbarMock.LENGTH_INDEFINITE;