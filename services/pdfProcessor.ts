
import { PageTokenData } from '../types';

// Access pdfjsLib from the window object, as loaded in index.html
const getPdfjsLib = (): any => {
    return (window as any).pdfjsLib;
}

const tokenizeText = (text: string): number => {
  if (!text.trim()) {
    return 0;
  }
  // Simple tokenization: split by whitespace and count non-empty strings.
  // This is a basic form of word counting.
  return text.trim().split(/\s+/).filter(Boolean).length;
};

export const processPdfFile = async (file: File): Promise<{ pageTokens: PageTokenData[], totalTokens: number }> => {
  const pdfjsLib = getPdfjsLib();
  if (!pdfjsLib) {
    throw new Error("PDF.js library is not loaded. Cannot process PDF.");
  }
  
  // Ensure worker is set (it might be set globally in App.tsx or index.html already, but good to double check)
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
     pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  const pageTokens: PageTokenData[] = [];
  let totalTokens = 0;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    
    // Concatenate all text items on the page
    const pageText = textContent.items.map((item: any) => { // item is TextItem
        if ('str' in item) { // Type guard for TextItem
            return item.str;
        }
        return ''; // Handle cases where item might not have 'str', though unlikely for TextItem
    }).join(' ');

    const tokensOnPage = tokenizeText(pageText);
    pageTokens.push({ 
      pageNumber: i, 
      tokenCount: tokensOnPage,
      text: pageText.trim()
    });
    totalTokens += tokensOnPage;
  }

  return { pageTokens, totalTokens };
};
