/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import AlbumDetail from './pages/AlbumDetail';
import Discover from './pages/Discover';
import ArtistProfile from './pages/ArtistProfile';
import ArtistsShowcase from './pages/ArtistsShowcase';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';

import { LanguageProvider } from './context/LanguageContext';
import BackgroundMusic from './components/BackgroundMusic';
import FluidBackground from './components/FluidBackground';

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <FluidBackground />
          <BackgroundMusic />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/album/:id" element={<AlbumDetail />} />
              <Route path="/artist/:name" element={<ArtistProfile />} />
              <Route path="/artists" element={<ArtistsShowcase />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </LanguageProvider>
  );
}

