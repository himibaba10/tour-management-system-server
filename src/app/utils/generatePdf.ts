/* eslint-disable no-console */
import AppError from "./AppError";
import PDFDocument from "pdfkit";

export interface IInvoiceData {
  transactionId: string;
  username: string;
  tourTitle: string;
  guestCount: number;
  totalCost: number;
  bookingDate: Date;
}

const generatePdf = async (
  invoiceData: IInvoiceData
): Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });

      const buffer: Uint8Array[] = [];

      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (error) => reject(error));

      // Transform date
      const date = new Date(invoiceData.bookingDate).toLocaleDateString(
        undefined,
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      // PDF Content
      doc.fontSize(25).text(`Invoice from Tour Management - Booked on ${date}`);
      doc.fontSize(16).text(`Transaction Id: ${invoiceData.transactionId}`);
      doc.moveDown();

      doc.text(`Tour Title: ${invoiceData.tourTitle}`);
      doc.text(`Booked By: ${invoiceData.username}`);
      doc.text(`Guest Count: ${invoiceData.guestCount}`);
      doc.text(`Total cost: ${invoiceData.totalCost}`);

      doc.moveDown();

      doc.text("Thank you for choosing Tour Management Platform!");

      doc.end();
    });
  } catch (error: any) {
    console.log(error);
    throw new AppError(`Error generating invoice - ${error.message}`);
  }
};

export default generatePdf;
