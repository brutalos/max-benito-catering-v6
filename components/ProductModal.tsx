'use client'

import React, { useState } from 'react'
import { Plus, X, Check } from 'lucide-react'
import { useCart, Product, ProductOption } from '@/context/CartContext'

interface ProductModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  onAddOverride?: (product: Product, selectedOptions: Record<string, string | string[]>) => void
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddOverride }) => {
  const { addToCart } = useCart()
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | string[]>>({})

  if (!isOpen) return null

  const handleOptionToggle = (optionId: string, choiceId: string, multiple?: boolean) => {
    setSelectedOptions(prev => {
      const current = prev[optionId]
      if (multiple) {
        const choices = Array.isArray(current) ? current : []
        if (choices.includes(choiceId)) {
          return { ...prev, [optionId]: choices.filter(id => id !== choiceId) }
        } else {
          return { ...prev, [optionId]: [...choices, choiceId] }
        }
      } else {
        return { ...prev, [optionId]: choiceId }
      }
    })
  }

  const isSelected = (optionId: string, choiceId: string) => {
    const current = selectedOptions[optionId]
    if (Array.isArray(current)) return current.includes(choiceId)
    return current === choiceId
  }

  const canAddToCart = () => {
    if (!product.options) return true
    return product.options.every(opt => {
      if (!opt.required) return true
      const selected = selectedOptions[opt.id]
      if (Array.isArray(selected)) return selected.length > 0
      return !!selected
    })
  }

  const handleAdd = () => {
    if (onAddOverride) {
      onAddOverride(product, selectedOptions)
    } else {
      addToCart(product, selectedOptions)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-primary/10 flex justify-between items-center">
          <div>
            <h2 className="text-[2.8rem] font-medium uc leading-tight">
              <span className="text-[#FF5C00]">5x</span> {product.name}
            </h2>
            <p className="text-[1.6rem] text-primary/60 mt-1">€{(product.price * 5).toFixed(2)} Base Price (for 5 pieces)</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-primary/5 rounded-full transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {product.options?.map((option) => (
            <div key={option.id}>
              <div className="flex justify-between items-baseline mb-4">
                <h3 className="text-[1.8rem] font-bold uc">{option.name}</h3>
                {option.required && (
                  <span className="text-[1.2rem] bg-accent/10 text-accent px-3 py-1 rounded-full font-bold uppercase tracking-wider">Required</span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {option.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleOptionToggle(option.id, choice.id, option.multiple)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected(option.id, choice.id)
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-primary/10 hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors ${
                        isSelected(option.id, choice.id) ? 'bg-accent border-accent' : 'border-primary/20'
                      }`}>
                        {isSelected(option.id, choice.id) && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-[1.6rem] font-medium">{choice.name}</span>
                    </div>
                    {choice.price && (
                      <span className="text-[1.4rem] font-bold text-accent">
                        +€{choice.price.toFixed(2)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 border-t border-primary/10 bg-zinc-50">
          <button
            disabled={!canAddToCart()}
            onClick={handleAdd}
            className={`w-full py-5 px-8 rounded-full font-bold text-[1.8rem] uc flex items-center justify-center gap-3 transition-all ${
              canAddToCart()
                ? 'bg-primary text-white hover:bg-accent shadow-lg shadow-primary/10 active:scale-[0.98]'
                : 'bg-primary/10 text-primary/30 cursor-not-allowed'
            }`}
          >
            <Plus className="w-6 h-6" />
            Add to Order
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
