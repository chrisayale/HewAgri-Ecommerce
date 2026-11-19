import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable, { CellInput } from "jspdf-autotable";

export async function generateProduitPdf(
    title: string,
    sale: any,
) {
    const doc = new jsPDF({ orientation : "landscape"});
    const pageNumber = doc.getNumberOfPages();

    const columns = [
        {header: "N°", dataKey: "nume"},
        {header: "Designation", dataKey: "design"},
        {header: "Catégorie", dataKey: "categorie"},
        {header: "Sous Catégorie", dataKey: "souscat"},
        {header: "Unité", dataKey: "unite"},
        {header: "Tva", dataKey: "tva"},
        
    ]

    const sales = sale?.map((produit: any, index: any) => ({
        nume: index + 1,
        design: `${produit?.produit ?? ""}`,
        categorie: produit?.__tbl_ecom_category?.category,
        souscat: produit?.__tbl_ecom_souscategory?.souscategory,
        unite: produit?.__tbl_ecom_unitesmesure?.unity,
        tva: produit?.tva
    }));
    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`LISTE DES PRODUITS`, 150, 17, {
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