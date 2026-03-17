'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCart, Product } from '@/context/CartContext'
import { PRODUCTS, CATERING_PACKAGES, CateringPackage } from '@/constants/products'
import ProductModal from './ProductModal'
import PackageBuilder from './PackageBuilder'

const Menu: React.FC = () => {
  const { addToCart } = useCart()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<CateringPackage | null>(null)

  const handleProductClick = (product: Product) => {
    if (product.options) {
      setSelectedProduct(product)
    } else {
      addToCart(product)
    }
  }

  return (
    <div className="space-y-24">
      {/* Regular Menu */}
      <div className="space-y-8">
        <h2 className="text-[3rem] font-bold uc mb-12 border-b-4 border-accent inline-block">Our Classics</h2>
        {PRODUCTS.map((product) => (
          <div key={product.id} className="flex flex-col md:flex-row md:items-center justify-between border-b border-primary/10 pb-8 group">
            <div className="flex-1">
              <h3 className="text-[2.2rem] font-medium uc group-hover:text-accent transition-colors mb-2">
                <span className="text-[#FF5C00]">5x</span> {product.name}
              </h3>
              <p className="text-[1.6rem] text-primary/60 max-w-3xl leading-relaxed">
                {product.description}
              </p>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-12 mt-6 md:mt-0 md:ml-12">
              <div className="flex flex-col items-end">
                <span className="text-[2rem] font-bold text-primary">
                  €{product.price.toFixed(2)}
                </span>
                <span className="text-[1.2rem] text-primary/40 uc font-medium">per item</span>
              </div>
              <button 
                onClick={() => handleProductClick(product)}
                className="bg-primary text-white uc p-4 rounded-full font-medium flex items-center justify-center hover:bg-accent transition-all active:scale-95 shadow-sm"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Catering Packages */}
      <div className="space-y-8">
        <h2 className="text-[3rem] font-bold uc mb-12 border-b-4 border-accent inline-block">Catering Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {CATERING_PACKAGES.map((pkg) => {
            const isMostPopular = pkg.id === 'office-party-20';
            const individualPricePerPerson = 16.90;
            const peopleCount = pkg.id.includes('10') ? 10 : pkg.id.includes('20') ? 20 : 50;
            const individualTotal = individualPricePerPerson * peopleCount;
            const discountPercent = Math.round(((individualTotal - pkg.price) / individualTotal) * 100);

            return (
              <div key={pkg.id} className={`flex flex-col bg-zinc-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border group relative ${isMostPopular ? 'border-accent ring-2 ring-accent/20' : 'border-primary/5'}`}>
                {isMostPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-accent text-white px-6 py-2 rounded-b-2xl font-bold text-[1.4rem] uc z-20 shadow-md">
                    Most Popular
                  </div>
                )}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-[1.8rem] shadow-sm">
                      €{pkg.price.toFixed(2)}
                    </div>
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full font-bold text-[1.4rem] uc shadow-sm">
                      {discountPercent}% OFF
                    </div>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-[2.4rem] font-medium uc mb-3">{pkg.name}</h3>
                  <p className="text-[1.6rem] text-primary/60 mb-8 flex-1">
                    {pkg.description}
                  </p>
                  <button 
                    onClick={() => setSelectedPackage(pkg)}
                    className={`w-full uc py-5 rounded-full font-bold text-[1.6rem] transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-3 ${isMostPopular ? 'bg-accent text-white hover:bg-accent/90' : 'bg-primary text-white hover:bg-accent'}`}
                  >
                    <Plus className="w-6 h-6" />
                    Select Package
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {selectedPackage && (
        <PackageBuilder
          pkg={selectedPackage}
          isOpen={!!selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </div>
  )
}

export default Menu
