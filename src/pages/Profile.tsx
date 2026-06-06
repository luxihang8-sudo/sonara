import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Archive, Download, MapPin, Bell, Package, Heart, CreditCard, ChevronRight, Play, Disc } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TRACKS } from '../data/tracks';

const getValidCover = (url: string, trackId: string) => {
  return url;
};

// Mock Data
const SAVED_ALBUMS = TRACKS.slice(0, 4);
const WISHLIST_ITEMS = TRACKS.slice(5, 7);
const ORDER_HISTORY = [
  { id: 'ORD-89211', date: '2026-05-12', total: '$44.98', status: 'Delivered', items: 2 },
  { id: 'ORD-90124', date: '2026-06-01', total: '$14.99', status: 'Processing', items: 1 }
];
const DOWNLOAD_HISTORY = TRACKS.slice(2, 6).map(t => ({ track: t, date: '2026-05-15', format: 'FLAC 24-bit / 48kHz' }));
const ADDRESSES = [
  { id: 1, name: 'Main HQ', address: '123 Cyber Street, Sector 4', city: 'Neo-Tokyo', zip: '100-0001', isDefault: true },
  { id: 2, name: 'Studio', address: '456 Analog Avenue, Warehouse 9', city: 'Berlin', zip: '10245', isDefault: false }
];

type TabType = 'overview' | 'saved' | 'orders' | 'downloads' | 'addresses' | 'alerts';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Membership Overview', icon: <User size={18} /> },
    { id: 'saved', label: 'Saved Collection', icon: <Heart size={18} /> },
    { id: 'orders', label: 'Order Center', icon: <Package size={18} /> },
    { id: 'downloads', label: 'Download History', icon: <Download size={18} /> },
    { id: 'alerts', label: 'Wishlist & Alerts', icon: <Bell size={18} /> },
    { id: 'addresses', label: 'Shipping Addresses', icon: <MapPin size={18} /> },
  ];

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white uppercase">
          My Account
        </h1>
        <p className="text-neutral-400 font-light max-w-2xl">
          Manage your digital and physical collection, shipping details, and rare vinyl restock alerts.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 sticky top-28">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#BAFF39] to-emerald-400 flex items-center justify-center text-black text-xl font-black shadow-[0_0_20px_rgba(186,255,57,0.3)]">
                LX
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Luxihang</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#BAFF39] shadow-[0_0_8px_rgba(186,255,57,0.8)]"></span>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#BAFF39]">Pro Member</span>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white border-l-2 border-[#BAFF39]'
                      : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300 border-l-2 border-transparent'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {activeTab === tab.id && <ChevronRight size={16} className="ml-auto opacity-50" />}
                </button>
              ))}
            </nav>
            
            <button className="w-full mt-8 py-3 text-xs font-mono text-neutral-500 uppercase tracking-widest hover:text-white transition-colors border border-white/10 rounded-lg hover:bg-white/5">
              Sign Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold uppercase tracking-widest text-white mb-6">Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#BAFF39]/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[#BAFF39]/20 transition-all"></div>
                      <Archive size={24} className="text-[#BAFF39] mb-4" />
                      <div className="text-3xl font-mono text-white mb-1">12</div>
                      <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">Albums Owned</div>
                    </div>
                    <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#06B6D4]/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[#06B6D4]/20 transition-all"></div>
                      <Disc size={24} className="text-[#06B6D4] mb-4" />
                      <div className="text-3xl font-mono text-white mb-1">4</div>
                      <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">Vinyl Pre-orders</div>
                    </div>
                    <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#EC4899]/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[#EC4899]/20 transition-all"></div>
                      <CreditCard size={24} className="text-[#EC4899] mb-4" />
                      <div className="text-3xl font-mono text-white mb-1">...4021</div>
                      <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">Default Payment</div>
                    </div>
                  </div>
                  
                  <div className="bg-[#BAFF39]/10 border border-[#BAFF39]/20 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h3 className="text-[#BAFF39] font-bold text-lg mb-2">Upgrade to Audiophile Tier</h3>
                      <p className="text-neutral-300 text-sm max-w-lg leading-relaxed">
                        Get priority access to limited edition vinyl represses, lossless 32-bit audio downloads, and free global shipping on all physical orders.
                      </p>
                    </div>
                    <button className="px-6 py-3 bg-[#BAFF39] text-black font-bold uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(186,255,57,0.2)] hover:scale-105 transition-transform shrink-0 whitespace-nowrap">
                      Upgrade - $9.99/mo
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'saved' && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Saved Collection</h2>
                    <span className="text-sm font-mono text-neutral-500">{SAVED_ALBUMS.length} Items</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {SAVED_ALBUMS.map((track, i) => {
                      const cover = getValidCover(track.coverUrl, track.id);
                      return (
                        <div key={i} className="group relative">
                          <Link to={`/album/${track.id}?cover=${encodeURIComponent(cover)}`} className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-neutral-900 border border-white/5 block">
                            <img 
                              src={cover} 
                              alt={track.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-white/20 text-white backdrop-blur-sm flex items-center justify-center hover:bg-[#BAFF39] hover:text-black transition-colors">
                                <Play fill="currentColor" size={20} className="ml-1" />
                              </div>
                            </div>
                          </Link>
                          <Link to={`/album/${track.id}?cover=${encodeURIComponent(cover)}`} className="block">
                            <h3 className="text-sm font-bold tracking-tight text-white group-hover:text-[#BAFF39] transition-colors truncate">
                              {track.title}
                            </h3>
                            <p className="text-xs font-medium text-neutral-400 mt-1 uppercase tracking-wider truncate">
                              {track.artist}
                            </p>
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-widest text-white mb-8">Order Center</h2>
                  
                  <div className="space-y-4">
                    {ORDER_HISTORY.map((order, i) => (
                      <div key={i} className="bg-neutral-900 border border-white/5 p-6 rounded-xl hover:border-white/20 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center text-neutral-400">
                            <Package size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-white font-mono font-bold tracking-wider">{order.id}</h3>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                                order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#06B6D4]/20 text-[#06B6D4]'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs font-mono text-neutral-500">{order.date} • {order.items} Items</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-8 border-t border-white/5 md:border-none pt-4 md:pt-0">
                          <div className="text-right">
                            <div className="text-xs font-mono uppercase text-neutral-500 mb-1">Total</div>
                            <div className="font-mono text-white text-lg">{order.total}</div>
                          </div>
                          <button className="px-4 py-2 border border-white/10 rounded uppercase text-xs font-bold tracking-widest hover:border-white/30 hover:bg-white/5 transition-colors text-white">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'downloads' && (
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-widest text-white mb-8">Download History</h2>
                  
                  <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-black/40 text-xs font-mono uppercase tracking-widest text-neutral-500 hidden md:grid">
                      <div className="col-span-1"></div>
                      <div className="col-span-5">Release</div>
                      <div className="col-span-3">Format</div>
                      <div className="col-span-2">Date</div>
                      <div className="col-span-1 text-right">Action</div>
                    </div>
                    
                    <div className="divide-y divide-white/5">
                      {DOWNLOAD_HISTORY.map((item, i) => {
                        const cover = getValidCover(item.track.coverUrl, item.track.id);
                        return (
                          <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:items-center hover:bg-white/5 transition-colors group">
                            <div className="col-span-1 hidden md:block">
                              <img src={cover} alt={item.track.title} className="w-10 h-10 rounded object-cover" />
                            </div>
                            <div className="col-span-5">
                              <div className="flex items-center gap-3 md:hidden mb-2">
                                <img src={cover} alt={item.track.title} className="w-10 h-10 rounded object-cover" />
                                <div>
                                  <h4 className="text-sm font-bold text-white leading-none">{item.track.title}</h4>
                                  <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">{item.track.artist}</p>
                                </div>
                              </div>
                              <div className="hidden md:block">
                                <h4 className="text-sm font-bold text-white transition-colors group-hover:text-[#BAFF39]">{item.track.title}</h4>
                                <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-widest">{item.track.artist}</p>
                              </div>
                            </div>
                            <div className="col-span-3 text-xs font-mono text-neutral-400">
                              <span className="md:hidden text-neutral-600 mr-2">Format:</span>
                              {item.format}
                            </div>
                            <div className="col-span-2 text-xs font-mono text-neutral-400">
                              <span className="md:hidden text-neutral-600 mr-2">Date:</span>
                              {item.date}
                            </div>
                            <div className="col-span-1 md:text-right mt-2 md:mt-0">
                              <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#BAFF39] hover:text-black transition-colors" title="Download Again">
                                <Download size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'alerts' && (
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-widest text-white mb-4">Vinyl Wishlist & Alerts</h2>
                  <p className="text-neutral-400 text-sm max-w-2xl mb-8 leading-relaxed">
                    Products listed here are currently out of stock or rare limited pressings. You'll receive priority email notifications the moment they are restocked or available via resale.
                  </p>
                  
                  <div className="space-y-4">
                    {WISHLIST_ITEMS.map((track, i) => {
                      const cover = getValidCover(track.coverUrl, track.id);
                      return (
                        <div key={i} className="bg-neutral-900 border border-white/5 p-4 md:p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group hover:border-[#BAFF39]/30 transition-colors">
                          <div className="absolute top-0 left-0 w-1 h-full bg-[#BAFF39] shadow-[0_0_10px_rgba(186,255,57,0.5)]"></div>
                          
                          <div className="flex gap-4 md:gap-6 items-center">
                            <Link to={`/album/${track.id}?cover=${encodeURIComponent(cover)}`}>
                              <img src={cover} alt={track.title} className="w-16 h-16 md:w-20 md:h-20 rounded-md object-cover border border-white/10" />
                            </Link>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <Link to={`/album/${track.id}?cover=${encodeURIComponent(cover)}`} className="text-white font-bold hover:text-[#BAFF39] transition-colors line-clamp-1">
                                  {track.title}
                                </Link>
                                <span className="px-2 py-0.5 rounded text-[9px] bg-red-500/20 text-red-400 uppercase tracking-widest font-black border border-red-500/20 shrink-0">
                                  Out of Stock
                                </span>
                              </div>
                              <p className="text-xs text-neutral-400 uppercase tracking-widest line-clamp-1">{track.artist}</p>
                              
                              <div className="flex items-center gap-2 mt-3 text-[10px] uppercase font-mono text-neutral-500">
                                <Disc size={12} />
                                <span>12" Limited Edition Vinyl</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex-1 md:flex-none border border-[#BAFF39]/30 bg-[#BAFF39]/5 rounded-lg p-3 flex items-center justify-center gap-2">
                              <Bell size={14} className="text-[#BAFF39]" />
                              <span className="text-xs text-[#BAFF39] font-bold uppercase tracking-widest">Alert Active</span>
                            </div>
                            <button className="text-neutral-500 hover:text-white transition-colors underline text-xs font-mono uppercase tracking-widest">
                              Remove
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Shipping Addresses</h2>
                    <button className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors self-start sm:self-auto">
                      + Add New Address
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ADDRESSES.map((address) => (
                      <div key={address.id} className="relative bg-neutral-900 border border-white/5 p-6 rounded-xl group hover:border-white/20 transition-colors">
                        {address.isDefault && (
                          <div className="absolute -top-2 -right-2 bg-[#BAFF39] text-black text-[9px] uppercase tracking-widest font-black px-2 py-1 rounded shadow-[0_0_10px_rgba(186,255,57,0.3)]">
                            Default
                          </div>
                        )}
                        <h3 className="text-white font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                          <MapPin size={16} className="text-neutral-500" />
                          {address.name}
                        </h3>
                        <div className="space-y-1 text-sm text-neutral-400 font-light leading-relaxed mb-6">
                          <p>{address.address}</p>
                          <p>{address.city}, {address.zip}</p>
                        </div>
                        <div className="flex gap-4">
                          <button className="text-xs font-mono text-neutral-500 hover:text-white uppercase transition-colors">Edit</button>
                          <button className="text-xs font-mono text-red-500/70 hover:text-red-400 uppercase transition-colors">Remove</button>
                          {!address.isDefault && (
                            <button className="text-xs font-mono text-[#BAFF39]/70 hover:text-[#BAFF39] uppercase transition-colors ml-auto">
                              Set as Default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
