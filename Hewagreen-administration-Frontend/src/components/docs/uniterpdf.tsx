import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable, { CellInput } from "jspdf-autotable";

export async function generateUniterPdf(
    title: string,
    sale: any,
) {
    const doc = new jsPDF({ orientation : "landscape"});
    const pageNumber = doc.getNumberOfPages();

    const columns = [
        {header: "N°", dataKey: "nume"},
        {header: "Unite de mesure", dataKey: "unite"},   
        {header: "Déscription", dataKey: "description"},
        {header: "Equival kgs", dataKey: "equival"}
        
    ]

    const sales = sale?.map((unite: any,index:any) => ({
        nume: index + 1,
        unite: `${unite?.unity ?? ""} `,
        description: unite?.description,
        equival: unite?.equival_kgs,
    }));
    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`UNITE DE MESURE`, 150, 17, {
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