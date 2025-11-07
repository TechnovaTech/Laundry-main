import jsPDF from 'jspdf';
import acsLogo from '@/assets/ACS LOGO.png';
import usLogo from '@/assets/LOGO MARK GRADIENT.png';
import { API_URL } from '@/config/api';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export const generateInvoicePDF = async (order: any) => {
  if (!order) return;

  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  let hubAddress = {
    name: 'Urban Steam',
    address: '#7/4B, 1st Cross, 5th Main Road,',
    address2: 'Manjunatha Layout, R T Nagar Post, near',
    address3: 'Mamtha School, Bengaluru - 560032',
    email: 'support@urbansteam.in',
    gst: '29ACLFAA519M1ZW'
  };
  
  try {
    const response = await fetch(`${API_URL}/api/check-serviceable?pincode=${order.pickupAddress?.pincode}`);
    const data = await response.json();
    if (data.serviceable && data.hub) {
      hubAddress = {
        name: data.hub.name || 'Urban Steam',
        address: data.hub.address || hubAddress.address,
        address2: data.hub.address2 || hubAddress.address2,
        address3: data.hub.city ? `${data.hub.city} - ${data.hub.pincode}` : hubAddress.address3,
        email: data.hub.email || hubAddress.email,
        gst: data.hub.gstNumber || hubAddress.gst
      };
    }
  } catch (error) {
    console.log('Using default hub address');
  }
  
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Add logos
  doc.addImage(acsLogo, 'PNG', 15, 12, 30, 12);
  doc.addImage(usLogo, 'PNG', pageWidth - 45, 12, 30, 12);
  doc.setTextColor(0, 0, 0);
  
  // Invoice header section
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.rect(15, 30, pageWidth - 30, 20);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('ORIGINAL FOR RECIPIENT', 17, 36);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', 17, 43);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`#${order.orderId || 'N/A'}`, 17, 48);
  doc.setTextColor(0, 0, 0);
  
  // Date, Billed to, From section
  const sectionY = 55;
  const sectionHeight = 38;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.rect(15, sectionY, 45, sectionHeight);
  doc.rect(62, sectionY, 63, sectionHeight);
  doc.rect(127, sectionY, pageWidth - 142, sectionHeight);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Issued', 17, sectionY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(new Date(order.createdAt).toLocaleDateString('en-GB'), 17, sectionY + 11);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Due', 17, sectionY + 19);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(new Date(order.createdAt).toLocaleDateString('en-GB'), 17, sectionY + 24);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Billed to', 64, sectionY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(order.customer?.name || 'Customer Name', 64, sectionY + 11);
  doc.setTextColor(80, 80, 80);
  const address = doc.splitTextToSize(order.pickupAddress?.street || 'Customer address', 58);
  doc.text(address, 64, sectionY + 15);
  doc.text(`${order.pickupAddress?.city || 'City'}, ${order.pickupAddress?.state || 'State'}`, 64, sectionY + 19);
  doc.text(`Pincode: ${order.pickupAddress?.pincode || '000000'}`, 64, sectionY + 23);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.text(`Order ID: ${order.orderId || 'N/A'}`, 64, sectionY + 28);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('From', 129, sectionY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(hubAddress.name, 129, sectionY + 11);
  doc.setTextColor(80, 80, 80);
  const hubAddr = doc.splitTextToSize(`${hubAddress.address} ${hubAddress.address2} ${hubAddress.address3}`, 52);
  doc.text(hubAddr, 129, sectionY + 15);
  doc.setFontSize(7.5);
  doc.text(`Email: ${hubAddress.email}`, 129, sectionY + 28);
  doc.text(`GST: ${hubAddress.gst}`, 129, sectionY + 32);
  doc.setTextColor(0, 0, 0);
  
  let yPos = 98;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.setFillColor(245, 245, 245);
  doc.rect(15, yPos, pageWidth - 30, 7, 'FD');
  yPos += 5;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Service', 17, yPos);
  doc.text('Qty', 135, yPos, { align: 'center' });
  doc.text('Rate (Rs)', 160, yPos, { align: 'right' });
  doc.text('Total (Rs)', pageWidth - 17, yPos, { align: 'right' });
  
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  let subtotal = 0;
  
  if (order.items && order.items.length > 0) {
    order.items.forEach((item: any) => {
      const itemTotal = (item.quantity || 0) * (item.price || 0);
      subtotal += itemTotal;
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text(item.name || 'Service name', 17, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(7.5);
      const desc = doc.splitTextToSize(item.description || 'Description', 110);
      doc.text(desc, 17, yPos + 3);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8.5);
      doc.text(String(item.quantity || 0), 135, yPos, { align: 'center' });
      doc.text('Rs' + (item.price || 0).toFixed(2), 160, yPos, { align: 'right' });
      doc.text('Rs' + itemTotal.toFixed(2), pageWidth - 17, yPos, { align: 'right' });
      yPos += 10;
    });
  }
  
  // Add cancellation fee if exists
  if (order.cancellationFee && order.cancellationFee > 0) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text('Cancellation Fee Applied', 17, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(7.5);
    doc.text(order.cancellationReason || 'Cancellation charge', 17, yPos + 3);
    doc.setTextColor(220, 38, 38);
    doc.setFontSize(8.5);
    doc.text('Rs' + order.cancellationFee.toFixed(2), pageWidth - 17, yPos, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    subtotal += order.cancellationFee;
    yPos += 10;
  }
  
  // Add delivery failure fee if exists
  if (order.deliveryFailureFee && order.deliveryFailureFee > 0) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text('Delivery Failure Fee Applied', 17, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(7.5);
    doc.text(order.deliveryFailureReason || 'Delivery failure charge', 17, yPos + 3);
    doc.setTextColor(220, 38, 38);
    doc.setFontSize(8.5);
    doc.text('Rs' + order.deliveryFailureFee.toFixed(2), pageWidth - 17, yPos, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    subtotal += order.deliveryFailureFee;
    yPos += 10;
  }
  
  yPos += 10;
  doc.setDrawColor(220, 220, 220);
  doc.line(15, yPos, pageWidth - 15, yPos);
  yPos += 6;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal', 135, yPos);
  doc.text('Rs' + subtotal.toFixed(2), pageWidth - 17, yPos, { align: 'right' });
  yPos += 7;
  const discountPercent = order.discount || 0;
  doc.text('Discount/Coupon', 135, yPos);
  doc.text(discountPercent + '%', pageWidth - 17, yPos, { align: 'right' });
  yPos += 9;
  
  doc.setDrawColor(220, 220, 220);
  doc.line(135, yPos, pageWidth - 15, yPos);
  yPos += 7;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Total', 135, yPos);
  doc.text('Rs' + (order.totalAmount || subtotal).toFixed(2), pageWidth - 17, yPos, { align: 'right' });
  yPos += 9;
  doc.setFontSize(11);
  doc.setTextColor(69, 45, 155);
  doc.text('Amount due', 135, yPos);
  doc.text('Rs' + (order.totalAmount || subtotal).toFixed(2), pageWidth - 17, yPos, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  
  yPos = pageHeight - 25;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Thank you for choosing Urban Steam', 15, yPos);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('In case of any issues contact support@urbansteam.in within 24 hours of delivery', 15, yPos + 5);
  
  // Check if running on mobile (Capacitor)
  if (Capacitor.isNativePlatform()) {
    try {
      const pdfBase64 = doc.output('datauristring').split(',')[1];
      const fileName = `Invoice_${order.orderId || 'order'}_${Date.now()}.pdf`;
      
      const result = await Filesystem.writeFile({
        path: fileName,
        data: pdfBase64,
        directory: Directory.Cache
      });
      
      await Share.share({
        title: `Invoice #${order.orderId}`,
        text: `Invoice for Order #${order.orderId}`,
        url: result.uri,
        dialogTitle: 'Share Invoice'
      });
    } catch (error: any) {
      console.error('Invoice error:', error);
      alert(`Failed to generate invoice: ${error.message || 'Unknown error'}`);
    }
  } else {
    doc.save(`Invoice-${order.orderId || 'order'}.pdf`);
  }
};
