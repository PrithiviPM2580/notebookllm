import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

type LoadDocumentType = "text" | "pdf" | "html";

export const splitDocToChunks = async (
  docs: Document<Record<string, any>>[],
  props: {
    chunkSize: number;
    chunkOverlap: number;
  },
) => {
  const splitter = new RecursiveCharacterTextSplitter({
    ...props,
  });

  const splitDocs = await splitter.splitDocuments(docs);
  return splitDocs;
};

export const loadWeb = async (url: string) => {
  const loader = new CheerioWebBaseLoader(url);
  const docs = await loader.load();
  return docs;
};

export const loadPDF = async (filePath: string) => {
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();
  return docs;
};

export const loadText = async (filePath: string) => {
  const loader = new TextLoader(filePath);
  const docs = await loader.load();
  return docs;
};

export const loadDocuments = async (
  filePath: string,
  doctype: LoadDocumentType,
  chunkSize = 1000,
  chunkOverlap = 200,
) => {
  let docs = null;

  switch (doctype) {
    case "text":
      docs = await loadText(filePath);
      break;
    case "pdf":
      docs = await loadPDF(filePath);
      break;
    case "html":
      docs = await loadWeb(filePath);
      break;
    default:
      throw new Error(`Unsupported document type: ${doctype}`);
  }

  return splitDocToChunks(docs, { chunkSize, chunkOverlap });
};
