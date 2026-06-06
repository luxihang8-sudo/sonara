import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, CreditCard, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12 lg:px-24 max-w-[1200px] mx-auto rounded-xl">
      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-8">
        Your Cart
      </h1>

      {items.length === 0 ? (
        <div className="bg-neutral-900 border border-white/5 p-12 rounded-2xl text-center">
          <p className="text-neutral-400 font-light mb-6">Your cart is currently empty.</p>
          <Link
            to="/discover"
            className="inline-flex items-center space-x-2 px-8 py-3 bg-[#BAFF39] text-black font-bold uppercase tracking-wider rounded-full hover:bg-white transition-colors"
          >
            <span>Continue Exploring</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-6 p-4 rounded-xl border border-white/10 bg-neutral-900 group"
              >
                <Link to={`/album/${item.track.id}`}>
                  <img
                    src={item.coverUrl}
                    alt={item.track.title}
                    className="w-24 h-24 object-cover rounded-md shadow-md"
                  />
                </Link>

                <div className="flex-1">
                  <Link to={`/album/${item.track.id}`} className="block">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#BAFF39] transition-colors line-clamp-1">
                      {item.track.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-neutral-500 uppercase tracking-widest font-mono line-clamp-1">
                    {item.track.artist}
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-white/10 text-neutral-300">
                    {item.format}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="text-lg font-mono font-bold text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-white/20 rounded-full bg-black">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-4 text-center font-mono text-sm text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary Checkout Bar */}
          <div className="lg:col-span-4">
            <div className="p-6 md:p-8 bg-neutral-900 border border-white/10 rounded-2xl sticky top-32">
              <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 font-mono text-sm">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Estimated Tax</span>
                  <span>${(cartTotal * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mb-8 flex justify-between items-center text-lg md:text-xl font-bold font-mono text-white">
                <span>Total</span>
                <span>${(cartTotal * 1.08).toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#BAFF39] text-black font-bold uppercase tracking-wider rounded-xl hover:bg-[#a6ec27] transition-all shadow-[0_0_20px_rgba(186,255,57,0.15)] hover:shadow-[0_0_25px_rgba(186,255,57,0.3)] mb-4"
              >
                <span>Checkout</span>
                <ArrowRight size={18} />
              </button>

              <div className="flex justify-center items-center gap-4 text-neutral-500 font-mono text-xs">
                <span className="flex items-center gap-1.5 border border-white/5 py-1 px-2 rounded">
                  <CreditCard size={14} />
                  Secure
                </span>
                <span className="border border-white/5 py-1 px-2 rounded tracking-widest">
                  SSL Encrypted
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
