import PDFParser from "pdf2json";

export function extractTextFromPDF(filePath) {
    return new Promise((resolve, reject) => {

        const pdfParser = new PDFParser(null, 1);

        pdfParser.on("pdfParser_dataError", (errData) => {
            reject(errData.parserError);
        });

        pdfParser.on("pdfParser_dataReady", (pdfData) => {

            let text = "";

            pdfData.Pages.forEach(page => {
                page.Texts.forEach(item => {

                    item.R.forEach(run => {
                        text += decodeURIComponent(run.T) + " ";
                    });

                    text += "\n";
                });

                text += "\n";
            });

            resolve(text);
        });

        pdfParser.loadPDF(filePath);

    });
}