import jsPDF from 'jspdf';

export const generateInvoicePDF = async (order: any) => {
  if (!order) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  let hubAddress = {
    name: 'Urban Steam',
    address: '#7/4B, 1st Cross, 5th Main Road,',
    address2: 'Manjunatha Layout, R T Nagar Post, near',
    address3: 'Mamtha School, Bengaluru - 560032',
    email: 'support@urbansteam.in',
    gst: '29ACLFAA519M1ZW'
  };
  
  try {
    const response = await fetch(`http://localhost:3000/api/check-serviceable?pincode=${order.pickupAddress?.pincode}`);
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
  
  doc.setFillColor(245, 245, 245);
  doc.rect(0, 0, pageWidth, 297, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(15, 15, pageWidth - 30, 267, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 140, 0);
  doc.text('ACS Group', 20, 25);
  doc.setTextColor(0, 120, 215);
  doc.text('Urban Steam', pageWidth - 55, 25);
  doc.setTextColor(0, 0, 0);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('ORIGINAL FOR RECIPIENT', 20, 38);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', 20, 48);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`#${order.orderId || 'N/A'}`, 20, 54);
  doc.setTextColor(0, 0, 0);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Issued', 20, 70);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(order.createdAt).toLocaleDateString('en-GB'), 20, 76);
  doc.setFont('helvetica', 'bold');
  doc.text('Due', 20, 88);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(order.createdAt).toLocaleDateString('en-GB'), 20, 94);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Billed to', 75, 70);
  doc.setFont('helvetica', 'normal');
  doc.text(order.customer?.name || 'Customer Name', 75, 76);
  doc.setTextColor(100, 100, 100);
  doc.text(order.pickupAddress?.street || 'Customer address', 75, 81);
  doc.text(`${order.pickupAddress?.city || 'City'}, ${order.pickupAddress?.state || 'Country'} - ${order.pickupAddress?.pincode || '000000'}`, 75, 86);
  doc.setTextColor(0, 0, 0);
  doc.text('Contact Number', 75, 96);
  doc.text('Order Id', 75, 101);
  
  doc.setFont('helvetica', 'bold');
  doc.text('From', 140, 70);
  doc.setFont('helvetica', 'normal');
  doc.text(hubAddress.name, 140, 76);
  doc.setTextColor(100, 100, 100);
  doc.text('Address', 140, 81);
  doc.text(hubAddress.address, 140, 86);
  doc.text(hubAddress.address2, 140, 91);
  doc.text(hubAddress.address3, 140, 96);
  doc.text(`Email Id :${hubAddress.email}`, 140, 101);
  doc.text(`GST No: ${hubAddress.gst}`, 140, 106);
  doc.setTextColor(0, 0, 0);
  
  let yPos = 120;
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPos - 5, pageWidth - 40, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Service', 22, yPos);
  doc.text('Qty', 130, yPos);
  doc.text('Rate', 155, yPos);
  doc.text('Total', 180, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  let subtotal = 0;
  
  if (order.items && order.items.length > 0) {
    order.items.forEach((item: any) => {
      const itemTotal = (item.quantity || 0) * (item.price || 0);
      subtotal += itemTotal;
      doc.setFont('helvetica', 'bold');
      doc.text(item.name || 'Service name', 22, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.text(item.description || 'Description', 22, yPos + 4);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.text(String(item.quantity || 0), 130, yPos);
      doc.text(`Rs${(item.price || 0).toFixed(2)}`, 155, yPos);
      doc.text(`Rs${itemTotal.toFixed(2)}`, 180, yPos);
      yPos += 12;
    });
  }
  
  yPos += 10;
  doc.setFontSize(9);
  doc.text('Subtotal', 155, yPos);
  doc.text(`Rs${subtotal.toFixed(2)}`, 180, yPos);
  yPos += 8;
  doc.text('Tax (0%)', 155, yPos);
  doc.text('Rs0.00', 180, yPos);
  yPos += 8;
  const discountPercent = order.discount || 0;
  doc.text('Discount/Coupon code', 155, yPos);
  doc.text(discountPercent > 0 ? `${discountPercent}%` : '0%', 180, yPos);
  yPos += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Total', 155, yPos);
  doc.text(`Rs${(order.totalAmount || subtotal).toFixed(2)}`, 180, yPos);
  yPos += 10;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 200);
  doc.text('Amount due', 155, yPos);
  doc.text(`Rs${(order.totalAmount || subtotal).toFixed(2)}`, 180, yPos);
  doc.setTextColor(0, 0, 0);
  
  yPos += 20;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for choosing Urban Steam', 20, yPos);
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('Incase of any issues contact support@urbansteam.in within 24 hours of delivery', 20, yPos + 5);
  
  doc.save(`Invoice-${order.orderId || 'order'}.pdf`);
};
