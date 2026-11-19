import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable, { CellInput } from "jspdf-autotable";

export async function generateIdentificationPdf(
    title: string,
    sale: any,
) {
    const doc = new jsPDF({ orientation : "landscape"});
    const pageNumber = doc.getNumberOfPages();

    const columns = [
        {header: "N°", dataKey: "nume"},
        {header: "Nom Complet", dataKey: "nom"},
        {header: "Tel", dataKey: "phone"},
        {header: "Email", dataKey: "email"},
        {header: "Genre", dataKey: "sexe"},
        {header: "Roles", dataKey: "role"},
        {header: "Adresse", dataKey: "adresse"},
        {header: "Date de création", dataKey: "date"},
        
    ]

    const sales = sale?.map((operation: any, index: any) => ({
        nume: index + 1,
        nom: `${operation?.nom ?? ""} ${operation?.postnom ?? ""} ${operation?.prenom ?? ""}`,
        phone: operation?.phone,
        email: operation?.email,
        sexe: operation?.sexe,
        role: operation?.__tbl_ecom_roles?.map((i: any) => i.role),
        adresse: `${operation?.__tbl_ecom_province?.province ?? ""} ${operation?.__tbl_ecom_territoire?.territoire ?? ""} ${operation?.__tbl_ecom_village?.village ?? ""}
        `,
        date: dayjs(operation?.createdAt).format("DD/MM/YYYY à HH : MM"),
    }));
    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`LISTE DES UTILISATEURS`, 150, 17, {
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