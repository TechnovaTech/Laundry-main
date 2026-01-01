import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ArrowLeft, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import NotificationService, { OrderNotification } from "@/services/notificationService";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    // Load notifications from service
    notificationService.loadNotifications();
    setNotifications(notificationService.getNotifications());
    
    // Subscribe to notification updates
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
    });

    // Fetch server notifications from admin panel
    notificationService.fetchServerNotifications();
    
    setLoading(false);

    return unsubscribe;
  }, []);

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const deleteNotification = (id: string) => {
    notificationService.deleteNotification(id);
  };

  const getNotificationIcon = (notification: OrderNotification) => {
    if (notification.type === 'order_status' && notification.orderStatus) {
      switch (notification.orderStatus) {
        case 'delivered_to_hub': return '🏭';
        case 'out_for_delivery': return '🚚';
        case 'delivered': return '✅';
        case 'cancelled': return '❌';
        case 'delivery_failed': return '⚠️';
        case 'suspended': return '🚫';
        default: return '📦';
      }
    }
    
    switch (notification.type) {
      case 'order_status': return '📦';
      case 'promotion': return '🎉';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  };

  const handleNotificationClick = (notification: OrderNotification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // If it's an order notification, navigate to order details
    if (notification.type === 'order_status' && notification.orderId) {
      navigate('/order-details', { state: { orderId: notification.orderId } });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#452D9B' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 page-with-bottom-nav">
      <Header 
        title="Notifications" 
        variant="gradient"
        leftAction={
          <ArrowLeft 
            className="w-5 h-5 sm:w-6 sm:h-6 text-white cursor-pointer" 
            onClick={() => navigate(-1)}
          />
        }
      />

      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Notifications</h3>
            <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${
                !notification.read ? 'border-l-4 border-blue-500' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">
                  {getNotificationIcon(notification)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-semibold text-sm sm:text-base ${
                      !notification.read ? 'text-black' : 'text-gray-700'
                    }`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className={`text-sm mt-1 ${
                    !notification.read ? 'text-gray-700' : 'text-gray-500'
                  }`}>
                    {notification.message.length > 100 ? 
                      `${notification.message.substring(0, 100)}...` : 
                      notification.message
                    }
                  </p>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Notifications;