import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable, { CellInput } from "jspdf-autotable";

export async function generateFichePaimentPdf(
    title: string,
    sale: any,
) {
    const doc = new jsPDF({ orientation : "landscape"});
    const pageNumber = doc.getNumberOfPages();

    const columns = [
        { header: "N°", dataKey: "nume" },
        { header: "Id.Référence", dataKey: "idref" },
        { header: "Montant", dataKey: "montant" },
        { header: "Num.Transaction", dataKey: "numtras" },
        { header: "Membre", dataKey: "mebre" },
    ];

    const sales = sale?.map((row: any,index:any) => ({
        nume: index + 1,
        idref: row?.realref,
        montant: `${row?.amount} ${row?.currency}`,
        numtras : `${row?.customer_phone}`,
        mebre: `${row?.__tbl_ecom_user?.nom} ${row?.__tbl_ecom_user?.postnom} ${row?.__tbl_ecom_user?.prenom}`
    }));
    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`FICHE DES PAIEMENTS`, 150, 17, {
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