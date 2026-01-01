import { useEffect, useRef } from 'react';
import { API_URL } from '@/config/api';
import NotificationService from '@/services/notificationService';

interface Order {
  _id: string;
  orderId: string;
  status: string;
  customerId: string;
}

// Statuses that should trigger notifications
const NOTIFICATION_STATUSES = [
  'delivered_to_hub',
  'out_for_delivery', 
  'delivered',
  'cancelled',
  'delivery_failed',
  'suspended'
];

export const useOrderStatusMonitor = () => {
  const lastOrderStatuses = useRef<Map<string, string>>(new Map());
  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) return;

    // Request notification permission on first load
    notificationService.requestPermission();

    const checkOrderStatuses = async () => {
      try {
        console.log('Checking order statuses for customer:', customerId);
        const response = await fetch(`${API_URL}/api/orders?customerId=${customerId}`);
        const data = await response.json();
        
        console.log('Orders API response:', data);
        
        if (data.success && data.data && Array.isArray(data.data)) {
          const orders: Order[] = data.data;
          console.log('Found orders:', orders.length);
          
          orders.forEach((order) => {
            const lastStatus = lastOrderStatuses.current.get(order.orderId);
            const currentStatus = order.status;
            
            console.log(`Order ${order.orderId}: ${lastStatus || 'NEW'} -> ${currentStatus}`);
            
            // Create notification if status is notification-worthy and either:
            // 1. Status changed from a different status
            // 2. First time seeing this order with a notification-worthy status
            if (NOTIFICATION_STATUSES.includes(currentStatus)) {
              if (!lastStatus || (lastStatus !== currentStatus)) {
                console.log(`Creating notification for order ${order.orderId} status: ${currentStatus}`);
                notificationService.createOrderStatusNotification(order.orderId, currentStatus);
              }
            }
            
            // Update the last known status
            lastOrderStatuses.current.set(order.orderId, currentStatus);
          });
        } else {
          console.log('No orders found or invalid response format');
        }
      } catch (error) {
        console.error('Failed to check order statuses:', error);
      }
    };

    // Initial check
    checkOrderStatuses();

    // Set up polling every 3 seconds for real-time updates
    const interval = setInterval(checkOrderStatuses, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    // Manually trigger a status check
    checkNow: async () => {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) return;

      try {
        const response = await fetch(`${API_URL}/api/orders?customerId=${customerId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const orders: Order[] = data.data;
          
          orders.forEach((order) => {
            const lastStatus = lastOrderStatuses.current.get(order.orderId);
            const currentStatus = order.status;
            
            if (lastStatus && lastStatus !== currentStatus && NOTIFICATION_STATUSES.includes(currentStatus)) {
              notificationService.createOrderStatusNotification(order.orderId, currentStatus);
            }
            
            lastOrderStatuses.current.set(order.orderId, currentStatus);
          });
        }
      } catch (error) {
        console.error('Failed to check order statuses:', error);
      }
    }
  };
};