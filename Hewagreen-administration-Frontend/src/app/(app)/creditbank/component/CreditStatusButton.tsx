import { Button } from 'antd';
import React from 'react';

const CreditStatusButtons = ({ item, dataCreditsLoad, handleUpdateStatus }:any) => {
    // Les différents statuts des crédits avec les libellés et couleurs
    const statusOptions = [
        { status: 0, label: "En attente", color: "blue" },
        { status: 1, label: "Validé", color: "green" },
        { status: 2, label: "Rejeté", color: "red" },
        { status: 3, label: "En cours", color: "orange" },
    ];

    return (
        <div style={{ display: 'flex', gap: '10px' }}>
            {statusOptions.map((option) => (
                <Button 
                    key={option.status}
                    style={{ backgroundColor: option.color, color: '#fff' }}
                    onClick={() => handleUpdateStatus(item?.id, option.status)}  // Appel de la fonction pour mettre à jour l'état
                    disabled={dataCreditsLoad}  // Désactiver pendant le chargement
                >
                    {option.label}
                </Button>
            ))}
        </div>
    );
};

export default CreditStatusButtons;
