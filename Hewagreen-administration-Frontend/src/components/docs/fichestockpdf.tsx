import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable, { CellInput } from "jspdf-autotable";

export async function generateFicheStockPdf(
    title: string,
    subtitle: string,
    sales: any[],
) {
    const doc = new jsPDF({ orientation: "landscape" });

    const columns = [
        { header: "N°", dataKey: "nume" },
        { header: "Date Approvisionnement", dataKey: "date" },
        { header: "Produit", dataKey: "design" },
        { header: "Catégorie", dataKey: "categorie" },
        { header: "Q.E", dataKey: "qte" },
        { header: "P.U", dataKey: "pu" },
        { header: "P.COMM", dataKey: "pc" },
        { header: "Q.CRITi.", dataKey: "etcr" },
        { header: "Unité", dataKey: "unite" },
        { header: "Tva", dataKey: "tva" },
    ];

    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`FICHES DES STOCKS ${subtitle}`, 150, 17, {
        align: "center",
    });

    const bodyData = sales.map((row, index) => [
        index + 1,
        dayjs(row?.__tbl_ecom_hasproducts?.createdAt).format(
            "DD/MM/YYYY à HH : MM"
        ),
        `${row?.produit ?? ""}`,
        row?.__tbl_ecom_categories?.category,
        row?.__tbl_ecom_hasproducts?.qte,
        `${row?.__tbl_ecom_hasproducts?.prix_unitaire} ${row?.__tbl_ecom_hasproducts?.currency}`,
        `${row?.__tbl_ecom_hasproducts?.prix_plus_commission} ${row?.__tbl_ecom_hasproducts?.currency}`,
        row?.__tbl_ecom_hasproducts?.qte_critique,
        row?.__tbl_ecom_unitesmesures?.unity,
        row?.__tbl_ecom_hasproducts?.tva,
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