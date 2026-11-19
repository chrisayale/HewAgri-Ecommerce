import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable, { CellInput } from "jspdf-autotable";

export async function generateCreditsPdf(
    title: string,
    sale: any,
) {
    const doc = new jsPDF({ orientation : "landscape"});
    const pageNumber = doc.getNumberOfPages();

    const columns = [
        {header: "N°", dataKey: "nume"},
        {header: "Membres", dataKey: "membre"},
       
        {header: "Tel", dataKey: "tel"},
        {header: "Credits", dataKey: "crd"},
        {header: "Motifs", dataKey: "motif"},
        {header: "Délais", dataKey: "delais"},
        {header: "Coopérative", dataKey: 'coop'},
        {header: "Tel Coop.", dataKey: 'telcoop'}
        
    ]

    const sales = sale?.map((credits: any,index:any) => ({
        nume: index + 1,
        membre: `${credits?.__tbl_ecom_user?.nom ?? ""} ${credits?.__tbl_ecom_user?.postnom ?? ""} ${credits?.__tbl_ecom_user?.prenom ?? ""}`,
        tel: credits?.__tbl_ecom_user?.phone,
        crd: `${credits?.montant} ${credits?.currency}`,
        motif: credits?.motif,
        delais: `${credits?.periode_remboursement + 'Mois'}`,
        coop: credits?.__tbl_ecom_cooperative?.cooperative,
        telcoop: credits?.__tbl_ecom_cooperative?.phone,
    }));
    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`LISTE DES CREDITS`, 150, 17, {
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