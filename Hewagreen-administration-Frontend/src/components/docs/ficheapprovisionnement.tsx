import { UIApprovisionnement } from "@/types";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable, { CellInput } from "jspdf-autotable";

export async function generateFicheHistoriqueApproPdf(
    title: string,
    subtitle: string,
    approvisionnement: UIApprovisionnement // Acceptation de l'interface UIApprovisionnement
) {
    const doc = new jsPDF({ orientation: "landscape" });

    const columns = [
        { header: "N°", dataKey: "nume" },
        { header: "Produit", dataKey: "produit" },
        { header: "Catégorie", dataKey: "categorie" },
        { header: "Date de Production", dataKey: "date" },
        { header: "Date d'Approvisionnement", dataKey: "date" },
        { header: "Quantité Approv.", dataKey: "qte" },
        { header: "Cooperative", dataKey: "coop" },
    ];

    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`FICHES D'APPROVISIONNEMENT ${subtitle}`, 150, 17, {
        align: "center",
    });

    const bodyData = approvisionnement.data.rows.map((row: any, index: number) => [
        index + 1,
        row.__tbl_ecom_produit.produit,
        row.__tbl_ecom_category.category,
        row.date_production,
        dayjs(row.createdAt).format("DD/MM/YYYY à HH:mm"),
         
        `${row.qte}  ${row.__tbl_ecom_unitesmesure.unity}`, // Ajustez si nécessaire
        `${row?.__tbl_ecom_cooperative?.cooperative ?? ""}`,
        "N/A" // Ajustez si nécessaire
    ]);

    autoTable(doc, {
        head: [columns.map((col) => col.header)],
        body: bodyData as CellInput[][],
        startY: 30,
        margin: { left: 10 },
        theme: "grid",
        willDrawPage: (data) => {
            if (data.pageNumber === 1) {
                doc.setFontSize(10);
                doc.text(``, 215, 27, { align: "center" });
            }
        },
    });

    doc.save(`${title}.pdf`);
}