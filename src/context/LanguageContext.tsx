import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'zh-CN' | 'zh-TW' | 'fr';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  'Discover': {
    'en': 'Discover',
    'zh-CN': '发现',
    'zh-TW': '探索',
    'fr': 'Découvrir'
  },
  'Cart': {
    'en': 'Cart',
    'zh-CN': '购物车',
    'zh-TW': '購物車',
    'fr': 'Panier'
  },
  'Cart (': {
    'en': 'Cart (',
    'zh-CN': '购物车 (',
    'zh-TW': '購物車 (',
    'fr': 'Panier ('
  },
  'For Artists': {
    'en': 'For Artists',
    'zh-CN': '致音乐人',
    'zh-TW': '致音樂人',
    'fr': 'Pour les artistes'
  },
  'About': {
    'en': 'About',
    'zh-CN': '关于',
    'zh-TW': '關於',
    'fr': 'À propos'
  },
  'Login': {
    'en': 'Login',
    'zh-CN': '登录',
    'zh-TW': '登入',
    'fr': 'Connexion'
  },
  'Better music': {
    'en': 'Better music',
    'zh-CN': '更好的音乐',
    'zh-TW': '更好的音樂',
    'fr': 'Meilleure musique'
  },
  'streaming for everyone.': {
    'en': 'streaming for everyone.',
    'zh-CN': '让每个人尽享.',
    'zh-TW': '讓每個人盡享.',
    'fr': 'streaming pour tous.'
  },
  'Free for you,': {
    'en': 'Free for you,',
    'zh-CN': '为您免费,',
    'zh-TW': '為您免費,',
    'fr': 'Gratuit pour vous,'
  },
  'freedom for artists.': {
    'en': 'freedom for artists.',
    'zh-CN': '音乐人自由.',
    'zh-TW': '音樂人自由.',
    'fr': 'liberté pour les artistes.'
  },
  'For the love': {
    'en': 'For the love',
    'zh-CN': '出于热爱',
    'zh-TW': '出於熱愛',
    'fr': 'Pour l\'amour'
  },
  'of music.': {
    'en': 'of music.',
    'zh-CN': '音乐.',
    'zh-TW': '音樂.',
    'fr': 'de la musique.'
  },
  'Join': {
    'en': 'Join',
    'zh-CN': '加入',
    'zh-TW': '加入',
    'fr': 'Rejoindre'
  },
  'BGM': {
    'en': 'BGM',
    'zh-CN': '背景音乐',
    'zh-TW': '背景音樂',
    'fr': 'Musique'
  },
  'Play Music': {
    'en': 'Play Music',
    'zh-CN': '播放音乐',
    'zh-TW': '播放音樂',
    'fr': 'Jouer'
  },
  'Pause Music': {
    'en': 'Pause Music',
    'zh-CN': '暂停音乐',
    'zh-TW': '暫停音樂',
    'fr': 'Pause'
  },
  'about_desc': {
    'en': 'A highly-curated digital platform for collectors and audiophiles. Discover, collect, and experience rare vinyl pressings and exclusive releases from leading electronic and ambient pioneers.',
    'zh-CN': '专为收藏家和发烧友打造的精选数字平台。发现、收藏并体验来自领先电子和环境音乐先驱的珍贵黑胶压片和独家发行。',
    'zh-TW': '專為收藏家和發燒友打造的精選數位平台。發現、收藏並體驗來自領先電子和環境音樂先驅的珍貴黑膠壓片和獨家發行。',
    'fr': 'Une plateforme numérique de qualité pour les collectionneurs et les audiophiles. Découvrez, collectionnez et découvrez des pressages vinyles rares et des sorties exclusives de pionniers de la musique électronique et ambiante.'
  },
  'Detail & Buy': {
    'en': 'Detail & Buy',
    'zh-CN': '详情与购买',
    'zh-TW': '詳情與購買',
    'fr': 'Détails et Acheter'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
