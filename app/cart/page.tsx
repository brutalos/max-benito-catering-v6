import React from 'react'
import CartView from '@/components/CartView'

export default function CartPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-zinc-50/50">
      <div className="row">
        <CartView />
      </div>
    </div>
  )
}
