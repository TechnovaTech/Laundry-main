import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Phone, Shirt, Clock, Package, Truck, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const orderId = location.state?.orderId;
  
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderId]);
  
  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getTimeline = () => {
    if (!order) return [];
    
    const statusMap = {
      'pending': 0,
      'confirmed': 1,
      'picked_up': 2,
      'processing': 3,
      'ready': 3,
      'out_for_delivery': 4,
      'delivered': 5
    };
    
    const currentStep = statusMap[order.status] || 0;
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    });
    
    return [
      { icon: Clock, label: `Scheduled - ${orderDate}`, completed: currentStep >= 0, active: currentStep === 0 },
      { icon: Package, label: `Confirmed - ${orderDate}`, completed: currentStep >= 1, active: currentStep === 1 },
      { icon: Package, label: `Picked Up - ${orderDate}`, completed: currentStep >= 2, active: currentStep === 2 },
      { icon: Shirt, label: `Processing - ${orderDate}`, completed: currentStep >= 3, active: currentStep === 3 },
      { icon: Truck, label: `Out for Delivery - ${orderDate}`, completed: currentStep >= 4, active: currentStep === 4 },
      { icon: CheckCircle2, label: `Delivered - ${orderDate}`, completed: currentStep >= 5, active: currentStep === 5 },
    ];
  };
  
  const timeline = getTimeline();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 bg-background border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between z-10">
        <button onClick={() => navigate(-1)} className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold flex-1 text-center mx-4">Track Order</h1>
        <button className="flex-shrink-0">
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </button>
      </header>

      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading order details...
          </div>
        ) : !order ? (
          <div className="text-center py-8 text-gray-500">
            Order not found
          </div>
        ) : (
          <>
        <Card className="p-3 sm:p-4 rounded-2xl border-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <Shirt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm sm:text-base">Order #{order?.orderId || 'N/A'}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {order?.items?.map((item: any) => `${item.quantity} ${item.name}`).join(', ') || 'No items'}
                </p>
                <p className="text-base sm:text-lg font-bold text-primary">₹{order?.totalAmount || 0}</p>
              </div>
            </div>
            <span className="px-2 sm:px-4 py-1 sm:py-1.5 bg-primary text-white text-xs sm:text-sm font-semibold rounded-full flex-shrink-0">
              {order?.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ') : 'Unknown'}
            </span>
          </div>
        </Card>

        <div className="space-y-3 sm:space-y-4">
          {timeline.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.completed
                      ? item.active
                        ? "bg-primary"
                        : "bg-primary"
                      : "bg-muted"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      item.completed ? "text-white" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-sm sm:text-base ${
                      item.active ? "text-primary" : item.completed ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Card className="p-3 sm:p-4 rounded-2xl border-2 bg-muted/50">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Pickup Address: {order?.pickupAddress ? `${order.pickupAddress.street}, ${order.pickupAddress.city}` : 'Not specified'}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Pickup Slot: {order?.pickupSlot?.timeSlot || 'Not scheduled'}
          </p>
        </Card>

        <div className="flex gap-2 sm:gap-3">
          <Button variant="outline" className="flex-1 h-10 sm:h-12 rounded-2xl font-semibold text-xs sm:text-sm">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Contact Partner
          </Button>
          <Button variant="destructive" className="flex-1 h-10 sm:h-12 rounded-2xl font-semibold text-xs sm:text-sm">
            ⚠ Report Issue
          </Button>
        </div>

        <Button className="w-full h-10 sm:h-12 rounded-2xl font-semibold text-sm sm:text-base">
          <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Download Invoice ⚙
        </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
