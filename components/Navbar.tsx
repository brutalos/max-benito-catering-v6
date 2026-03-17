'use client'

import React, { useState, useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 py-6 ${scrolled ? 'bg-background shadow-md py-4' : 'bg-transparent'}`}>
      <div className="row flex justify-between items-center">
        <a href="/" className="flex items-center">
          <img 
            src="/images/logo-mini.svg" 
            alt="Max & Benito Logo" 
            className="w-[30px] h-auto"
          />
        </a>

        <nav className="flex items-center space-x-4 md:space-x-8">
          <div className="hidden md:flex items-center space-x-6">
            <a href="/#food" className="text-[16px] font-medium uppercase tracking-wider hover:text-accent transition-colors">Food</a>
            <a href="/#get" className="text-[16px] font-medium uppercase tracking-wider hover:text-accent transition-colors">Order</a>
            <a href="/#locations" className="text-[16px] font-medium uppercase tracking-wider hover:text-accent transition-colors">Locations</a>
            <a 
              href="https://www.instagram.com/maxandbenito/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-accent transition-colors"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 44 44">
                <path d="M22,3.964c5.874,0,6.57.022,8.89.128,2.145.098,3.31.456,4.085.757,1.027.399,1.76.876,2.53,1.646.77.77,1.247,1.503,1.646,2.53.301.775.66,1.94.758,4.085.106,2.32.128,3.016.128,8.89s-.022,6.57-.128,8.89c-.098,2.145-.456,3.31-.758,4.085-.399,1.027-.876,1.76-1.646,2.53-.77.77-1.503,1.247-2.53,1.646-.775.301-1.94.66-4.085.758-2.32.106-3.015.128-8.89.128s-6.57-.022-8.89-.128c-2.145-.098-3.31-.456-4.085-.758-1.027-.399-1.76-.876-2.53-1.646-.77-.77-1.247-1.503-1.646-2.53-.301-.775-.66-1.94-.758-4.085-.106-2.32-.128-3.016-.128-8.89s.022-6.57.128-8.89c.098-2.145.456-3.31.758-4.085.399-1.027.876-1.76,1.646-2.53.77-.77,1.503-1.247,2.53-1.646.775-.301,1.94-.659,4.085-.757,2.32-.106,3.016-.128,8.89-.128M22,0c-5.975,0-6.724.025-9.071.132-2.342.107-3.941.479-5.34,1.023-1.447.562-2.674,1.314-3.897,2.537-1.223,1.223-1.975,2.45-2.538,3.897-.544,1.4-.916,2.999-1.023,5.34-.107,2.347-.132,3.096-.132,9.071s.025,6.724.132,9.071c.107,2.342.479,3.941,1.023,5.34.562,1.447,1.314,2.674,2.538,3.896,1.223,1.223,2.45,1.975,3.897,2.538,1.399.544,2.999.916,5.34,1.023,2.346.107,3.096.132,9.071.132s6.724-.025,9.07-.132c2.342-.107,3.941-.479,5.34-1.023,1.447-.562,2.674-1.314,3.897-2.538,1.223-1.223,1.975-2.45,2.538-3.896.544-1.399.916-2.999,1.023-5.34.107-2.346.132-3.096.132-9.071s-.025-6.724-.132-9.071c-.107-2.342-.479-3.941-1.023-5.34-.562-1.447-1.314-2.674-2.538-3.897-1.223-1.223-2.45-1.975-3.897-2.537-1.399-.544-2.999-.916-5.34-1.023-2.346-.107-3.096-.132-9.07-.132h0ZM22.044,10.738c-6.244,0-11.306,5.062-11.306,11.306s5.062,11.306,11.306,11.306,11.306-5.062,11.306-11.306-5.062-11.306-11.306-11.306h0ZM22.044,29.382c-4.053,0-7.339-3.286-7.339-7.339s3.286-7.339,7.339-7.339,7.339,3.286,7.339,7.339-3.286,7.339-7.339,7.339h0Z"></path>
              </svg>
            </a>
          </div>

          <a href="/cart" className="relative p-2 text-primary hover:text-accent transition-colors">
            <ShoppingCart className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              0
            </span>
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
