'use client'

import { useState } from 'react'
import { Truck, X } from 'lucide-react'

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative bg-foreground text-primary-foreground">
      <div className="container-custom flex items-center justify-center py-2.5 text-xs sm:text-sm tracking-wide">
        <Truck className="mr-2 h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
        <p className="text-center">
          <span className="font-semibold">Free US shipping over $35</span>
          <span className="mx-2 opacity-50">·</span>
          <span>30-day happy pup guarantee</span>
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
