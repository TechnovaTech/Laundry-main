import jsPDF from 'jspdf';
import { API_URL } from '@/config/api';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { ACS_LOGO_BASE64, URBAN_STEAM_LOGO_BASE64 } from './invoiceAssets';

// Add custom font with rupee support
const addCustomFont = (doc: jsPDF) => {
  try {
    // Use Times font which has better Unicode support
    doc.setFont('times', 'normal');
  } catch (e) {
    doc.setFont('helvetica', 'normal');
  }
};

const getRupeeSymbol = () => 'Rs';

// Convert images to base64 for mobile compatibility
const loadImageAsBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject(new Error('Canvas context failed'));
        }
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = url;
    setTimeout(() => reject(new Error('Image load timeout')), 5000);
  });
};

export const generateInvoicePDF = async (order: any) => {
  if (!order) return;

  try {
    // Fetch customer data
    let customerName = order.customerId?.name || order.customer?.name || 'Customer';
    let customerMobile = order.customerId?.mobile || order.customer?.mobile || '';
    
    if (!customerName || customerName === 'Customer' || !customerMobile) {
      try {
        const response = await fetch(`${API_URL}/api/customers/${order.customerId?._id || order.customerId}`);
        const data = await response.json();
        if (data.success && data.data) {
          customerName = data.data.name || customerName;
          customerMobile = data.data.mobile || customerMobile;
        }
      } catch (error) {
        console.log('Could not fetch customer data');
      }
    }
    
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Set custom font for rupee symbol support
    addCustomFont(doc);
    const rupeeSymbol = getRupeeSymbol();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Header logos - same width, increase height
    try {
      doc.addImage(ACS_LOGO_BASE64, 'PNG', 15, 8, 45, 32);
      doc.addImage(URBAN_STEAM_LOGO_BASE64, 'PNG', pageWidth - 60, 8, 45, 32);
    } catch (imgError) {
      doc.setFontSize(16);
      doc.setFont('times', 'bold');
      doc.text('ACS Group', 15, 24);
      doc.text('Urban Steam', pageWidth - 55, 24);
    }
    
    // Invoice header box
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(15, 30, pageWidth - 30, 25);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('ORIGINAL FOR RECIPIENT', 17, 36);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE', 17, 45);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`#${order.orderId || 'RW0R7'}`, 17, 51);
    doc.setTextColor(0, 0, 0);
    
    // Three column section
    let yStart = 65;
    doc.setDrawColor(200, 200, 200);
    doc.rect(15, yStart, 60, 40); // Issued/Due
    doc.rect(75, yStart, 70, 40); // Billed to
    doc.rect(145, yStart, pageWidth - 160, 40); // From
    
    // Issued section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Issued', 17, yStart + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(new Date(order.createdAt).toLocaleDateString('en-GB'), 17, yStart + 14);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Due', 17, yStart + 22);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(new Date(order.createdAt).toLocaleDateString('en-GB'), 17, yStart + 28);
    
    // Billed to section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Billed to', 77, yStart + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(customerName, 77, yStart + 14);
    
    const address = order.pickupAddress?.street || 'Xiv hall';
    const cityState = `${order.pickupAddress?.city || 'Rajkot'}, ${order.pickupAddress?.state || 'Gujarat'} - ${order.pickupAddress?.pincode || '360001'}`;
    doc.text(address, 77, yStart + 19);
    doc.text(cityState, 77, yStart + 24);
    
    doc.setFontSize(8);
    doc.text(`Contact Number: ${customerMobile || '8140126027'}`, 77, yStart + 30);
    doc.text(`Order Id: ${order.orderId || 'RW0R7'}`, 77, yStart + 35);
    
    // From section
    doc.setFontSize(9);
    doc.text('Email: support@urbansteam.in', 147, yStart + 8);
    doc.text('GST: 29ACLFAA519M1ZW', 147, yStart + 14);
    
    // Service table
    yStart = 115;
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 245, 245);
    doc.rect(15, yStart, pageWidth - 30, 10, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Service & Description', 17, yStart + 7);
    doc.text('Qty', 130, yStart + 7, { align: 'center' });
    doc.text('Rate', 155, yStart + 7, { align: 'center' });
    doc.text('Total', pageWidth - 17, yStart + 7, { align: 'right' });
    
    yStart += 15;
    let subtotal = 0;
    
    if (order.items && order.items.length > 0) {
      order.items.forEach((item: any) => {
        const itemTotal = (item.quantity || 0) * (item.price || 0);
        subtotal += itemTotal;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(item.name || 'Curtain', 17, yStart);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(item.description || 'Description', 17, yStart + 5);
        doc.setTextColor(0, 0, 0);
        
        doc.setFontSize(10);
        doc.text(String(item.quantity || 10), 130, yStart, { align: 'center' });
        doc.text('Rs' + (item.price || 75), 155, yStart, { align: 'center' });
        doc.text('Rs' + itemTotal, pageWidth - 17, yStart, { align: 'right' });
        yStart += 15;
      });
    } else {
      // Default items for demo
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Curtain', 17, yStart);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('Description', 17, yStart + 5);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text('10', 130, yStart, { align: 'center' });
      doc.text('Rs75', 155, yStart, { align: 'center' });
      doc.text('Rs750', pageWidth - 17, yStart, { align: 'right' });
      subtotal = 750;
    }
    
    // Summary section
    yStart += 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    doc.text('Subtotal', 130, yStart);
    doc.text('Rs' + subtotal, pageWidth - 17, yStart, { align: 'right' });
    yStart += 8;
    
    doc.text('Tax (0%)', 130, yStart);
    doc.text('Rs0.00', pageWidth - 17, yStart, { align: 'right' });
    yStart += 8;
    
    const discountPercent = order.discount || 25;
    doc.text('Discount/ Coupon code', 130, yStart);
    doc.text(discountPercent + '%', pageWidth - 17, yStart, { align: 'right' });
    yStart += 12;
    
    doc.setDrawColor(200, 200, 200);
    doc.line(130, yStart, pageWidth - 15, yStart);
    yStart += 8;
    
    const discountAmount = (subtotal * discountPercent) / 100;
    const finalTotal = subtotal - discountAmount;
    
    doc.setFont('times', 'bold');
    doc.text('Total', 130, yStart);
    doc.text('Rs' + Math.round(finalTotal), pageWidth - 17, yStart, { align: 'right' });
    yStart += 10;
    
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text('Grand Total', 130, yStart);
    doc.text('Rs' + Math.round(order.totalAmount || finalTotal), pageWidth - 17, yStart, { align: 'right' });
    
    // Footer
    yStart = pageHeight - 30;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank you for choosing Urban Steam', 15, yStart);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('📧 In case of any issues contact support@urbansteam.in within 24 hours of delivery', 15, yStart + 6);
  
    if (Capacitor.isNativePlatform()) {
      try {
        const pdfBlob = doc.output('blob');
        const reader = new FileReader();
        
        reader.onloadend = async () => {
          try {
            const base64 = (reader.result as string).split(',')[1];
            const fileName = `Invoice_${order.orderId || Date.now()}.pdf`;
            
            const result = await Filesystem.writeFile({
              path: fileName,
              data: base64,
              directory: Directory.Cache
            });
            
            const canShare = await Share.canShare();
            if (canShare.value) {
              await Share.share({
                title: `Invoice #${order.orderId}`,
                url: result.uri,
                dialogTitle: 'Save Invoice'
              });
            } else {
              alert(`Invoice saved to: ${result.uri}`);
            }
          } catch (shareError: any) {
            console.error('Share error:', shareError);
            alert(`Invoice generated but share failed: ${shareError.message}`);
          }
        };
        
        reader.onerror = () => {
          alert('Failed to read PDF data');
        };
        
        reader.readAsDataURL(pdfBlob);
      } catch (error: any) {
        console.error('Invoice error:', error);
        alert(`Error: ${error.message || 'Failed to generate invoice'}`);
      }
    } else {
      doc.save(`Invoice-${order.orderId || 'order'}.pdf`);
    }
  } catch (error: any) {
    console.error('PDF generation error:', error);
    alert(`Failed to create invoice: ${error.message || 'Unknown error'}`);
  }
};
