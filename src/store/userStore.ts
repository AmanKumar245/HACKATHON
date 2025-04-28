import { create } from 'zustand';
import { User } from '../types';

type UserState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (name: string, email: string) => Promise<void>;
  login: (email: string) => Promise<void>;
  logout: () => void;
};

const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  register: async (name: string, email: string) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      createdAt: new Date(),
    };
    
    set({ user: newUser, isAuthenticated: true, isLoading: false });
    
    // Store user in localStorage (for persistence)
    localStorage.setItem('user', JSON.stringify(newUser));
  },
  
  login: async (email: string) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would validate credentials
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === email) {
        set({ user, isAuthenticated: true });
      }
    } else {
      // Create a temporary user for demo
      const tempUser = {
        id: `user-${Date.now()}`,
        name: 'Demo User',
        email,
        createdAt: new Date(),
      };
      set({ user: tempUser, isAuthenticated: true });
      localStorage.setItem('user', JSON.stringify(tempUser));
    }
    
    set({ isLoading: false });
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('user');
  },
}));

// Check for existing user session on initialization
const storedUser = localStorage.getItem('user');
if (storedUser) {
  const user = JSON.parse(storedUser);
  useUserStore.setState({ user, isAuthenticated: true });
}

export default useUserStore;