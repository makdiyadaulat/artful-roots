import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, setAuthToken } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'artist' | 'visitor';
  avatar: string;
}

interface Artwork {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  price: number;
  image: string;
  category: string;
  likes: number;
  medium: string;
  size: string;
  description: string;
}

interface AppContextType {
  user: User | null;
  login: (email: string, password: string, role: 'artist' | 'visitor') => void;
  logout: () => void;
  register: (name: string, email: string, password: string, role: 'artist' | 'visitor') => void;
  updateUser: (updates: Partial<User>) => void;
  favorites: string[];
  toggleFavorite: (artworkId: string) => void;
  likes: string[];
  toggleLike: (artworkId: string) => void;
  follows: string[];
  toggleFollow: (artistId: string) => void;
  inquiries: any[];
  addInquiry: (inquiry: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const [follows, setFollows] = useState<string[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);

  const safeSet = (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  };

  const safeGet = (key: string) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = safeGet('user');
    const storedFavorites = safeGet('favorites');
    const storedLikes = safeGet('likes');
    const storedFollows = safeGet('follows');
    const storedInquiries = safeGet('inquiries');

    if (storedUser) setUser(storedUser);
    if (storedFavorites) setFavorites(storedFavorites);
    if (storedLikes) setLikes(storedLikes);
    if (storedFollows) setFollows(storedFollows);
    if (storedInquiries) setInquiries(storedInquiries);
  }, []);

  const login = async (email: string, password: string, role?: 'artist' | 'visitor') => {
    const { token, user: payloadUser } = await api.auth.login(email, password);
    setAuthToken(token);
    const next: User = {
      id: payloadUser.id,
      name: payloadUser.name,
      email: payloadUser.email,
      role: payloadUser.role,
      avatar: payloadUser.avatar,
    };
    setUser(next);
    safeSet('user', next);
  };

  const register = async (name: string, email: string, password: string, role: 'artist' | 'visitor') => {
    const { token, user: payloadUser } = await api.auth.register(name, email, password, role);
    setAuthToken(token);
    const next: User = {
      id: payloadUser.id,
      name: payloadUser.name,
      email: payloadUser.email,
      role: payloadUser.role,
      avatar: payloadUser.avatar,
    };
    setUser(next);
    safeSet('user', next);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setAuthToken(null);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...updates } as User;
      safeSet('user', next);
      return next;
    });
  };

  const toggleFavorite = (artworkId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(artworkId)
        ? prev.filter(id => id !== artworkId)
        : [...prev, artworkId];
      safeSet('favorites', newFavorites);
      return newFavorites;
    });
  };

  const toggleLike = (artworkId: string) => {
    setLikes(prev => {
      const newLikes = prev.includes(artworkId)
        ? prev.filter(id => id !== artworkId)
        : [...prev, artworkId];
      safeSet('likes', newLikes);
      return newLikes;
    });
  };

  const toggleFollow = (artistId: string) => {
    setFollows(prev => {
      const newFollows = prev.includes(artistId)
        ? prev.filter(id => id !== artistId)
        : [...prev, artistId];
      safeSet('follows', newFollows);
      return newFollows;
    });
  };

  const addInquiry = (inquiry: any) => {
    setInquiries(prev => {
      const newInquiries = [...prev, { ...inquiry, id: Date.now().toString() }];
      safeSet('inquiries', newInquiries);
      return newInquiries;
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        updateUser,
        favorites,
        toggleFavorite,
        likes,
        toggleLike,
        follows,
        toggleFollow,
        inquiries,
        addInquiry,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
