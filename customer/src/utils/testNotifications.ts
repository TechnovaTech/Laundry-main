import NotificationService from '@/services/notificationService';

// Test function to simulate order status notifications
export const testOrderNotifications = () => {
  const notificationService = NotificationService.getInstance();
  
  // Test different order statuses
  const testStatuses = [
    'delivered_to_hub',
    'out_for_delivery', 
    'delivered',
    'cancelled',
    'delivery_failed',
    'suspended'
  ];
  
  testStatuses.forEach((status, index) => {
    setTimeout(() => {
      notificationService.createOrderStatusNotification(`TEST${index + 1}`, status);
    }, index * 2000); // 2 second delay between each notification
  });
  
  console.log('Test notifications will be sent over the next 12 seconds');
};

// Add to window for easy testing in browser console
if (typeof window !== 'undefined') {
  (window as any).testOrderNotifications = testOrderNotifications;
}