import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable, { CellInput } from "jspdf-autotable";

export async function generateTypeLivraisonPdf(
    title: string,
    sale: any,
) {
    const doc = new jsPDF({ orientation : "landscape"});
    const pageNumber = doc.getNumberOfPages();

    const columns = [
        {header: "N°", dataKey: "nume"},
        {header: "Type de Livraison", dataKey: "type"},   
        {header: "Déscription", dataKey: "description"},
        {header: "Qte", dataKey: "qte"},
        {header: "Frais Livraison", dataKey: "frais"},
    ]

    const sales = sale?.map((livraison: any,index:any) => ({
        nume: index + 1,
        type: `${livraison?.type ?? ""} `,
        description: livraison?.description,
        qte: livraison?.quantite,
        frais: livraison?.frais_livraison
    }));
    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`LISTES DES TYPES DE LIVRAISON`, 150, 17, {
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