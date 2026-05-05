// Copyright (c) 2026 Resume Forge
// Live App: https://resumewebin-p7wo9bht7-metpallyakshayareddy-1914s-projects.vercel.app/
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generates and downloads a PDF from a given HTML element ID.
 * Uses html2canvas for accurate wysiwyg rendering, solving many CSS complexities.
 * Intern-friendly and works perfectly with Tailwind.
 */
export const exportToPDF = async (elementId: string, filename: string = 'resume') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found.`);
    return;
  }

  try {
    // Increase scale for better text sharpness
    const canvas = await html2canvas(element, { 
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // A4 size parameters
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw error;
  }
};
