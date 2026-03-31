import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Initialize PDF.js worker
// In a Vite environment, we usually need to point to the worker file.
// We'll try using the CDN version to avoid complex build config changes for now,
// or import it if the bundler handles it.
// A common pattern in Vite is:
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                // @ts-ignore - items can be TextItem or TextMarkedContent, we assume TextItem for simplicity
                .map((item) => item.str)
                .join(' ');
            fullText += pageText + '\n\n';
        }

        return fullText;
    } catch (error) {
        console.error('PDF Extraction Error:', error);
        throw new Error('Failed to extract text from PDF');
    }
};

export const extractTextFromImage = async (file: File): Promise<string> => {
    try {
        const result = await Tesseract.recognize(file, 'eng', {
            // logger: (m) => console.log(m), // Optional: logging
        });
        return result.data.text;
    } catch (error) {
        console.error('OCR Error:', error);
        throw new Error('Failed to extract text from Image');
    }
};
