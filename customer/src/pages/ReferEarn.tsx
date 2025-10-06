import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, ShoppingCart, Wallet, Share2, Copy, Home as HomeIcon, Tag, RotateCcw, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const ReferEarn = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const referralData = {
    userCode: "SAG123",
    pointsEarned: 500,
    pendingRewards: 2
  };

  const pastReferrals = [
    {
      id: 1,
      name: "Alice Johnson",
      status: "completed",
      points: 100,
      joinedDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Bob Smith",
      status: "pending",
      points: 0,
      joinedDate: "2024-01-20"
    }
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralData.userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on this amazing laundry service!',
        text: `Use my referral code ${referralData.userCode} and get amazing rewards!`,
        url: window.location.origin
      });
    } else {
      handleCopyCode();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-gray-50 px-4 sm:px-6 py-4 flex items-center">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold ml-4 text-black">Refer & Earn</h1>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden min-h-[140px] sm:min-h-[160px]">
          <div className="relative z-10 max-w-[60%] sm:max-w-[70%]">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 leading-tight">Invite friends, earn rewards!</h2>
            <p className="text-blue-100 text-xs sm:text-sm lg:text-base leading-relaxed">Get 100 points when your friend places their first order.</p>
          </div>
          
          {/* Background illustration */}
          <div className="absolute right-2 sm:right-4 top-4 bottom-4 w-24 sm:w-32 lg:w-40 opacity-20">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              {/* Person 1 */}
              <circle cx="30" cy="25" r="8" fill="white" />
              <rect x="22" y="33" width="16" height="20" rx="8" fill="white" />
              <rect x="26" y="53" width="3" height="15" fill="white" />
              <rect x="31" y="53" width="3" height="15" fill="white" />
              
              {/* Person 2 */}
              <circle cx="90" cy="25" r="8" fill="white" />
              <rect x="82" y="33" width="16" height="20" rx="8" fill="white" />
              <rect x="86" y="53" width="3" height="15" fill="white" />
              <rect x="91" y="53" width="3" height="15" fill="white" />
              
              {/* Connection line */}
              <line x1="38" y1="35" x2="82" y2="35" stroke="white" strokeWidth="2" strokeDasharray="3,3" />
              
              {/* Gift box */}
              <rect x="55" y="75" width="12" height="10" fill="white" />
              <rect x="55" y="75" width="12" height="3" fill="white" opacity="0.7" />
              <line x1="61" y1="75" x2="61" y2="85" stroke="white" strokeWidth="2" />
              <line x1="55" y1="78" x2="67" y2="78" stroke="white" strokeWidth="2" />
              
              {/* Money symbols */}
              <text x="45" y="100" fill="white" fontSize="12" fontWeight="bold">₹</text>
              <text x="70" y="95" fill="white" fontSize="10" fontWeight="bold">₹</text>
            </svg>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute right-0 top-0 w-20 sm:w-32 h-20 sm:h-32 bg-white bg-opacity-5 rounded-full -mr-10 sm:-mr-16 -mt-10 sm:-mt-16"></div>
          <div className="absolute right-4 sm:right-8 bottom-0 w-12 sm:w-20 h-12 sm:h-20 bg-white bg-opacity-5 rounded-full -mb-6 sm:-mb-10"></div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg text-center">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-4">Your Code: {referralData.userCode}</h3>
          <div className="flex gap-2 sm:gap-3">
            <Button 
              onClick={handleCopyCode}
              variant="outline"
              className="flex-1 h-10 sm:h-12 rounded-2xl font-semibold border-2 border-blue-500 text-blue-500 hover:bg-blue-50 text-sm sm:text-base"
            >
              <Copy className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">{copied ? 'Copied!' : 'Copy Code'}</span>
              <span className="xs:hidden">{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
            <Button 
              onClick={handleShareCode}
              className="flex-1 h-10 sm:h-12 rounded-2xl font-semibold bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Share Code</span>
              <span className="xs:hidden">Share</span>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
          <h3 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">How it works</h3>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-black leading-tight">Invite Friends</p>
            </div>
            <div className="w-4 sm:w-8 h-0.5 bg-gray-300 mx-1 sm:mx-2"></div>
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-black leading-tight">Friend Orders</p>
            </div>
            <div className="w-4 sm:w-8 h-0.5 bg-gray-300 mx-1 sm:mx-2"></div>
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-black leading-tight">You Earn</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
          <h3 className="text-lg sm:text-xl font-bold text-black mb-4">Your Rewards</h3>
          <div className="space-y-2 sm:space-y-3">
            <div>
              <p className="text-blue-500 font-bold text-base sm:text-lg">Points Earned: {referralData.pointsEarned}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm sm:text-base">Pending Rewards: {referralData.pendingRewards} invites not yet completed.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
          <h3 className="text-lg sm:text-xl font-bold text-black mb-4">Past Referrals</h3>
          <div className="space-y-3 sm:space-y-4">
            {pastReferrals.map((referral) => (
              <div key={referral.id} className="flex items-start sm:items-center justify-between py-2 gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-black text-sm sm:text-base truncate">{referral.name}</p>
                  {referral.status === 'completed' && (
                    <p className="text-xs sm:text-sm text-blue-500">Joined - Earned {referral.points} Points</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  {referral.status === 'completed' ? (
                    <span className="text-blue-500 font-semibold text-xs sm:text-sm">Earned {referral.points} Points</span>
                  ) : (
                    <span className="text-gray-500 font-semibold text-xs sm:text-sm">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white px-4 sm:px-6 py-4 flex items-center justify-around shadow-2xl max-w-4xl mx-auto">
        <button onClick={() => navigate("/")} className="flex flex-col items-center gap-1 text-gray-400">
          <HomeIcon className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
        <button onClick={() => navigate("/prices")} className="flex flex-col items-center gap-1 text-gray-400">
          <Tag className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 flex items-center justify-center border-2 border-white shadow-lg">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </div>
        </button>
        <button onClick={() => navigate("/booking-history")} className="flex flex-col items-center gap-1 text-gray-400">
          <RotateCcw className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
        <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-1 text-blue-500">
          <User className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </nav>
    </div>
  );
};

export default ReferEarn;