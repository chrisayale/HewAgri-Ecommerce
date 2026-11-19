import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable, { CellInput } from "jspdf-autotable";

export async function generateHistoriqueCommandePdf(
    title: string,
    subtitle: string,
    sale: any,
) {
    const doc = new jsPDF({ orientation : "landscape"});
    const pageNumber = doc.getNumberOfPages();

    const columns = [
        {header: "N°", dataKey: "nume"},
        {header: "Produit Commander", dataKey: "prod"},
       
        {header: "Qte", dataKey: "qte"},
        // {header: "P.U", dataKey: "pu"},
        {header: "P.T", dataKey: "pt"},
        {header: "Type Livraison", dataKey: "type"},
        {header: "Mode Payement", dataKey: 'mode'},
        {header: "Id Commande", dataKey: 'id'},
        {header: "Date de création", dataKey: "date"},
        
    ]

    const sales = sale?.map((commande: any,index:any) => ({
        nume: index + 1,
        prod: `${commande?.__tbl_ecom_produit?.produit ?? ""}`,
        qte: commande?.qte,
        // pu: `${commande?.prix_unit || ""} ${commande?.prix_unit ? commande?.currency : "0"}`,
        pt: `${commande?.prix_total} ${commande?.currency}`,
        type: commande?.__tbl_ecom_typelivraison?.type,
        mode: commande?.payament_phone,
        id: commande?.transaction,
        date: commande?.createdAt,
    }));
    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`LISTE HISTORIQUE DES VENTES POUR ${subtitle}`, 150, 17, {
        align: "center",
    })

    

    doc.setPage(pageNumber)

    autoTable(doc, {
        head: [columns.map((col) => col.header)],
        body: sales.map(
            (row: any) =>
                columns.map(
                    (col) => row[col.dataKey as keyof typeof row]
                ) as CellInput[]
        ),
        startY: 30,
        margin: {left : 10},
        theme: "grid",
        willDrawPage: (data) => {
            if (data.pageNumber === 1) {
                doc.setFontSize(10);
                doc.text(``, 215, 27, {align: "center"})
            }
        },
    });
    doc.save(`${title}.pdf`);
}