'use client'

import React, { useEffect, useRef } from 'react'

export interface AddressResult {
  street: string
  city: string
  postCode: string
  country: string
  lat: number
  lon: number
  formatted: string
}

interface Props {
  onSelect: (address: AddressResult) => void
  placeholder?: string
  className?: string
  locationBias?: { radius: number; center: { lat: number; lng: number } }
}

let gmapPromise: Promise<void> | null = null

function ensureGoogleMaps(apiKey: string): Promise<void> {
  if (gmapPromise) return gmapPromise
  gmapPromise = new Promise((resolve, reject) => {
    const w = window as any
    w.__gmcb = () => resolve()
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__gmcb&libraries=places`
    script.async = true
    script.onerror = () => { gmapPromise = null; reject(new Error('Failed to load Google Maps')) }
    document.head.appendChild(script)
  })
  return gmapPromise
}

async function loadGoogleMaps(apiKey: string): Promise<any> {
  await ensureGoogleMaps(apiKey)
  return await (window as any).google.maps.importLibrary('places')
}

export default function AddressAutocomplete({ onSelect, placeholder, className, locationBias }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const elementRef = useRef<any>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || !containerRef.current || elementRef.current) return

    let cancelled = false

    loadGoogleMaps(apiKey).then(async (places: any) => {
      if (cancelled || elementRef.current) return

      const ac = new places.PlaceAutocompleteElement({
        types: ['address'],
      })
      
      if (locationBias) {
        ac.locationBias = locationBias
      }
      if (placeholder) ac.placeholder = placeholder
      elementRef.current = ac

      ac.addEventListener('gmp-select', async (e: any) => {
        const place = e.placePrediction.toPlace()
        await place.fetchFields({
          fields: ['addressComponents', 'formattedAddress', 'location'],
        })

        let street = '', streetNumber = '', city = '', postCode = '', country = ''

        if (place.addressComponents) {
          for (const comp of place.addressComponents) {
            const t = comp.types
            if (t.includes('route')) street = comp.longText || ''
            if (t.includes('street_number')) streetNumber = comp.longText || ''
            if (t.includes('locality')) city = comp.longText || ''
            if (t.includes('postal_code')) postCode = comp.longText || ''
            if (t.includes('country')) country = comp.shortText || ''
          }
        }

        const loc = place.location
        onSelectRef.current({
          street: streetNumber ? `${street} ${streetNumber}` : street,
          city, postCode, country,
          lat: loc?.lat() ?? 0,
          lon: loc?.lng() ?? 0,
          formatted: place.formattedAddress || '',
        })
      })

      containerRef.current?.appendChild(ac as unknown as Node)
    }).catch(console.error)

    return () => { cancelled = true }
  }, [placeholder, locationBias])

  return (
    <div ref={containerRef} className={className} />
  )
}
