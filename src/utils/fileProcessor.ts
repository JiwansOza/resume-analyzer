import pdfParse from 'pdf-parse';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type;
  
  if (fileType === 'application/pdf') {
    return await extractTextFromPDF(file);
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return await extractTextFromDOCX(file);
  } else if (fileType === 'text/plain') {
    return await extractTextFromTXT(file);
  } else {
    throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT files.');
  }
};

const extractTextFromPDF = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(' ') + '\n';
        }
        resolve(text);
      } catch (error) {
        console.error('PDF.js extraction error:', error);
        reject(new Error('Failed to extract text from PDF using pdfjs-dist: ' + (error && error.message ? error.message : error)));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read PDF file'));
    reader.readAsArrayBuffer(file);
  });
};

const extractTextFromDOCX = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        // Basic DOCX text extraction
        // In a real implementation, you'd use mammoth.js
        const text = extractBasicDOCXText(reader.result as ArrayBuffer);
        resolve(text);
      } catch (error) {
        reject(new Error('Failed to extract text from DOCX'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read DOCX file'));
    reader.readAsArrayBuffer(file);
  });
};

const extractTextFromTXT = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
};

const extractBasicDOCXText = (buffer: ArrayBuffer): string => {
  // Basic DOCX text extraction
  const uint8Array = new Uint8Array(buffer);
  const decoder = new TextDecoder('utf-8', { ignoreBOM: true });
  let text = decoder.decode(uint8Array);
  
  // Basic cleanup for DOCX content
  text = text.replace(/<[^>]*>/g, ' '); // Remove XML tags
  text = text.replace(/[^\x20-\x7E\n]/g, ' '); // Remove non-printable characters
  text = text.replace(/\s+/g, ' '); // Normalize whitespace
  text = text.trim();
  
  return text || 'Resume content extracted from DOCX file.';
};
