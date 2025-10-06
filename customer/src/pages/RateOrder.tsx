import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Shirt, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const RateOrder = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  // Mock order data - in real app, fetch based on orderId
  const orderData = {
    id: orderId || "12345",
    items: "3 Shirts, 1 Bedsheet",
    status: "Delivered",
    deliveryDate: "16 Sep, 6:20 PM",
    amount: "₹150"
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleSubmitRating = () => {
    // In real app, submit rating to backend
    console.log("Rating submitted:", { orderId, rating, feedback });
    navigate(-1);
  };

  const handleSkip = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-gray-50 px-4 sm:px-6 py-4 flex items-center">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold ml-4 text-black">Rate Your Order</h1>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Order Details */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shirt className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-black mb-1">Order #{orderData.id}</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-1">{orderData.items} - {orderData.status}</p>
              <p className="text-xs sm:text-sm text-gray-500">on {orderData.deliveryDate}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-lg sm:text-xl font-bold text-blue-500">{orderData.amount}</p>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg text-center">
          <h3 className="text-lg sm:text-xl font-bold text-black mb-6">How was your experience?</h3>
          
          {/* Star Rating */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className="transition-all duration-200 hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 sm:w-10 sm:h-10 ${
                    star <= rating
                      ? "fill-blue-500 text-blue-500"
                      : "text-gray-300 hover:text-blue-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Rating Label */}
          {rating > 0 && (
            <p className="text-sm sm:text-base font-semibold text-gray-600 mb-6 uppercase tracking-wide">
              {ratingLabels[rating]}
            </p>
          )}

          {/* Feedback Textarea */}
          <div className="mb-6">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback (optional)..."
              className="w-full h-24 sm:h-32 p-4 border-2 border-blue-200 rounded-2xl resize-none focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              maxLength={500}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleSubmitRating}
              disabled={rating === 0}
              className="w-full h-12 sm:h-14 rounded-2xl font-semibold bg-blue-500 hover:bg-blue-600 text-white text-base disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Submit Rating
            </Button>
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full h-10 sm:h-12 rounded-2xl font-semibold text-blue-500 hover:bg-blue-50 text-base"
            >
              Skip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateOrder;