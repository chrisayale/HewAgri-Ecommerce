import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable, { CellInput } from "jspdf-autotable";

export async function generateCooperativePdf(
    title: string,
    sale: any,
) {
    const doc = new jsPDF({ orientation : "landscape"});
    const pageNumber = doc.getNumberOfPages();

    const columns = [
        {header: "N°", dataKey: "nume"},
        {header: "Coopérative", dataKey: "nom"},
        {header: "Tel", dataKey: "phone"},
        {header: "Email", dataKey: "email"},
        {header: "Description", dataKey: 'description'},
        {header: "Formalisation", dataKey: "formel"}
        
    ]

    const sales = sale?.map((cooperative: any, index: any) => ({
        nume: index + 1,
        nom: `${cooperative?.cooperative ?? ""} ${cooperative?.sigle ?? ""}`,
        phone: cooperative?.phone,
        email: cooperative?.email,
        description: cooperative?.description,
        formel: cooperative?.isformel == 1 ? "Formel" : "Non Formel",
       
    }));
    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`LISTE DES COOPERATIVES`, 150, 17, {
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