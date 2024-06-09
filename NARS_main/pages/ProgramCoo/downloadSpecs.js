import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const generatePdf = async () => {
  const input = document.getElementById('pdfContent');
  
  if (!input) {
    console.error('Element #pdfContent not found');
    return;
  }

  // Capture the entire content of the page
  const canvas = await html2canvas(input, {
    scale: 2, // Increase the scale for better quality
    useCORS: true,
    scrollY: -window.scrollY,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.8); // Set quality to 0.8 for moderate size and quality
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width; // Maintain aspect ratio

  let heightLeft = imgHeight;
  let position = 0;

  // Add the first page
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);

  heightLeft -= pdfHeight;

  // Add more pages if necessary
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save('program_specs.pdf');
};

export default generatePdf;
