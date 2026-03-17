'use client'

import React from 'react'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Clock, Package } from 'lucide-react'
import { useCart, CartItem } from '@/context/CartContext'
import { PRODUCTS, CATERING_PACKAGES } from '@/constants/products'

const CartView: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, scheduledDeliveryTime, setScheduledDeliveryTime } = useCart()

  const hasPackage = cart.some(item => item.isPackage)

  const getOptionName = (productId: string, optionId: string, choiceId: string | string[]) => {
    const product = PRODUCTS.find(p => p.id === productId)
    if (!product || !product.options) return ''
    const option = product.options.find(o => o.id === optionId)
    if (!option) return ''
    
    const choiceIds = Array.isArray(choiceId) ? choiceId : [choiceId]
    return choiceIds.map(id => {
      const choice = option.choices.find(c => c.id === id)
      if (!choice) return ''
      return choice.price ? `${choice.name} (+€${choice.price.toFixed(2)})` : choice.name
    }).filter(Boolean).join(', ')
  }

  const renderOptions = (item: any) => {
    if (!item.selectedOptions) return null
    const options = Object.entries(item.selectedOptions)
      .map(([optId, choiceId]) => {
        const names = getOptionName(item.id, optId, choiceId as any)
        return names ? names : ''
      })
      .filter(Boolean)
    
    if (options.length === 0) return null
    return (
      <div className="mt-2 text-[1.4rem] text-primary/50 flex flex-wrap gap-x-2">
        {options.join(' • ')}
      </div>
    )
  }

  const renderItemCustomizations = (productId: string, selectedOptions?: Record<string, string | string[]>) => {
    if (!selectedOptions) return null
    const options = Object.entries(selectedOptions)
      .map(([optId, choiceId]) => {
        const names = getOptionName(productId, optId, choiceId as any)
        return names ? names : ''
      })
      .filter(Boolean)
    
    if (options.length === 0) return null
    return (
      <div className="text-[1rem] text-primary/40 italic leading-tight mt-0.5">
        {options.join(' • ')}
      </div>
    )
  }

  const renderPackageDetails = (item: CartItem) => {
    if (!item.isPackage || !item.packageSelections) return null;
    const pkg = CATERING_PACKAGES.find(p => p.id === item.id.split('-')[0]);
    return (
      <div className="mt-4 space-y-4 border-l-2 border-accent/20 pl-4">
        {item.packageSelections.map((sel, idx) => {
          const req = pkg?.requirements.find(r => r.id === sel.requirementId);
          return (
            <div key={idx} className="space-y-1">
              <h4 className="text-[1.4rem] font-bold uc text-accent flex items-center gap-2">
                <Package className="w-4 h-4" />
                {sel.items.reduce((sum, i) => sum + i.quantity, 0)}x {req?.name || sel.requirementId}
              </h4>
              <div className="flex flex-wrap gap-2">
                {sel.items.map((selection, sIdx) => {
                  const product = PRODUCTS.find(p => p.id === selection.productId);
                  return (
                    <div key={sIdx} className="bg-primary/5 px-2 py-1 rounded text-[1.2rem] flex flex-col">
                      <span className="font-medium">{selection.quantity}x {product?.name}</span>
                      {renderItemCustomizations(selection.productId, selection.selectedOptions)}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="bg-primary/5 p-8 rounded-full mb-8">
          <ShoppingBag className="w-16 h-16 text-primary/20" />
        </div>
        <h2 className="text-[3rem] font-medium uc mb-4">Your cart is empty</h2>
        <p className="text-[1.8rem] text-primary/60 mb-12 max-w-md">
          Looks like you haven't added any delicious burritos to your cart yet.
        </p>
        <a 
          href="/#food" 
          className="bg-primary text-white uc py-4 px-12 rounded-full font-medium hover:bg-accent transition-colors flex items-center gap-3"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Menu
        </a>
      </div>
    )
  }

  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)

  return (
    <div className="flex flex-col lg:flex-row gap-16 py-12">
      <div className="flex-[2]">
        <h2 className="text-[3rem] font-medium uc mb-12">Your Order ({totalItems})</h2>
        <div className="space-y-8">
          {cart.map((item, index) => {
            const cartItemId = item.isPackage ? item.id : `${item.id}-${JSON.stringify(item.selectedOptions || {})}`
            return (
              <div key={`${cartItemId}-${index}`} className="flex gap-6 border-b border-primary/10 pb-8 group">
                <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-primary/5">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-[2.2rem] font-medium uc">
                          {!item.isPackage && <span className="text-[#FF5C00] mr-2">5x</span>}
                          {item.name}
                        </h3>
                        <button 
                          onClick={() => removeFromCart(cartItemId)}
                          className="text-primary/30 hover:text-accent transition-colors p-1"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    <p className="text-[1.5rem] text-primary/60">{item.description}</p>
                    {item.isPackage ? renderPackageDetails(item) : renderOptions(item)}
                  </div>
                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center border border-primary/20 rounded-full bg-white">
                        <button 
                          disabled={!item.isPackage && item.quantity <= 5}
                          onClick={() => updateQuantity(cartItemId, item.quantity - (item.isPackage ? 1 : 5))}
                          className={`p-3 transition-colors ${(!item.isPackage && item.quantity <= 5) ? 'text-primary/10 cursor-not-allowed' : 'hover:text-accent'}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-[1.6rem]">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(cartItemId, item.quantity + (item.isPackage ? 1 : 5))}
                          className="p-3 hover:text-accent transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-[1.8rem] font-bold">
                        €{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>

                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-primary/5 sticky top-32">
          {hasPackage && (
            <div className="bg-accent/5 p-6 rounded-2xl mb-8 border border-accent/10">
              <h4 className="text-[1.8rem] font-bold uc mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Schedule Delivery
              </h4>
              <p className="text-[1.4rem] text-primary/60 mb-4">
                Catering orders require a scheduled delivery time (min. 24h in advance).
              </p>
              <input 
                type="datetime-local" 
                value={scheduledDeliveryTime || ''}
                onChange={(e) => setScheduledDeliveryTime(e.target.value)}
                min={minDate}
                className="w-full bg-white border border-primary/10 rounded-xl p-4 text-[1.6rem] focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
          )}

          <h3 className="text-[2.4rem] font-medium uc mb-8">Summary</h3>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-[1.8rem]">
              <span className="text-primary/60">Subtotal</span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[1.8rem]">
              <span className="text-primary/60">Delivery</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="h-px bg-primary/10 my-4"></div>
            <div className="flex justify-between text-[2.4rem] font-bold">
              <span>Total</span>
              <span className="text-accent">€{totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            disabled={hasPackage && !scheduledDeliveryTime}
            onClick={() => window.location.href = '/checkout'}
            className={`w-full uc py-5 px-8 rounded-full font-bold text-[1.8rem] transition-all active:scale-[0.98] shadow-lg flex items-center justify-center ${
              hasPackage && !scheduledDeliveryTime 
                ? 'bg-primary/20 text-primary/40 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-accent shadow-primary/10'
            }`}
          >
            Go to Checkout
          </button>
          <p className="text-center text-[1.4rem] text-primary/40 mt-6">
            Prices incl. VAT and all taxes
          </p>
        </div>
      </div>
    </div>
  )
}

export default CartView
