'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  options?: ProductOption[]
}

export interface ProductOption {
  id: string
  name: string
  choices: OptionChoice[]
  required?: boolean
  multiple?: boolean
}

export interface OptionChoice {
  id: string
  name: string
  price?: number
}

export interface PackageSelection {
  requirementId: string;
  items: {
    productId: string;
    quantity: number;
    selectedOptions?: Record<string, string | string[]>;
  }[];
}

export interface CartItem extends Partial<Product> {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description?: string;
  selectedOptions?: Record<string, string | string[]>;
  // Catering fields
  isPackage?: boolean;
  packageSelections?: PackageSelection[];
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product, selectedOptions?: Record<string, string | string[]>, quantity?: number) => void
  addPackageToCart: (pkg: any, selections: PackageSelection[], totalPrice: number) => void
  removeFromCart: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  scheduledDeliveryTime: string | null
  setScheduledDeliveryTime: (time: string | null) => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [scheduledDeliveryTime, setScheduledDeliveryTime] = useState<string | null>(null)

  // Load cart and delivery time from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('max-benito-cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to parse cart', e)
      }
    }
    const savedTime = localStorage.getItem('max-benito-delivery-time')
    if (savedTime) setScheduledDeliveryTime(savedTime)
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('max-benito-cart', JSON.stringify(cart))
  }, [cart])

  // Save delivery time to localStorage
  useEffect(() => {
    if (scheduledDeliveryTime) {
      localStorage.setItem('max-benito-delivery-time', scheduledDeliveryTime)
    } else {
      localStorage.removeItem('max-benito-delivery-time')
    }
  }, [scheduledDeliveryTime])

  const addToCart = (product: Product, selectedOptions?: Record<string, string | string[]>, quantity: number = 5) => {
    setCart(prevCart => {
      // Create a unique key for items with different options
      const cartItemId = `${product.id}-${JSON.stringify(selectedOptions || {})}`
      
      const existingItemIndex = prevCart.findIndex(item => {
        const itemOptionsId = `${item.id}-${JSON.stringify(item.selectedOptions || {})}`
        return itemOptionsId === cartItemId && !item.isPackage
      })

      if (existingItemIndex > -1) {
        return prevCart.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
        )
      }

      // Calculate extra price from options
      let extraPrice = 0
      if (selectedOptions && product.options) {
        Object.entries(selectedOptions).forEach(([optionId, choiceIds]) => {
          const option = product.options?.find(o => o.id === optionId)
          if (option) {
            const choices = Array.isArray(choiceIds) ? choiceIds : [choiceIds]
            choices.forEach(choiceId => {
              const choice = option.choices.find(c => c.id === choiceId)
              if (choice?.price) extraPrice += choice.price
            })
          }
        })
      }

      const newItem: CartItem = { 
        id: product.id,
        name: product.name,
        image: product.image,
        description: product.description,
        price: product.price + extraPrice,
        quantity, 
        selectedOptions 
      }
      return [...prevCart, newItem]
    })
  }

  const addPackageToCart = (pkg: any, selections: PackageSelection[], totalPrice: number) => {
    setCart(prevCart => {
      const newItem: CartItem = {
        id: `${pkg.id}-${Date.now()}`, // Unique ID for each package instance
        name: pkg.name,
        price: totalPrice,
        image: pkg.image,
        description: pkg.description,
        quantity: 1,
        isPackage: true,
        packageSelections: selections
      }
      return [...prevCart, newItem]
    })
  }

  const removeFromCart = (cartItemId: string) => {
    setCart(prevCart => prevCart.filter((item) => {
      const currentId = item.isPackage ? item.id : `${item.id}-${JSON.stringify(item.selectedOptions || {})}`
      return currentId !== cartItemId
    }))
  }

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId)
      return
    }
    setCart(prevCart =>
      prevCart.map((item) => {
        const currentId = item.isPackage ? item.id : `${item.id}-${JSON.stringify(item.selectedOptions || {})}`
        return currentId === cartItemId ? { ...item, quantity } : item
      })
    )
  }

  const clearCart = () => {
    setCart([])
    setScheduledDeliveryTime(null)
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      addPackageToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      scheduledDeliveryTime,
      setScheduledDeliveryTime,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
