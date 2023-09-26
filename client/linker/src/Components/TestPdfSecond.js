
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import TestPdf from './TestPdf';
const TestPdfSecond = () => {
    const generatePDF = async() => {
        const input = document.getElementById('componentToPDF'); // Replace with the ID of your component
        await document.fonts.ready;
        html2canvas(input, { scale: 1 }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('portrait','mm','a4');
          pdf.addImage(imgData, 'JPEG', 5, 5);
          pdf.save('component.pdf'); // Specify the desired file name
        });
      };
    return (
        <>
        <TestPdf id="componentToPDF" /> {/* Assign an ID */}
        <button onClick={generatePDF}>Generate PDF</button>
        </>
    )
}

export default TestPdfSecond
