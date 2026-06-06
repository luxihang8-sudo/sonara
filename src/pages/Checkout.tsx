import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const total = (cartTotal * 1.08).toFixed(2);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      clearCart();
      navigate('/');
    }, 3000);
  };

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 text-center">
        <h2 className="text-2xl text-white font-bold mb-4">No items to checkout</h2>
        <button onClick={() => navigate('/discover')} className="text-[#BAFF39] uppercase tracking-widest font-mono text-sm hover:underline">Return to Catalog</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12 lg:px-24 max-w-[1000px] mx-auto">
      <button onClick={() => navigate('/cart')} className="inline-flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors mb-12 group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="uppercase tracking-widest text-xs font-semibold">Back to Cart</span>
      </button>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 border border-[#BAFF39]/30 p-12 rounded-2xl text-center flex flex-col items-center max-w-xl mx-auto shadow-[0_0_50px_rgba(186,255,57,0.1)]"
          >
            <CheckCircle2 size={64} className="text-[#BAFF39] mb-6" />
            <h2 className="text-3xl font-black uppercase text-white mb-4">Payment Successful</h2>
            <p className="text-neutral-400 font-light mb-8">
              Thank you for your order! Your payment of ${total} has been processed. You will be redirected shortly.
            </p>
            <div className="w-8 h-8 border-2 border-[#BAFF39] border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        ) : (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900 border border-white/10 p-8 md:p-12 rounded-3xl"
          >
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/10">
              <span className="w-10 h-px bg-[#BAFF39]"></span>
              <h1 className="text-2xl font-bold uppercase tracking-widest text-white">Payment Details</h1>
            </div>

            <form onSubmit={handlePay} className="space-y-6 max-w-2xl mx-auto">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">Cardholder Name</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-neutral-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#BAFF39] transition-colors" 
                  placeholder="Jane Doe" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">Card Number</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-neutral-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#BAFF39] transition-colors font-mono" 
                  placeholder="0000 0000 0000 0000" 
                  maxLength={19}
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">Expiry Date</label>
                  <input 
                    type="text" 
                    className="w-full bg-black border border-neutral-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#BAFF39] transition-colors font-mono" 
                    placeholder="MM/YY" 
                    maxLength={5}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">CVC</label>
                  <input 
                    type="text" 
                    className="w-full bg-black border border-neutral-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#BAFF39] transition-colors font-mono" 
                    placeholder="123" 
                    maxLength={4}
                    required 
                  />
                </div>
              </div>
              
              <div className="pt-6 mt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-lg text-neutral-300 font-mono tracking-widest uppercase">Pay Total</span>
                <span className="text-2xl font-black text-white font-mono">${total}</span>
              </div>

              <button 
                type="submit"
                className="w-full mt-4 py-4 bg-[#BAFF39] text-black font-bold uppercase tracking-wider rounded-lg hover:bg-[#a6ec27] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(186,255,57,0.15)]"
              >
                Confirm Payment
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
