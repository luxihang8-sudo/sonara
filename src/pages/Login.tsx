import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/register - route to profile for demonstration
    navigate('/profile');
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12 flex items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#BAFF39]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900 border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden group"
        >
          {/* Subtle Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#BAFF39]/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-700 group-hover:bg-[#BAFF39]/20" />

          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-1.5 mb-6 group select-none">
              <span className="text-3xl font-black lowercase tracking-tighter text-[#BAFF39]">sonara</span>
              <span className="w-2 h-2 bg-[#BAFF39] rounded-full group-hover:scale-150 transition-transform"></span>
            </Link>
            <h1 className="text-2xl font-bold uppercase tracking-widest text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-neutral-400 text-sm font-light">
              {isLogin ? 'Enter your details to access your account' : 'Join to manage your collection and alerts'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name-input"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                      <User size={16} />
                    </div>
                    <input 
                      type="text" 
                      className="w-full bg-black border border-neutral-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#BAFF39] transition-colors" 
                      placeholder="Jane Doe" 
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                  <Mail size={16} />
                </div>
                <input 
                  type="email" 
                  className="w-full bg-black border border-neutral-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#BAFF39] transition-colors" 
                  placeholder="name@example.com" 
                  required 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500">Password</label>
                {isLogin && (
                  <a href="#" className="text-[10px] text-[#BAFF39] uppercase font-mono hover:underline">Forgot?</a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  className="w-full bg-black border border-neutral-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#BAFF39] transition-colors" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full mt-8 py-4 bg-[#BAFF39] text-black font-bold uppercase tracking-wider rounded-lg hover:bg-[#a6ec27] transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(186,255,57,0.15)] hover:shadow-[0_0_25px_rgba(186,255,57,0.3)]"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-neutral-400 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-white font-bold hover:text-[#BAFF39] transition-colors"
              >
                {isLogin ? 'Register now' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
