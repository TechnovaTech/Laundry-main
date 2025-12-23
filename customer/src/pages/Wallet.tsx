import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Share2, Home as HomeIcon, Tag, ShoppingCart, RotateCcw, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_URL } from '@/config/api';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { fetchWithCache, parallelFetch } from '@/utils/apiOptimizer';

const Wallet = () => {
  const navigate = useNavigate();
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [pointsPerRupee, setPointsPerRupee] = useState(2);
  const [minRedeemPoints, setMinRedeemPoints] = useState(100);
  const [referralPoints, setReferralPoints] = useState(50);

  const [walletData, setWalletData] = useState({
    availableBalance: 0,
    points: 0,
    dueAmount: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    loadAllData();

    // Handle hardware back button
    if (Capacitor.isNativePlatform()) {
      const handleBackButton = App.addListener('backButton', () => {
        navigate('/home');
      });
      
      return () => {
        handleBackButton.remove();
      };
    }
  }, [navigate]);

  const loadAllData = async (forceRefresh = false) => {
    if (forceRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    
    try {
      await parallelFetch([
        fetchWalletSettings(forceRefresh),
        fetchCustomerWallet(forceRefresh),
        fetchWalletTransactions(forceRefresh)
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchCustomerWallet = async (forceRefresh = false) => {
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) return;
      
      const fetcher = async () => {
        const response = await fetch(`${API_URL}/api/mobile/profile?customerId=${customerId}`);
        const data = await response.json();
        return data;
      };
      
      let data;
      if (forceRefresh) {
        data = await fetcher();
      } else {
        try {
          data = await fetchWithCache(`wallet_${customerId}`, fetcher, 60000);
        } catch (cacheError) {
          // Clear cache if quota exceeded and fetch directly
          localStorage.removeItem(`wallet_${customerId}`);
          data = await fetcher();
        }
      }
      
      if (data.success && data.data) {
        setWalletData({
          availableBalance: data.data.walletBalance || 0,
          points: data.data.loyaltyPoints || 0,
          dueAmount: data.data.dueAmount || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    }
  };

  const fetchWalletSettings = async (forceRefresh = false) => {
    try {
      const fetcher = async () => {
        const response = await fetch(`${API_URL}/api/wallet-settings`);
        return await response.json();
      };
      
      const data = forceRefresh
        ? await fetcher()
        : await fetchWithCache('wallet_settings', fetcher, 300000);
      
      if (data.success) {
        setPointsPerRupee(data.data.pointsPerRupee);
        setMinRedeemPoints(data.data.minRedeemPoints);
        setReferralPoints(data.data.referralPoints);
      }
    } catch (error) {
      console.error('Failed to fetch wallet settings:', error);
    }
  };

  const [walletHistory, setWalletHistory] = useState([]);
  const [dueCharges, setDueCharges] = useState([]);

  const fetchWalletTransactions = async (forceRefresh = false) => {
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) return;
      
      const fetcher = async () => {
        const response = await fetch(`${API_URL}/api/wallet-transactions?customerId=${customerId}`);
        return await response.json();
      };
      
      let data;
      if (forceRefresh) {
        data = await fetcher();
      } else {
        try {
          data = await fetchWithCache(`transactions_${customerId}`, fetcher, 60000);
        } catch (cacheError) {
          // Clear cache if quota exceeded and fetch directly
          localStorage.removeItem(`transactions_${customerId}`);
          data = await fetcher();
        }
      }
      
      if (data.success && data.data) {
        const formattedTransactions = data.data.map((t: any) => ({
          id: t._id,
          title: `${t.type === 'balance' ? 'Balance' : 'Points'} ${t.action === 'increase' ? 'Added' : 'Deducted'}`,
          subtitle: t.reason,
          amount: `${t.action === 'increase' ? '+' : '-'}${t.type === 'balance' ? '₹' : ''}${t.amount}${t.type === 'points' ? ' pts' : ''}`,
          type: t.action === 'increase' ? 'credit' : 'debit',
          date: new Date(t.createdAt).toLocaleDateString(),
          rawReason: t.reason
        }));
        setWalletHistory(formattedTransactions);
        
        // Filter transactions that mention "added to due"
        const dueTransactions = formattedTransactions.filter((t: any) => 
          t.rawReason && t.rawReason.toLowerCase().includes('added to due')
        );
        setDueCharges(dueTransactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const handleUsePoints = async () => {
    if (walletData.points < minRedeemPoints) {
      alert(`Insufficient points! You need at least ${minRedeemPoints} points to redeem.`);
      return;
    }
    if (walletData.points >= minRedeemPoints) {
      const cashValue = Math.floor(100 / pointsPerRupee);
      const newPoints = walletData.points - 100;
      const newBalance = walletData.availableBalance + cashValue;
      
      await updateWalletInDB(newBalance, newPoints, 100, cashValue);
      
      setWalletData({
        points: newPoints,
        availableBalance: newBalance
      });
      
      fetchWalletTransactions();
    }
  };

  const updateWalletInDB = async (balance: number, points: number, pointsRedeemed: number, cashValue: number) => {
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) return;
      
      const response = await fetch(`${API_URL}/api/customers/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletBalance: balance,
          loyaltyPoints: points
        })
      });
      
      if (response.ok) {
        await fetch(`${API_URL}/api/customers/${customerId}/adjust`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'points',
            action: 'decrease',
            amount: pointsRedeemed,
            reason: `Redeemed ${pointsRedeemed} points for ₹${cashValue}`
          })
        });
        
        await fetch(`${API_URL}/api/customers/${customerId}/adjust`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'balance',
            action: 'increase',
            amount: cashValue,
            reason: `Redeemed ${pointsRedeemed} points`
          })
        });
        
        await fetchCustomerWallet();
      }
    } catch (error) {
      console.error('Failed to update wallet:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 px-4 sm:px-6 py-4 flex items-center justify-between shadow-lg gradient-header-safe">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold ml-4 text-white">Wallet</h1>
        </div>
        <button 
          onClick={() => loadAllData(true)}
          disabled={isRefreshing}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 text-white ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 sm:p-8 shadow-lg text-center border-2 border-blue-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Available Balance:</span>
          </div>
          <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent mb-2">₹{walletData.availableBalance}</p>
          <p className="text-gray-700 mb-4 text-sm sm:text-base font-medium">You have {walletData.points} points ({pointsPerRupee} points = ₹1)</p>
          <Button 
            onClick={handleUsePoints}
            disabled={walletData.points < minRedeemPoints}
            className="w-full h-12 sm:h-14 rounded-2xl font-semibold text-white text-base shadow-lg"
            style={walletData.points >= minRedeemPoints ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { background: '#9ca3af', cursor: 'not-allowed' }}
          >
            Use {minRedeemPoints} Points {walletData.points < minRedeemPoints ? `(Need ${minRedeemPoints - walletData.points} more)` : ''}
          </Button>
        </div>

        {walletData.dueAmount > 0 && (
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-red-200">
            <div className="mb-2 text-center">
              <span className="text-4xl">⚠️</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-red-600 mb-2 text-center">Pending Due Amount</h3>
            <p className="text-3xl sm:text-4xl font-bold text-red-600 mb-4 text-center">₹{walletData.dueAmount}</p>
            <p className="text-sm sm:text-base text-gray-700 font-medium text-center mb-4">
              This amount will be added to your next order payment
            </p>
            
            {dueCharges.length > 0 && (
              <div className="mt-4 pt-4 border-t-2 border-red-200">
                <h4 className="text-sm font-bold text-red-600 mb-3 text-left">Last Due Charge:</h4>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs sm:text-sm text-gray-600 break-words">{dueCharges[0].subtitle}</p>
                      <p className="text-xs text-gray-400 mt-1">{dueCharges[0].date}</p>
                    </div>
                    <span className="font-bold text-sm sm:text-base text-red-600 flex-shrink-0">
                      {dueCharges[0].amount}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-lg sm:text-xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Redeem Points</h2>
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
              <style>{`
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
            <p className="text-center text-gray-600 mb-4 text-sm sm:text-base">{redeemPoints} Points = ₹{Math.floor(redeemPoints / pointsPerRupee)}</p>
          </div>
          <Button 
            onClick={async () => {
              if (redeemPoints < minRedeemPoints) {
                alert(`Minimum ${minRedeemPoints} points required to redeem!`);
                return;
              }
              if (walletData.points >= redeemPoints && redeemPoints > 0) {
                const cashValue = Math.floor(redeemPoints / pointsPerRupee);
                const newPoints = walletData.points - redeemPoints;
                const newBalance = walletData.availableBalance + cashValue;
                
                await updateWalletInDB(newBalance, newPoints, redeemPoints, cashValue);
                
                setWalletData(prev => ({
                  ...prev,
                  points: newPoints,
                  availableBalance: newBalance
                }));
                
                fetchWalletTransactions();
                setRedeemPoints(0);
              }
            }}
            disabled={redeemPoints < minRedeemPoints || walletData.points < redeemPoints}
            className="w-full h-12 sm:h-14 rounded-2xl font-semibold text-white text-base shadow-lg"
            style={redeemPoints >= minRedeemPoints && walletData.points >= redeemPoints ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : { background: '#9ca3af', cursor: 'not-allowed' }}
          >
            Redeem Now {redeemPoints < minRedeemPoints ? `(Min ${minRedeemPoints} points)` : walletData.points < redeemPoints ? '(Insufficient)' : ''}
          </Button>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Wallet History (Last 5)</h2>
          <div className="space-y-3">
            {walletHistory.slice(0, 5).map((transaction) => {
              const isOrderTransaction = transaction.title.includes('Order #');
              const orderId = isOrderTransaction ? transaction.title.match(/#(\d+)/)?.[1] : null;
              
              const TransactionComponent = isOrderTransaction ? 'button' : 'div';
              
              return (
                <TransactionComponent 
                  key={transaction.id} 
                  className={`w-full bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow ${
                    isOrderTransaction ? 'cursor-pointer' : ''
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

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 sm:p-6 shadow-lg flex items-center justify-between gap-4 border-2 border-green-200 hover:shadow-xl transition-shadow">
          <p className="text-gray-800 text-sm sm:text-base flex-1 font-medium">Earn {referralPoints} points for every friend you invite.</p>
          <button className="bg-gradient-to-r from-blue-500 to-blue-700 p-2 rounded-full shadow-md hover:shadow-lg transition-shadow flex-shrink-0">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>

        <nav className="fixed bottom-0 left-0 right-0 bg-white px-2 sm:px-4 py-2 sm:py-4 flex items-center justify-around shadow-2xl border-t">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1 hover:text-blue-500 transition-colors">
          <HomeIcon className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button onClick={() => navigate("/prices")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1 hover:text-blue-500 transition-colors">
          <Tag className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button onClick={() => navigate("/booking")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1">
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center border-2 border-white shadow-lg hover:shadow-xl transition-shadow">
            <ShoppingCart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
        </button>
        <button onClick={() => navigate("/booking-history")} className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-400 p-1 hover:text-blue-500 transition-colors">
          <RotateCcw className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-0.5 sm:gap-1 p-1">
          <User className="w-5 h-5 sm:w-7 sm:h-7 text-blue-500" />
        </button>
        </nav>
      </div>
      )}
    </div>
  );
};

export default Wallet;