/**
 * Mock web pour react-native-snackbar
 * Remplace le module natif qui n'existe pas sur navigateur
 */

// Constantes attendues par l'API native
export const LENGTH_SHORT = 2000;
export const LENGTH_LONG = 3500;
export const LENGTH_INDEFINITE = 0;

// Implémentation web légère avec toast visuel
const Snackbar = {
  LENGTH_SHORT,
  LENGTH_LONG,
  LENGTH_INDEFINITE,

  show: (options) => {
    const message = typeof options === 'string'
      ? options
      : (options?.text || options?.message || 'Notification');
    const duration = options?.duration || LENGTH_SHORT;
    const backgroundColor = options?.backgroundColor || '#333';
    const textColor = options?.textColor || '#fff';

    // Console log non bloquant
    console.info(`[Snackbar] ${message}`, { duration, backgroundColor });

    // Toast visuel sur navigateur
    if (typeof window !== 'undefined') {
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
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        `;

        // Ajouter les styles d'animation une seule fois
        if (!document.getElementById('snackbar-styles')) {
          const style = document.createElement('style');
          style.id = 'snackbar-styles';
          style.textContent = `
            @keyframes snackbar-slide-up {
              from { opacity: 0; transform: translateX(-50%) translateY(20px); }
              to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            @keyframes snackbar-slide-down {
              from { opacity: 1; transform: translateX(-50%) translateY(0); }
              to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
          `;
          document.head.appendChild(style);
        }

        document.body.appendChild(toastContainer);
      }

      const toast = document.createElement('div');
      toast.style.cssText = `
        background: ${backgroundColor};
        color: ${textColor};
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: snackbar-slide-up 0.3s ease-out;
        pointer-events: auto;
        max-width: 90vw;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.4;
      `;
      toast.textContent = message;
      toastContainer.appendChild(toast);

      // Auto-suppression
      setTimeout(() => {
        toast.style.animation = 'snackbar-slide-down 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    return Promise.resolve();
  },

  dismiss: () => Promise.resolve(),
};

export default Snackbar;