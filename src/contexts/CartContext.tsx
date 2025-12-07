import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { cartService } from '../services/cartService';
import { Cart, CartItem, Product } from '../types';

interface CartState {
  cart: Cart | null;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_TOTALS'; payload: { totalAmount: number; itemCount: number } };

const initialState: CartState = {
  cart: null,
  items: [],
  totalAmount: 0,
  itemCount: 0,
  isLoading: false,
  error: null,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CART':
      return {
        ...state,
        cart: action.payload,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        itemCount: action.payload.itemCount || 0,
        isLoading: false,
        error: null,
      };
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.productId._id === action.payload.productId._id
      );
      let updatedItems;
      if (existingItemIndex >= 0) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, action.payload];
      }
      return { ...state, items: updatedItems };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.productId._id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.productId._id !== action.payload),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalAmount: 0,
        itemCount: 0,
      };
    case 'UPDATE_TOTALS':
      return {
        ...state,
        totalAmount: action.payload.totalAmount,
        itemCount: action.payload.itemCount,
      };
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addToCart: (product: Product, quantity?: number, variationId?: string) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  customerId?: string;
  sessionId?: string;
}

export const CartProvider: React.FC<CartProviderProps> = ({ 
  children, 
  customerId, 
  sessionId 
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Initialize cart on mount - only if we have a customerId or sessionId
  useEffect(() => {
    // Only initialize if we have a valid customer ID (not a placeholder)
    if (customerId && customerId !== 'current-user-id') {
      initializeCart();
    } else if (sessionId && sessionId !== 'session-id') {
      initializeCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, sessionId]);

  const initializeCart = async () => {
    // Don't initialize if we have placeholder values
    if (customerId === 'current-user-id' || sessionId === 'session-id') {
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (customerId) {
        const response = await cartService.getCartByCustomer(customerId);
        if (response.success && response.data) {
          dispatch({ type: 'SET_CART', payload: response.data });
        }
      } else if (sessionId) {
        const response = await cartService.getCartBySession(sessionId);
        if (response.success && response.data) {
          dispatch({ type: 'SET_CART', payload: response.data });
        }
      }
    } catch (error: any) {
      // Only log error if it's not a CORS or network error (which are expected when not authenticated)
      if (error.code !== 'ERR_NETWORK' && error.response?.status !== 401) {
        console.error('Error initializing cart:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (product: Product, quantity: number = 1, variationId?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (!state.cart) {
        // Create new cart if none exists
        const cartResponse = await cartService.createCart(customerId);
        if (cartResponse.success && cartResponse.data) {
          dispatch({ type: 'SET_CART', payload: cartResponse.data });
        }
      }

      if (state.cart) {
        const response = await cartService.addItemToCart(state.cart._id, {
          productId: product._id,
          variationId,
          quantity,
        });

        if (response.success && response.data) {
          dispatch({ type: 'SET_CART', payload: response.data });
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (state.cart) {
        const response = await cartService.updateCartItem(state.cart._id, productId, {
          quantity,
        });

        if (response.success && response.data) {
          dispatch({ type: 'SET_CART', payload: response.data });
        }
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update cart item' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (state.cart) {
        const response = await cartService.removeCartItem(state.cart._id, productId);

        if (response.success && response.data) {
          dispatch({ type: 'SET_CART', payload: response.data });
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (state.cart) {
        const response = await cartService.clearCart(state.cart._id);

        if (response.success && response.data) {
          dispatch({ type: 'SET_CART', payload: response.data });
        }
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const refreshCart = async () => {
    await initializeCart();
  };

  const value: CartContextType = {
    state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
