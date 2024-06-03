import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const generatePdf = () => {
  const input = document.getElementById('pdfContent');
  
  if (!input) {
    console.error('Element #pdfContent not found');
    return;
  }

  html2canvas(input, {
    scale: 2, // Increase the scale for better quality
    useCORS: true,
    scrollY: -window.scrollY,
  }).then((canvas) => {
    const imgData = canvas.toDataURL('image/jpeg', 0.8); // Set quality to 0.8 for moderate size and quality
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth * 0.9; // Reduce image width to 90% of PDF width
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

    const xOffset = (pdfWidth - imgWidth) / 2; // Center horizontally
    let position = 0;

    pdf.addImage(imgData, 'JPEG', xOffset, position, imgWidth, imgHeight);

    if (imgHeight < pdfHeight) {
      position += imgHeight;
    }

    while (position + imgHeight <= pdfHeight) {
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', xOffset, 0, imgWidth, imgHeight);
      position += imgHeight;
    }

    pdf.save('program_specs.pdf');
  }).catch((error) => {
    console.error('Error generating PDF:', error);
  });
};

export default generatePdf;
