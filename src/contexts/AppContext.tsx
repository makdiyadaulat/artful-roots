import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedFavorites = localStorage.getItem('favorites');
    const storedLikes = localStorage.getItem('likes');
    const storedFollows = localStorage.getItem('follows');
    const storedInquiries = localStorage.getItem('inquiries');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    if (storedLikes) setLikes(JSON.parse(storedLikes));
    if (storedFollows) setFollows(JSON.parse(storedFollows));
    if (storedInquiries) setInquiries(JSON.parse(storedInquiries));
  }, []);

  const login = (email: string, password: string, role: 'artist' | 'visitor') => {
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const register = (name: string, email: string, password: string, role: 'artist' | 'visitor') => {
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const toggleFavorite = (artworkId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(artworkId)
        ? prev.filter(id => id !== artworkId)
        : [...prev, artworkId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const toggleLike = (artworkId: string) => {
    setLikes(prev => {
      const newLikes = prev.includes(artworkId)
        ? prev.filter(id => id !== artworkId)
        : [...prev, artworkId];
      localStorage.setItem('likes', JSON.stringify(newLikes));
      return newLikes;
    });
  };

  const toggleFollow = (artistId: string) => {
    setFollows(prev => {
      const newFollows = prev.includes(artistId)
        ? prev.filter(id => id !== artistId)
        : [...prev, artistId];
      localStorage.setItem('follows', JSON.stringify(newFollows));
      return newFollows;
    });
  };

  const addInquiry = (inquiry: any) => {
    setInquiries(prev => {
      const newInquiries = [...prev, { ...inquiry, id: Date.now().toString() }];
      localStorage.setItem('inquiries', JSON.stringify(newInquiries));
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
