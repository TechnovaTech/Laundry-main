import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle2, MapPin, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toast, ConfirmDialog } from "@/components/Toast";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state || {};
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' }>({ show: false, message: '', type: 'success' });
  const [cancellationPercentage, setCancellationPercentage] = useState(20);
  
  const orderId = orderData.orderId || 12345;
  const items = orderData.items || '3 Shirts, 1 Bedsheet';
  const service = orderData.service || 'Steam Iron';
  const total = orderData.total || 150;
  const status = orderData.status || 'Scheduled';

  useEffect(() => {
    fetchCancellationCharges();
  }, []);

  const fetchCancellationCharges = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/order-charges');
      const data = await response.json();
      if (data.success) {
        setCancellationPercentage(data.data.cancellationPercentage);
      }
    } catch (error) {
      console.error('Error fetching cancellation charges:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 bg-background border-b border-border px-4 sm:px-6 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold ml-3 sm:ml-4">Order Confirmed</h1>
      </header>

      <div className="px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-xl" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}>
          <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-white" strokeWidth={3} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Your booking is<br />confirmed!
        </h1>
        
        <p className="text-center text-muted-foreground mb-1 text-sm sm:text-base">
          Order #{orderId} has been placed successfully.
        </p>
        <p className="text-center text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
          Pickup scheduled for {orderData.pickupType === 'now' ? 'Today' : 'Tomorrow'}, {orderData.selectedSlot || '9-11 AM'}.
        </p>

        <Card className="w-full p-4 sm:p-6 rounded-2xl border-2 mb-4 sm:mb-6">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-start gap-3">
              <span className="text-muted-foreground text-sm sm:text-base">Items:</span>
              <span className="font-semibold text-sm sm:text-base text-right">{items}</span>
            </div>
            <div className="flex justify-between items-start gap-3">
              <span className="text-muted-foreground text-sm sm:text-base">Service:</span>
              <span className="font-semibold text-sm sm:text-base">{service}</span>
            </div>
            <div className="flex justify-between items-start gap-3">
              <span className="text-muted-foreground text-sm sm:text-base">Price:</span>
              <span className="font-bold text-primary text-base sm:text-lg">₹{total}</span>
            </div>
            <div className="flex justify-between items-start gap-3">
              <span className="text-muted-foreground text-sm sm:text-base">Status:</span>
              <span className="font-semibold text-primary text-sm sm:text-base">{status}</span>
            </div>
            {orderData.discount > 0 && (
              <div className="flex justify-between items-start gap-3">
                <span className="text-muted-foreground text-sm sm:text-base">Discount:</span>
                <span className="font-semibold text-green-600 text-sm sm:text-base">-₹{orderData.discount}</span>
              </div>
            )}
            <div className="flex justify-between items-start gap-3">
              <span className="text-muted-foreground text-sm sm:text-base">Payment Method:</span>
              <span className="font-semibold text-sm sm:text-base">{orderData.customerInfo?.paymentMethods?.find((pm: any) => pm.isPrimary)?.type || 'Cash on Delivery'}</span>
            </div>
            <div className="flex justify-between items-start gap-3">
              <span className="text-muted-foreground text-sm sm:text-base">Payment Status:</span>
              <span className={`font-semibold text-sm sm:text-base ${orderData.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>
                {orderData.paymentStatus || 'Pending'}
              </span>
            </div>
          </div>
        </Card>

        <Button
          onClick={() => navigate("/order-details", { state: orderData })}
          className="w-full h-12 sm:h-14 rounded-2xl text-sm sm:text-base font-semibold mb-3 text-white shadow-lg"
          style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
        >
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Track Order
        </Button>

        <Button
          onClick={() => navigate("/home")}
          variant="outline"
          className="w-full h-12 sm:h-14 rounded-2xl text-sm sm:text-base font-semibold mb-3 border-2"
          style={{ borderColor: '#452D9B', color: '#452D9B' }}
        >
          Back to Home
        </Button>

        <Button
          onClick={() => setShowConfirmDialog(true)}
          className="w-full h-12 sm:h-14 rounded-2xl text-sm sm:text-base font-semibold mb-4 sm:mb-6 text-white shadow-lg"
          style={{ background: 'linear-gradient(to right, #ef4444, #dc2626)' }}
        >
          Cancel Order
        </Button>

        <button className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-primary transition px-4 text-center">
          <span>Invite friends & get 20% off your next order.</span>
          <Share2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
        </button>

        <button 
          onClick={() => setShowCancellationModal(true)}
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 underline mt-4"
        >
          View Cancellation Policy
        </button>
      </div>

      {/* Cancellation Policy Modal */}
      {showCancellationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg sm:text-xl font-bold">Cancellation Fees Terms</h2>
              <button onClick={() => setShowCancellationModal(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 sm:p-6 text-xs sm:text-sm space-y-4">
              <section>
                <h3 className="font-bold mb-2">1. Order Cancellation Before Pickup Assignment</h3>
                <p>If a customer cancels the order before a pickup executive has been assigned, <strong>No cancellation Fee</strong> of the total invoice amount will be charged.</p>
              </section>

              <section>
                <h3 className="font-bold mb-2">2. Order Cancellation After Pickup Assignment</h3>
                <p>Once a pickup executive has been assigned, and the customer cancels the order thereafter, a <strong>{cancellationPercentage}% cancellation fee</strong> of the total invoice amount will be charged.</p>
                <p className="mt-2 text-blue-600 font-semibold">Example: For an order of ₹{total}, the cancellation charge would be ₹{Math.round((total * cancellationPercentage) / 100)}</p>
              </section>

              <section>
                <h3 className="font-bold mb-2">3. Delivery Attempts</h3>
                <p className="mb-2">Urban Steam will make two (2) delivery attempts — one physical attempt and one attempt via phone call — to deliver the order to the customer.</p>
                <p className="mb-2">If both delivery attempts fail due to customer unavailability, incorrect address details, or refusal to accept the order, the customer will be charged additional delivery fees as follows:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Minimum:</strong> ₹100</li>
                  <li><strong>Maximum:</strong> ₹250</li>
                  <li>Applicable within a <strong>5 km radius</strong> of the original delivery address, beyond this radius, delivery charges may vary.</li>
                </ul>
              </section>
            </div>
            <div className="p-4 border-t">
              <Button
                onClick={() => setShowCancellationModal(false)}
                className="w-full h-10 sm:h-12 rounded-xl text-white"
                style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <ConfirmDialog
          title="Cancel Order"
          message="Are you sure you want to cancel this order? Cancellation charges may apply."
          confirmText="Yes, Cancel"
          cancelText="No, Keep Order"
          onConfirm={async () => {
            setShowConfirmDialog(false);
            try {
              const orderRes = await fetch(`http://localhost:3000/api/orders`);
              const ordersData = await orderRes.json();
              const order = ordersData.data.find((o: any) => 
                o.orderId === `#${orderId}` || 
                o.orderId === orderId || 
                o._id === orderId ||
                o._id === orderData._id
              );
              
              if (!order) {
                setToast({ show: true, message: 'Order not found', type: 'error' });
                return;
              }
              
              console.log('Order found:', order._id);
              console.log('Order status:', order.status);
              console.log('Order total:', order.totalAmount);
              console.log('Partner assigned:', order.partnerId);
              console.log('Cancellation percentage:', cancellationPercentage);
              
              let cancellationFee = 0;
              if (order.partnerId) {
                cancellationFee = Math.round((order.totalAmount * cancellationPercentage) / 100);
                console.log('Partner assigned - Calculated fee:', cancellationFee);
              } else {
                console.log('No partner assigned - No cancellation fee');
              }
              
              const response = await fetch(`http://localhost:3000/api/orders/${order._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  status: 'cancelled',
                  cancelledAt: new Date().toISOString(),
                  cancellationReason: 'Cancelled by customer'
                })
              });
              
              if (response.ok) {
                const result = await response.json();
                const actualFee = result.cancellationFee || 0;
                const message = actualFee > 0 
                  ? `Order cancelled. Cancellation charge of ₹${actualFee} (${cancellationPercentage}% of ₹${order.totalAmount}) has been deducted from your wallet.` 
                  : 'Order cancelled successfully. No cancellation charge applied.';
                setToast({ show: true, message, type: actualFee > 0 ? 'warning' : 'success' });
                setTimeout(() => navigate('/home'), 4000);
              } else {
                setToast({ show: true, message: 'Failed to cancel order. Please try again.', type: 'error' });
              }
            } catch (error) {
              console.error('Error cancelling order:', error);
              setToast({ show: true, message: 'Failed to cancel order. Please try again.', type: 'error' });
            }
          }}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={5000}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}
    </div>
  );
};

export default BookingConfirmation;
