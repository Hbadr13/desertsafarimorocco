"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, ReactNode, useState, useEffect } from "react"

interface SwiperProps {
  items: ReactNode[]
}

export function Swiper({ items }: SwiperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollButtons = () => {
    const container = containerRef.current
    if (!container) return
    setCanScrollLeft(container.scrollLeft > 120)
    setCanScrollRight(container.scrollLeft + container.offsetWidth < container.scrollWidth - 30)
  }

  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -containerRef.current.offsetWidth, behavior: "smooth" })
  }

  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: containerRef.current.offsetWidth, behavior: "smooth" })
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.addEventListener("scroll", updateScrollButtons)
    updateScrollButtons()
    return () => container.removeEventListener("scroll", updateScrollButtons)
  }, [])

  return (
    <div className="relative group w-full">
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className=" hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 z-10 p-2 hover:bg-white/80 rounded-full shadow bg-white transition-opacity opacity-100"
        >
          <ChevronLeft className="h-4 w-4 text-blue-600" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-2 hover:bg-white/80 rounded-full shadow bg-white transition-opacity opacity-100"
        >
          <ChevronRight className="h-4 w-4 text-blue-600" />
        </button>
      )}

      <div className="  w-full overflow-hidden">

        <div
          ref={containerRef}
          className="flex space-x-2  md:space-x-4 overflow-x-auto scrollbar-none scroll-smooth"
        >
          {items.map((item, index) => (
            <div key={index} className="flex-shrink-0">
              {item}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
