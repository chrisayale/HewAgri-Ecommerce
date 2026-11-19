import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable, { CellInput } from "jspdf-autotable";

export async function generateBanquePdf(
    title: string,
    sale: any,
) {
    const doc = new jsPDF({ orientation : "landscape"});
    const pageNumber = doc.getNumberOfPages();

    const columns = [
        {header: "N°", dataKey: "nume"},
        {header: "Banque", dataKey: "banque"},
       
        {header: "Tel", dataKey: "tel"},
        {header: "Email", dataKey: "email"},
        {header: "Responsable", dataKey: "respo"},
        {header: "Tel Respo.", dataKey: "telrespo"},
        {header: "Email Respo.", dataKey: 'coop'},
        {header: "Date de création", dataKey: "date"},
        
    ]

    const sales = sale?.map((banque: any,index:any) => ({
        nume: index + 1,
        membre: `${banque?.bank ?? ""} `,
        tel: banque?.phone,
        email: banque?.email,
        respo: `${banque?.__tbl_ecom_user.nom ?? ""} ${banque?.__tbl_ecom_user.postnom ?? ""} ${banque?.__tbl_ecom_user.prenom ?? ""}`,
        telrespo: `${banque?.__tbl_ecom_user.phone?? ""}`,
        elrespo: `${banque?.__tbl_ecom_user.email?? ""}`,
        date: dayjs(banque?.createdAt).format("DD/MM/YYYY à HH : MM"),
    }));
    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`LISTE DES BANQUES`, 150, 17, {
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