import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable, { CellInput } from "jspdf-autotable";

export async function generateToutStocksPdf(
    title: string,
    sale: any,
    purchase: any,
) {
    const doc = new jsPDF({ orientation : "landscape"});
    const pageNumber = doc.getNumberOfPages();

    const columns = [
        {header: "N°", dataKey: "nume"},
        {header: "Coopérative", dataKey: "coop"},
        {header: "Tel", dataKey: "tel"},
        {header: "Date Approvisionnement", dataKey: "date"},  
        {header: ""}    
    ]

    const columns2 = [
        {header: "Designation", dataKey: "design"},
        {header: "Qte", dataKey: "qte"},
        {header: "P.U", dataKey: "pu"}, 
        {header: "Commission", dataKey: "commission"},
        {header: "Date", dataKey: "date"}
    ]
    const sales = sale?.map((stocks: any, index: any) => ({
        nume : index + 1,
        coop: `${stocks?.__tbl_ecom_cooperative?.cooperative ?? ""}`,
        tel: stocks?.__tbl_ecom_cooperative?.phone,
        date: dayjs(stocks?.createdAt).format("DD/MM/YYYY à HH : MM"),
       
    }));
    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`FICHES DES STOCKS`, 150, 17, {
        align: "center",
    })

    const purchases = purchase?.__tbl_ecom_produits?.map((produit: any) => ({
        design: `${produit?.produit ?? ""}`,
        qte: produit?.__tbl_ecom_hasproducts?.qte,
        pu: `${produit?.__tbl_ecom_hasproducts?.prix_unitaire ?? ""} ${produit?.__tbl_ecom_hasproducts?.currency ?? ""}`,
        commission: `${produit?.__tbl_ecom_hasproducts?.prix_plus_commission ?? ""} ${produit?.__tbl_ecom_hasproducts?.currency ?? ""}`,
        date: dayjs(produit?.__tbl_ecom_hasproducts?.createdAt).format("DD/MM/YYYY à HH : MM"),
    })) || [];
    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`STOCKS`, 150, 17, {
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
                doc.text(`Coopérative`, 215, 27, {align: "center"})
            }
        },
    });
    
    autoTable(doc, {
        head: [columns2.map((col) => col.header)],
        body: purchases?.map(
            (row: any) =>
                columns2.map(
                    (col) => row[col.dataKey as keyof typeof row]
                ) as CellInput[]
        ),
        startY: 30,
        margin: {left : 10},
        theme: "grid",
        willDrawPage: (data) => {
            if (data.pageNumber === 1) {
                doc.setFontSize(10);
                doc.text(`Coopérative`, 215, 27, {align: "center"})
            }
        },
    });

    doc.save(`${title}.pdf`);

   
}