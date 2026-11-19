import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable, { CellInput } from "jspdf-autotable";

export async function generateHistoriqueStocksPdf(
    title: string,
    sale: any,
    purchase: any,
) {
    const doc = new jsPDF({ orientation : "landscape"});
    const pageNumber = doc.getNumberOfPages();

    const columns = [
        {header: "N°", dataKey: "nume"},
        {header: "PRODUIT", dataKey: "produit"},
        {header: "Q.E", dataKey: "qte"},
        {header: "P.E", dataKey: "pu"},
        {header: "P.COMM", dataKey: "pc"},
        {header: "Date Production", dataKey: "dteprod"},
        {header: "Date APPROV.", dataKey: "date"}
    ]

    const columns2 = [
        {header: "N°", dataKey: "nume"},
        {header: "Q.I", dataKey: "qi"},
        {header: "Q.CRITIQUE", dataKey: "qcrit"},
        {header: "P.U", dataKey: "pu"}, 
        {header: "P.E", dataKey: "pu"},
        {header: "P.COMM", dataKey: "pc"},
        {header: "DATE", dataKey: "date"},  
    ]
    const sales = sale?.map((entree: any, index: any) => ({
        nume : index + 1,
        produit: `${entree?.[0].produit ?? ""}`,
        qte: entree?.[0]?.__tbl_ecom_hasproducts?.qte,
        pu: `${entree?.[0]?.__tbl_ecom_hasproducts?.prix_unitaire}.${entree?.[0]?.__tbl_ecom_hasproducts?.currency}`,
        pc: `${entree?.[0]?.__tbl_ecom_hasproducts?.prix_plus_commission}.${entree?.[0]?.__tbl_ecom_hasproducts?.currency}`,
        dteprod: entree?.[0]?.date_production,
        date: dayjs(entree?.[0]?.createdAt).format("DD/MM/YYYY à HH : MM"),
       
    }));
    
    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(``, 150, 17, {
        align: "center",
    })

    const purchases = purchase?.map((mouvement: any, index: any) => ({
        nume : index + 1,
        qi: `${mouvement?.mouvements?.qte ?? ""}`,
        qcrit: mouvement?.mouvements?.qte_critique,
        pu: `${mouvement?.mouvements?.prix_unitaire}.${mouvement?.mouvements?.currency}`,
        pc: `${mouvement?.mouvements?.prix_plus_commission}.${mouvement?.mouvements?.currency}`,
        date: dayjs(mouvement?.mouvements?.createdAt).format("DD/MM/YYYY à HH : MM"),
    })) || [];
    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(``, 150, 17, {
        align: "center",
    })
    
    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(`HISTORIQUE DE STOCKS`, 150, 15, {
        align: "center",
    });

    const startY1 = 40; // Ajustez la valeur selon vos besoins

    autoTable(doc, {
        head: [columns.map((col) => col.header)],
        body: sales.map(
            (row: any) =>
                columns.map(
                    (col) => row[col.dataKey as keyof typeof row]
                ) as CellInput[]
        ),
        startY: startY1,
        margin: { left: 10 },
        theme: "grid",
        willDrawPage: (data) => {
            if (data.pageNumber === 1) {
                doc.setFontSize(10);
                doc.text(`STOCK ENTRER`, 30, 35, { align: "center" });
            }
        },
    });

    doc.setFont("Cario-Regular");
    doc.setFontSize(13);
    doc.text(``, 150, startY1 + 10, {
        align: "center",
    });

    const lineCount = purchases?.length ?? 0;
    const lineHeight = 5; // Ajustez la valeur selon la hauteur de chaque ligne du tableau
    const startY2 = startY1 + lineCount * lineHeight + 20; // Ajustez la valeur selon vos besoins

    doc.setFont("Cario-Regular");
    doc.setFontSize(10);
    doc.text(`MOUVEMENT DE STOCKS`, 38, startY2, {
        align: "center",
    });

    autoTable(doc, {
        head: [columns2.map((col) => col.header)],
        body: purchases?.map(
            (row: any) =>
                columns2.map(
                    (col) => row[col.dataKey as keyof typeof row]
                ) as CellInput[]
        ),
        startY: startY2 + 5, // Ajustez la valeur selon vos besoins
        margin: { left: 10 },
        theme: "grid",
    });

    doc.save(`${title}.pdf`);
   
}