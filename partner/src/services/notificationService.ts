'use client'

export interface PartnerNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'pickup' | 'delivery' | 'payment' | 'system';
  orderId?: string;
}

class PartnerNotificationService {
  private static instance: PartnerNotificationService;
  private deletedKey = 'partner_deleted_notifications';
  private readKey = 'partner_read_notifications';

  static getInstance(): PartnerNotificationService {
    if (!PartnerNotificationService.instance) {
      PartnerNotificationService.instance = new PartnerNotificationService();
    }
    return PartnerNotificationService.instance;
  }

  getDeletedNotifications(): string[] {
    try {
      const deleted = localStorage.getItem(this.deletedKey);
      return deleted ? JSON.parse(deleted) : [];
    } catch (error) {
      console.error('Error loading deleted notifications:', error);
      return [];
    }
  }

  getReadNotifications(): string[] {
    try {
      const read = localStorage.getItem(this.readKey);
      return read ? JSON.parse(read) : [];
    } catch (error) {
      console.error('Error loading read notifications:', error);
      return [];
    }
  }

  deleteNotification(id: string): void {
    try {
      const deleted = this.getDeletedNotifications();
      if (!deleted.includes(id)) {
        deleted.push(id);
        localStorage.setItem(this.deletedKey, JSON.stringify(deleted));
        console.log('Notification deleted locally:', id);
      }
    } catch (error) {
      console.error('Error deleting notification locally:', error);
    }
  }

  // Sync deleted notifications with server
  async syncDeletedWithServer(partnerId: string, apiUrl: string): Promise<void> {
    try {
      const deleted = this.getDeletedNotifications();
      if (deleted.length > 0) {
        await fetch(`${apiUrl}/api/mobile/notifications/sync-deleted`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            partnerId: partnerId,
            deletedNotificationIds: deleted
          })
        });
        console.log('Synced deleted notifications with server');
      }
    } catch (error) {
      console.log('Could not sync with server:', error);
    }
  }

  markAsRead(id: string): void {
    try {
      const read = this.getReadNotifications();
      if (!read.includes(id)) {
        read.push(id);
        localStorage.setItem(this.readKey, JSON.stringify(read));
        console.log('Notification marked as read:', id);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  filterNotifications(notifications: PartnerNotification[]): PartnerNotification[] {
    const deleted = this.getDeletedNotifications();
    const read = this.getReadNotifications();

    return notifications
      .filter(notif => !deleted.includes(notif.id))
      .map(notif => ({
        ...notif,
        read: notif.read || read.includes(notif.id)
      }));
  }

  getMockNotifications(): PartnerNotification[] {
    const stored = localStorage.getItem('partner_notifications');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error loading stored notifications:', error);
      }
    }
    
    const defaultNotifications = [
      {
        id: 'mock-pickup-1',
        title: 'New Pickup Available',
        message: 'A new pickup order is available in your area. Order #ORD001',
        timestamp: new Date().toISOString(),
        read: false,
        type: 'pickup',
        orderId: 'ORD001'
      },
      {
        id: 'mock-payment-1',
        title: 'Payment Received',
        message: 'You have received payment of ₹350 for order #ORD003',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true,
        type: 'payment',
        orderId: 'ORD003'
      }
    ];
    
    this.saveNotifications(defaultNotifications);
    return defaultNotifications;
  }

  addNotification(notification: PartnerNotification): void {
    const notifications = this.getMockNotifications();
    notifications.unshift(notification);
    this.saveNotifications(notifications);
  }

  private saveNotifications(notifications: PartnerNotification[]): void {
    try {
      localStorage.setItem('partner_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }
}

export default PartnerNotificationService;