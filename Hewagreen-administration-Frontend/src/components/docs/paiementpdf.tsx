import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable, { CellInput } from "jspdf-autotable";

export async function generatePaiementPdf(
    title: string,
    sales: any[]
) {
    const doc = new jsPDF({ orientation: "landscape" });

    const columns = [
        { header: "N°", dataKey: "nume" },
        { header: "Id.Référence", dataKey: "idref" },
        { header: "Montant", dataKey: "montant" },
        { header: "Num.Transaction", dataKey: "numtras" },
        { header: "Membre", dataKey: "mebre" },
    ];

    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`FICHE DES PAIEMENTS`, 150, 17, {
        align: "center",
    });

    const bodyData = sales.map((row, index) => [
        index + 1,
        // dayjs(row?.__tbl_ecom_hasproducts?.createdAt).format(
        //     "DD/MM/YYYY à HH : MM"
        // ),
        `${row?.realref ?? ""}`,
        `${row?.amount} ${row?.currency}`,
        `${row?.customer_phone}`,
        `${row?.__tbl_ecom_user?.nom} ${row?.__tbl_ecom_user?.postnom} ${row?.__tbl_ecom_user?.prenom}`
       
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