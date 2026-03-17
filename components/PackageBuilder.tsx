'use client'

import React, { useState } from 'react'
import { Plus, Minus, X, Check, ChevronRight, ChevronLeft, Trash2 } from 'lucide-react'
import { useCart, Product, ProductOption, PackageSelection } from '@/context/CartContext'
import { PRODUCTS, CateringPackage } from '@/constants/products'
import ProductModal from './ProductModal'

interface PackageBuilderProps {
  pkg: CateringPackage
  isOpen: boolean
  onClose: () => void
}

const PackageBuilder: React.FC<PackageBuilderProps> = ({ pkg, isOpen, onClose }) => {
  const { addPackageToCart } = useCart()
  const [currentRequirementIndex, setCurrentRequirementIndex] = useState(0)
  const [selections, setSelections] = useState<Record<string, { productId: string, quantity: number, selectedOptions?: Record<string, string | string[]> }[]>>({})
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)

  const MIN_QTY = 5;

  if (!isOpen) return null

  const currentRequirement = pkg.requirements[currentRequirementIndex]
  const currentSelections = selections[currentRequirement.id] || []
  const currentTotalQuantity = currentSelections.reduce((sum, item) => sum + item.quantity, 0)

  const calculatePackagePrice = () => {
    let extraPrice = 0
    Object.values(selections).forEach((reqSelections) => {
      reqSelections.forEach((sel) => {
        const product = PRODUCTS.find(p => p.id === sel.productId)
        if (product && product.options && sel.selectedOptions) {
          Object.entries(sel.selectedOptions).forEach(([optionId, choiceIds]) => {
            const option = product.options?.find(o => o.id === optionId)
            if (option) {
              const choices = Array.isArray(choiceIds) ? choiceIds : [choiceIds]
              choices.forEach(choiceId => {
                const choice = option.choices.find(c => c.id === choiceId)
                if (choice?.price) {
                  extraPrice += choice.price * sel.quantity
                }
              })
            }
          })
        }
      })
    })
    return pkg.price + extraPrice
  }

  const packagePrice = calculatePackagePrice()

  const handleProductSelect = (product: Product) => {
    if (currentTotalQuantity + MIN_QTY > currentRequirement.quantity) return;
    
    if (product.options) {
      setActiveProduct(product)
    } else {
      addSelection(product.id)
    }
  }

  const addSelection = (productId: string, selectedOptions?: Record<string, string | string[]>) => {
    if (currentTotalQuantity + MIN_QTY > currentRequirement.quantity) return;

    setSelections(prev => {
      const existing = prev[currentRequirement.id] || []
      // Check if exact same product + options already exists to increment quantity
      const existingIndex = existing.findIndex(item => 
        item.productId === productId && 
        JSON.stringify(item.selectedOptions || {}) === JSON.stringify(selectedOptions || {})
      )

      if (existingIndex > -1) {
        const updated = [...existing]
        updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + MIN_QTY }
        return { ...prev, [currentRequirement.id]: updated }
      }

      return {
        ...prev,
        [currentRequirement.id]: [...existing, { productId, quantity: MIN_QTY, selectedOptions }]
      }
    })
    setActiveProduct(null)
  }

  const updateSelectionQuantity = (index: number, delta: number) => {
    setSelections(prev => {
      const existing = [...(prev[currentRequirement.id] || [])]
      const item = existing[index]
      if (!item) return prev

      // Multiply delta by MIN_QTY to increment/decrement in steps of 5
      const change = delta > 0 ? MIN_QTY : -MIN_QTY;
      const newQuantity = item.quantity + change
      
      if (newQuantity <= 0) {
        existing.splice(index, 1)
      } else {
        // Check if adding more would exceed requirement
        if (delta > 0 && currentTotalQuantity + MIN_QTY > currentRequirement.quantity) return prev;
        existing[index] = { ...item, quantity: newQuantity }
      }

      return { ...prev, [currentRequirement.id]: existing }
    })
  }

  const isRequirementMet = (reqId: string) => {
    const req = pkg.requirements.find(r => r.id === reqId)
    const qty = (selections[reqId] || []).reduce((sum, item) => sum + item.quantity, 0)
    return qty === (req?.quantity || 0)
  }

  const canProgress = isRequirementMet(currentRequirement.id)

  const handleNext = () => {
    if (currentRequirementIndex < pkg.requirements.length - 1) {
      setCurrentRequirementIndex(prev => prev + 1)
    } else {
      const packageSelections: PackageSelection[] = pkg.requirements.map(req => ({
        requirementId: req.id,
        items: (selections[req.id] || []).map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions
        }))
      }))
      addPackageToCart(pkg, packageSelections, packagePrice)
      onClose()
    }
  }

  const handleBack = () => {
    if (currentRequirementIndex > 0) {
      setCurrentRequirementIndex(prev => prev - 1)
    }
  }

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
      <div className="mt-1 text-[1.2rem] text-accent/70 flex flex-wrap gap-x-1 italic">
        {options.join(' • ')}
      </div>
    )
  }

  const availableProducts = PRODUCTS.filter(p => currentRequirement.productIds.includes(p.id))

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-[1400px] rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="p-8 border-b border-primary/10 flex justify-between items-center bg-zinc-50">
          <div>
            <h2 className="text-[2.8rem] font-medium uc leading-tight">{pkg.name}</h2>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-[1.6rem] text-primary/60">
                Step {currentRequirementIndex + 1} of {pkg.requirements.length}: {currentRequirement.name} ({currentTotalQuantity}/{currentRequirement.quantity})
              </p>
              <div className="w-1 h-1 bg-primary/20 rounded-full" />
              <p className="text-[1.6rem] font-bold text-accent">
                Total: €{packagePrice.toFixed(2)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-primary/5 rounded-full transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Product Selection Area */}
          <div className="flex-1 overflow-y-auto p-12 pr-16 space-y-8 border-r border-primary/10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[2.6rem] font-bold uc">Choose items:</h3>
              <div className={`px-6 py-2 rounded-full font-bold text-[1.6rem] uc ${canProgress ? 'bg-green-100 text-green-700' : 'bg-accent/10 text-accent'}`}>
                {currentTotalQuantity} / {currentRequirement.quantity} Selected
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {availableProducts.map(product => (
                <button
                  key={product.id}
                  disabled={currentTotalQuantity + MIN_QTY > currentRequirement.quantity}
                  onClick={() => handleProductSelect(product)}
                  className={`group relative flex items-center p-8 rounded-3xl border-2 transition-all text-left h-full ${
                    currentTotalQuantity + MIN_QTY > currentRequirement.quantity
                      ? 'opacity-50 cursor-not-allowed border-primary/5 bg-primary/5'
                      : 'border-primary/10 hover:border-accent hover:bg-accent/5 bg-white shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex-1">
                    <h4 className="text-[2.2rem] font-medium uc mb-2 leading-tight group-hover:text-accent transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[1.5rem] text-primary/60 line-clamp-3 leading-relaxed">{product.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Selections Area */}
          <div className="w-full md:w-[400px] bg-zinc-50 overflow-y-auto p-8 flex flex-col">
            <h3 className="text-[2rem] font-bold uc mb-8 flex items-center justify-between border-b border-primary/10 pb-4">
              Your Selection
              <span className="text-[1.6rem] font-medium text-primary/40">{currentTotalQuantity}/{currentRequirement.quantity}</span>
            </h3>
            
            {currentSelections.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-primary/10 rounded-3xl">
                <p className="text-[1.6rem] text-primary/40">No items selected yet</p>
              </div>
            ) : (
              <div className="space-y-4 flex-1">
                {currentSelections.map((sel, idx) => {
                  const product = PRODUCTS.find(p => p.id === sel.productId)
                  return (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-primary/5 flex flex-col gap-4 group">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-[1.6rem] font-bold uc leading-tight">{product?.name}</p>
                          {renderItemCustomizations(sel.productId, sel.selectedOptions)}
                        </div>
                        <button 
                          onClick={() => updateSelectionQuantity(idx, -sel.quantity)}
                          className="text-red-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 pt-4 border-t border-primary/5">
                        <span className="text-[1.4rem] font-medium text-primary/60">Quantity</span>
                        <div className="flex items-center bg-zinc-100 rounded-full p-1">
                          <button 
                            disabled={sel.quantity <= MIN_QTY}
                            onClick={() => updateSelectionQuantity(idx, -1)}
                            className={`p-2 rounded-full transition-colors ${
                              sel.quantity <= MIN_QTY 
                                ? 'text-primary/10 cursor-not-allowed' 
                                : 'hover:bg-white text-primary/60 hover:text-primary'
                            }`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-bold text-[1.6rem]">{sel.quantity}</span>
                          <button 
                            disabled={currentTotalQuantity + MIN_QTY > currentRequirement.quantity}
                            onClick={() => updateSelectionQuantity(idx, 1)}
                            className={`p-2 rounded-full transition-colors ${
                              currentTotalQuantity + MIN_QTY > currentRequirement.quantity 
                                ? 'text-primary/10 cursor-not-allowed' 
                                : 'hover:bg-white text-primary/60 hover:text-primary'
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-8 border-t border-primary/10 bg-white flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentRequirementIndex === 0}
            className={`flex items-center gap-2 py-4 px-8 rounded-full font-bold uc transition-all ${
              currentRequirementIndex === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-primary/5 text-primary'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
            Back
          </button>

          <button
            disabled={!canProgress}
            onClick={handleNext}
            className={`py-5 px-12 rounded-full font-bold text-[1.8rem] uc flex items-center justify-center gap-3 transition-all ${
              canProgress
                ? 'bg-primary text-white hover:bg-accent shadow-lg shadow-primary/10 active:scale-[0.98]'
                : 'bg-primary/10 text-primary/30 cursor-not-allowed'
            }`}
          >
            {currentRequirementIndex === pkg.requirements.length - 1 ? 'Finish & Add to Order' : 'Next Step'}
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Internal Product Modal for Customization */}
      {activeProduct && (
        <ProductModal
          product={activeProduct}
          isOpen={!!activeProduct}
          onClose={() => setActiveProduct(null)}
          onAddOverride={(product, options) => addSelection(product.id, options)}
        />
      )}
    </div>
  )
}

export default PackageBuilder
