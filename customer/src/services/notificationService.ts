import { API_URL } from '@/config/api';

export interface OrderNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order_status' | 'promotion' | 'system';
  orderId?: string;
  orderStatus?: string;
}

// Order status notification templates
const statusNotifications = {
  'delivered_to_hub': {
    title: '📦 Order at Processing Hub',
    message: 'Your order has been delivered to our processing hub and will be processed soon.'
  },
  'out_for_delivery': {
    title: '🚚 Out for Delivery',
    message: 'Great news! Your order is out for delivery and will reach you soon.'
  },
  'delivered': {
    title: '✅ Order Delivered Successfully',
    message: 'Your order has been successfully delivered. Thank you for choosing Urban Steam!'
  },
  'cancelled': {
    title: '❌ Order Cancelled',
    message: 'Your order has been cancelled. If you have any questions, please contact support.'
  },
  'delivery_failed': {
    title: '⚠️ Delivery Failed',
    message: 'We were unable to deliver your order. Our team will contact you to reschedule delivery.'
  },
  'suspended': {
    title: '🚫 Order Suspended',
    message: 'Your order has been suspended due to multiple delivery failures. Please contact support.'
  }
};

class NotificationService {
  private static instance: NotificationService;
  private notifications: OrderNotification[] = [];
  private listeners: ((notifications: OrderNotification[]) => void)[] = [];

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Subscribe to notification updates
  subscribe(callback: (notifications: OrderNotification[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  // Load notifications from localStorage
  loadNotifications() {
    try {
      const stored = localStorage.getItem('customer_notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  // Save notifications to localStorage
  private saveNotifications() {
    try {
      localStorage.setItem('customer_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  // Add a new notification
  private addNotification(notification: OrderNotification) {
    // Check if notification already exists to prevent duplicates
    const exists = this.notifications.find(n => 
      n.orderId === notification.orderId && 
      n.orderStatus === notification.orderStatus
    );
    
    if (exists) return;

    this.notifications.unshift(notification);
    
    // Keep only last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    this.saveNotifications();
    this.notifyListeners();

    // Show browser notification if permission granted
    this.showBrowserNotification(notification);
  }

  // Create order status notification
  createOrderStatusNotification(orderId: string, status: string) {
    const template = statusNotifications[status as keyof typeof statusNotifications];
    if (!template) return;

    const notification: OrderNotification = {
      id: `order_${orderId}_${status}_${Date.now()}`,
      title: template.title,
      message: `${template.message} (Order #${orderId})`,
      type: 'order_status',
      orderId,
      orderStatus: status,
      timestamp: new Date().toISOString(),
      read: false
    };

    this.addNotification(notification);
    
    // Send mobile push notification
    this.sendMobilePushNotification(notification);
  }

  // Mark notification as read
  markAsRead(id: string) {
    this.notifications = this.notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    this.saveNotifications();
    this.notifyListeners();
  }

  // Delete notification permanently
  deleteNotification(id: string) {
    // Remove from current notifications
    this.notifications = this.notifications.filter(notif => notif.id !== id);
    
    // Save to deleted list so it won't show again
    this.saveDeletedNotificationId(id);
    
    this.saveNotifications();
    this.notifyListeners();
  }

  // Get all notifications
  getNotifications(): OrderNotification[] {
    return this.notifications;
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(notif => !notif.read).length;
  }

  // Send mobile push notification using Capacitor
  private async sendMobilePushNotification(notification: OrderNotification) {
    try {
      // For Capacitor apps, we can use Local Notifications
      if (window.Capacitor?.isNativePlatform()) {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        
        // Request permission first
        const permission = await LocalNotifications.requestPermissions();
        
        if (permission.display === 'granted') {
          await LocalNotifications.schedule({
            notifications: [{
              id: parseInt(notification.id.replace(/\D/g, '').slice(-8)) || Math.floor(Math.random() * 100000),
              title: notification.title,
              body: notification.message,
              largeBody: notification.message,
              summaryText: 'Urban Steam',
              schedule: { at: new Date(Date.now() + 1000) }, // 1 second delay
              sound: 'default',
              attachments: [],
              actionTypeId: 'ORDER_NOTIFICATION',
              extra: {
                orderId: notification.orderId,
                orderStatus: notification.orderStatus,
                notificationId: notification.id
              },
              smallIcon: 'ic_stat_icon_config_sample',
              iconColor: '#452D9B',
              ongoing: false,
              autoCancel: true,
              channelId: 'order-updates'
            }]
          });
          
          console.log('Mobile push notification sent:', notification.title);
        } else {
          console.log('Notification permission not granted');
        }
      }
    } catch (error) {
      console.error('Failed to send mobile push notification:', error);
    }
  }

  // Show browser notification
  private showBrowserNotification(notification: OrderNotification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotif = new Notification(notification.title, {
        body: notification.message,
        icon: '/APP ICON.png',
        badge: '/APP ICON.png',
        tag: notification.id,
        requireInteraction: true
      });
      
      // Auto close after 5 seconds
      setTimeout(() => browserNotif.close(), 5000);
      
      // Handle click to navigate to order details
      browserNotif.onclick = () => {
        if (notification.orderId) {
          window.focus();
          // Navigate to order details if possible
          const event = new CustomEvent('notificationClick', {
            detail: { orderId: notification.orderId }
          });
          window.dispatchEvent(event);
        }
        browserNotif.close();
      };
    }
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    try {
      // For mobile apps using Capacitor
      if (window.Capacitor?.isNativePlatform()) {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        const permission = await LocalNotifications.requestPermissions();
        return permission.display === 'granted';
      }
      
      // For web browsers
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
      }

      if (Notification.permission === 'granted') {
        return true;
      }

      if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }

      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Fetch notifications from server (for future server-side notifications)
  async fetchServerNotifications() {
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) return;

      const response = await fetch(`${API_URL}/api/mobile/notifications?audience=customers&customerId=${customerId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        // Get list of deleted notification IDs for this user
        const deletedIds = this.getDeletedNotificationIds();
        
        // Filter out deleted notifications
        const serverNotifications = data.data
          .filter((notif: any) => !deletedIds.includes(notif.id))
          .map((notif: any) => ({
            id: notif.id,
            title: notif.title,
            message: notif.message,
            timestamp: notif.timestamp,
            read: false,
            type: notif.type || 'system',
            orderId: notif.orderId,
            orderStatus: notif.orderStatus
          }));

        // Add server notifications that don't exist locally
        serverNotifications.forEach((serverNotif: OrderNotification) => {
          if (!this.notifications.find(local => local.id === serverNotif.id)) {
            this.notifications.unshift(serverNotif);
          }
        });

        this.saveNotifications();
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to fetch server notifications:', error);
    }
  }

  // Get deleted notification IDs for this user
  private getDeletedNotificationIds(): string[] {
    try {
      const deleted = localStorage.getItem('deleted_notifications');
      return deleted ? JSON.parse(deleted) : [];
    } catch (error) {
      return [];
    }
  }

  // Save deleted notification ID
  private saveDeletedNotificationId(id: string) {
    try {
      const deletedIds = this.getDeletedNotificationIds();
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('deleted_notifications', JSON.stringify(deletedIds));
      }
    } catch (error) {
      console.error('Failed to save deleted notification ID:', error);
    }
  }
}

export default NotificationService;