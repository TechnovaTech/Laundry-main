import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart, Home as HomeIcon, Tag, RotateCcw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_URL } from '@/config/api';
import BottomNavigation from "@/components/BottomNavigation";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      setCartItems(items);
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(items.map((item: CartItem) => item.category))];
      setCategories(uniqueCategories);
    }
  };

  const updateQuantity = (id: string, increment: boolean) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = increment ? item.quantity + 1 : Math.max(0, item.quantity - 1);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0);

    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const getFilteredItems = () => {
    if (selectedCategory === 'All') return cartItems;
    return cartItems.filter(item => item.category === selectedCategory);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-gray-50 page-with-bottom-nav">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#452D9B', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#07C8D0', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>

      {/* Header */}
      <header className="bg-white px-4 sm:px-6 flex items-center justify-between shadow-sm gradient-header-safe" style={{ paddingBottom: '1rem' }}>
        <button onClick={() => navigate(-1)} className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-black flex-1 text-center mx-4">
          My Cart ({getTotalItems()})
        </h1>
        {cartItems.length > 0 && (
          <button onClick={clearCart} className="flex-shrink-0 text-red-500">
            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </header>

      <div className="px-4 sm:px-6 py-4 sm:py-6">
        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 text-center mb-6">Add items from our services to get started</p>
            <Button
              onClick={() => navigate('/booking')}
              className="bg-gradient-to-r from-[#452D9B] to-[#07C8D0] hover:from-[#3a2682] hover:to-[#06b3bb] text-white rounded-2xl px-8 py-3 font-semibold"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-2xl font-semibold whitespace-nowrap text-sm flex-shrink-0 ${
                      selectedCategory === category
                        ? 'text-white shadow-md'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    style={selectedCategory === category ? { background: 'linear-gradient(to right, #452D9B, #07C8D0)' } : {}}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-black text-base">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                      <p className="font-bold text-lg" style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, false)}
                          className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold shadow-md"
                          style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold text-black">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, true)}
                          className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold shadow-md"
                          style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)' }}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 mb-6">
              <h3 className="font-bold text-lg mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span className="font-semibold">{getTotalItems()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{getTotalPrice()}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span style={{ background: 'linear-gradient(to right, #452D9B, #07C8D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ₹{getTotalPrice()}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={() => navigate('/continue-booking', { state: { cartItems, totalAmount: getTotalPrice() } })}
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-[#452D9B] to-[#07C8D0] hover:from-[#3a2682] hover:to-[#06b3bb] text-white rounded-2xl text-base font-semibold shadow-lg"
            >
              Proceed to Checkout - ₹{getTotalPrice()}
            </Button>
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Cart;