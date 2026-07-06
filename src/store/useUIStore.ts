import { create } from 'zustand';

interface UIState {
  isAuthModalOpen: boolean;
  isCartDrawerOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAuthModalOpen: false,
  isCartDrawerOpen: false,
  
  openAuthModal: () => set({ isAuthModalOpen: true, isCartDrawerOpen: false }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  
  openCartDrawer: () => set({ isCartDrawerOpen: true, isAuthModalOpen: false }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
}));
