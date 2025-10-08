import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Share2, Home as HomeIcon, Tag, ShoppingCart, RotateCcw, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Wallet = () => {
  const navigate = useNavigate();
  const [redeemPoints, setRedeemPoints] = useState(0);

  const [walletData, setWalletData] = useState({
    availableBalance: "₹250",
    points: 500,
    redeemRate: "₹50"
  });

  const [walletHistory, setWalletHistory] = useState([
    {
      id: 1,
      title: "Steam Iron Order #12345",
      subtitle: "Redeemed 200 points",
      amount: "-₹100",
      type: "debit",
      date: "2024-01-15",
      status: "completed"
    },
    {
      id: 2,
      title: "Laundry Service Order #54321",
      subtitle: "Redeemed 150 points",
      amount: "+₹200",
      type: "credit",
      date: "2024-01-10",
      status: "completed"
    },
    {
      id: 3,
      title: "Dry Cleaning Order #67890",
      subtitle: "Redeemed 300 points",
      amount: "-₹150",
      type: "debit",
      date: "2024-01-05",
      status: "completed"
    },
    {
      id: 4,
      title: "Referral Bonus",
      subtitle: "Friend joined using your code",
      amount: "+₹50",
      type: "credit",
      date: "2024-01-01"
    },
    {
      id: 5,
      title: "Wash & Fold Order #45678",
      subtitle: "Redeemed 100 points",
      amount: "-₹75",
      type: "debit",
      date: "2023-12-28",
      status: "completed"
    }
  ]);

  const handleUsePoints = () => {
    if (walletData.points >= 100) {
      setWalletData(prev => ({
        ...prev,
        points: prev.points - 100,
        availableBalance: `₹${parseInt(prev.availableBalance.slice(1)) + 50}`
      }));
      
      const newTransaction = {
        id: Date.now(),
        title: `Points Redeemed #${Math.floor(Math.random() * 10000)}`,
        subtitle: "Redeemed 100 points",
        amount: "+₹50",
        type: "credit",
        date: new Date().toISOString().split('T')[0]
      };
      
      setWalletHistory(prev => [newTransaction, ...prev]);
    }
  };

  const handleRedeemNow = () => {
    handleUsePoints();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-24">
      <header className="bg-gray-50 px-4 sm:px-6 py-4 flex items-center">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold ml-4 text-black">Wallet</h1>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CreditCard className="w-6 h-6 text-blue-500" />
            <span className="text-lg sm:text-xl font-bold text-black">Available Balance:</span>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-black mb-2">{walletData.availableBalance}</p>
          <p className="text-gray-500 mb-4 text-sm sm:text-base">You have {walletData.points} points</p>
          <Button 
            onClick={handleUsePoints}
            disabled={walletData.points < 100}
            className="w-full h-12 sm:h-14 rounded-2xl font-semibold bg-blue-500 hover:bg-blue-600 text-white text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Use Points {walletData.points < 100 ? '(Insufficient Points)' : ''}
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-black">Redeem Points</h2>
          <div className="mb-4">
            <div className="relative mb-4">
              <input
                type="range"
                min="0"
                max={walletData.points}
                value={redeemPoints}
                onChange={(e) => setRedeemPoints(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(redeemPoints / walletData.points) * 100}%, #e5e7eb ${(redeemPoints / walletData.points) * 100}%, #e5e7eb 100%)`
                }}
              />
              <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                  appearance: none;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background: #3b82f6;
                  cursor: pointer;
                }
                input[type="range"]::-moz-range-thumb {
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background: #3b82f6;
                  cursor: pointer;
                  border: none;
                }
              `}</style>
            </div>
            <p className="text-center text-gray-600 mb-4 text-sm sm:text-base">{redeemPoints} Points = ₹{Math.floor(redeemPoints / 2)}</p>
          </div>
          <Button 
            onClick={() => {
              if (walletData.points >= redeemPoints && redeemPoints > 0) {
                const cashValue = Math.floor(redeemPoints / 2);
                setWalletData(prev => ({
                  ...prev,
                  points: prev.points - redeemPoints,
                  availableBalance: `₹${parseInt(prev.availableBalance.slice(1)) + cashValue}`
                }));
                
                const newTransaction = {
                  id: Date.now(),
                  title: `Points Redeemed #${Math.floor(Math.random() * 10000)}`,
                  subtitle: `Redeemed ${redeemPoints} points`,
                  amount: `+₹${cashValue}`,
                  type: "credit",
                  date: new Date().toISOString().split('T')[0]
                };
                
                setWalletHistory(prev => [newTransaction, ...prev]);
                setRedeemPoints(0);
              }
            }}
            disabled={redeemPoints === 0 || walletData.points < redeemPoints}
            className="w-full h-12 sm:h-14 rounded-2xl font-semibold bg-blue-500 hover:bg-blue-600 text-white text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Redeem Now {redeemPoints === 0 || walletData.points < redeemPoints ? '(Select Points)' : ''}
          </Button>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-black">Wallet History</h2>
          <div className="space-y-3">
            {walletHistory.map((transaction) => {
              const isOrderTransaction = transaction.title.includes('Order #');
              const orderId = isOrderTransaction ? transaction.title.match(/#(\d+)/)?.[1] : null;
              
              const TransactionComponent = isOrderTransaction ? 'button' : 'div';
              
              return (
                <TransactionComponent 
                  key={transaction.id} 
                  className={`w-full bg-white rounded-2xl p-4 sm:p-6 shadow-lg ${
                    isOrderTransaction ? 'hover:bg-gray-50 cursor-pointer transition-colors' : ''
                  }`}
                  onClick={isOrderTransaction && orderId ? () => navigate(`/rate-order/${orderId}`) : undefined}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-bold text-black text-sm sm:text-base truncate text-left">{transaction.title}</p>
                      <p className="text-sm text-gray-500 text-left">{transaction.subtitle}</p>
                    </div>
                    <span className={`font-bold text-lg sm:text-xl flex-shrink-0 ${
                      transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.amount}
                    </span>
                  </div>
                </TransactionComponent>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg flex items-center justify-between gap-4">
          <p className="text-black text-sm sm:text-base flex-1">Earn 50 points for every friend you invite.</p>
          <button className="text-blue-500 flex-shrink-0">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white px-2 sm:px-4 py-2 sm:py-4 flex items-center justify-around shadow-2xl">
        <button onClick={() => navigate("/")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <HomeIcon className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button onClick={() => navigate("/prices")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <Tag className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gray-300 flex items-center justify-center border-2 border-white shadow-lg">
            <ShoppingCart className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
          </div>
        </button>
        <button onClick={() => navigate("/booking-history")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <RotateCcw className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-blue-500 p-1">
          <User className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
      </nav>
    </div>
  );
};

export default Wallet;