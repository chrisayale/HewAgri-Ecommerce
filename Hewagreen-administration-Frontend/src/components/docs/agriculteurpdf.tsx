import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable, { CellInput } from "jspdf-autotable";

export async function generateAgriculteurPdf(
    title: string,
    sale: any,
) {
    const doc = new jsPDF({ orientation : "landscape"});
    const pageNumber = doc.getNumberOfPages();

    const columns = [
        {header: "N°", dataKey: "nume"},
        {header: "Membres", dataKey: "membre"},
        {header: "Tel", dataKey: "phone"},
        {header: "Email", dataKey: "email"},
        {header: "Coopérative", dataKey: "coop"},
        {header: "Date de création", dataKey: "date"},
        
    ]

    const sales = sale?.map((membres: any, index:any) => ({
        nume: index + 1,
        membre: `${membres?.__tbl_ecom_user?.nom ?? ""} ${membres?.__tbl_ecom_user?.postnom ?? ""} ${membres?.__tbl_ecom_user?.prenom ?? ""}`,
        phone: membres?.__tbl_ecom_user?.phone,
        email: membres?.__tbl_ecom_user?.email,
        coop: membres?.__tbl_ecom_cooperative?.cooperative,
       
        date: dayjs(membres?.createdAt).format("DD/MM/YYYY à HH : MM"),
    }));
    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`LISTE DES AGRICULTEURS`, 150, 17, {
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

export async function generateAgriculteurMemberPdf(
    title: string,
    sale: any,
) {
    const doc = new jsPDF({ orientation : "landscape"});
    const pageNumber = doc.getNumberOfPages();

    const columns = [
        {header: "N°", dataKey: "nume"},
        {header: "Membres", dataKey: "membre"},
        {header: "Tel", dataKey: "phone"},
        {header: "Email", dataKey: "email"},
        {header: "Coopérative", dataKey: "coop"},
        {header: "Date de création", dataKey: "date"},
        
    ]

    const sales = sale?.map((membres: any, index:any) => ({
        nume: index + 1,
        membre: `${membres?.nom ?? ""} ${membres?.postnom ?? ""} ${membres?.prenom ?? ""}`,
        phone: membres?.phone,
        email: membres?.email,
        coop: membres?.cooperative,
       
        date: dayjs(membres?.createdAt).format("DD/MM/YYYY à HH : MM"),
    }));
    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`LISTE DES AGRICULTEURS`, 150, 17, {
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

export async function generateAgriculteurMemberPdfparCooperative(
    title: string,
    subtitle: string,
    sale: any,
) {
    const doc = new jsPDF({ orientation : "landscape"});
    const pageNumber = doc.getNumberOfPages();

    const columns = [
        {header: "N°", dataKey: "nume"},
        {header: "Membres", dataKey: "membre"},
        {header: "Tel", dataKey: "phone"},
        {header: "Email", dataKey: "email"},
        // {header: "Coopérative", dataKey: "coop"},
        {header: "Date de création", dataKey: "date"},
        
    ]

    const sales = sale?.map((membres: any, index:any) => ({
        nume: index + 1,
        membre: `${membres?.nom ?? ""} ${membres?.postnom ?? ""} ${membres?.prenom ?? ""}`,
        phone: membres?.phone,
        email: membres?.email,
        // coop: membres?.cooperative,
       
        date: dayjs(membres?.createdAt).format("DD/MM/YYYY à HH : MM"),
    }));
    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`LISTE DES AGRICULTEURS ${subtitle}`, 150, 17, {
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