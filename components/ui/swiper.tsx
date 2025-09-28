"use client"

import { useState, useRef, useEffect, ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SwiperProps {
  items: ReactNode[]
  cardWidth?: number
  cardGap?: number
  showNavigation?: boolean
  leftOffset?: number
}

export function Swiper({
  items,
  cardWidth = 300,
  cardGap = 16,
  showNavigation = true,
  leftOffset = 0
}: SwiperProps) {
  const [currentPosition, setCurrentPosition] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const velocityRef = useRef(0)
  const startTimeRef = useRef(0)
  const startYRef = useRef(0)
  const isHorizontalSwipeRef = useRef(false)

  // Calculate container width on mount and resize
  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth)
    }
    updateContainerWidth()
    window.addEventListener("resize", updateContainerWidth)
    return () => window.removeEventListener("resize", updateContainerWidth)
  }, [])

  const maxPosition = Math.max(0, (items.length * (cardWidth + cardGap)) - containerWidth)

  // Block vertical scroll while horizontal swipe
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isHorizontalSwipeRef.current) e.preventDefault()
    }
    document.addEventListener("touchmove", preventScroll, { passive: false })
    return () => document.removeEventListener("touchmove", preventScroll)
  }, [])

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartPosition(e.touches[0].clientX)
    startYRef.current = e.touches[0].clientY
    startTimeRef.current = e.timeStamp
    isHorizontalSwipeRef.current = false
    if (sliderRef.current) sliderRef.current.style.transition = "none"
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const diffX = currentX - startPosition
    const diffY = currentY - startYRef.current

    if (!isHorizontalSwipeRef.current) {
      isHorizontalSwipeRef.current = Math.abs(diffX) > Math.abs(diffY)
    }

    if (isHorizontalSwipeRef.current) {
      const newPosition = Math.max(-maxPosition, Math.min(0, currentPosition + diffX))
      velocityRef.current = diffX / (e.timeStamp - startTimeRef.current + 1) // velocity px/ms
      setCurrentPosition(newPosition)
      setStartPosition(currentX)
      startTimeRef.current = e.timeStamp
      if (sliderRef.current) sliderRef.current.style.transform = `translateX(${newPosition}px)`
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    isHorizontalSwipeRef.current = false
    if (!sliderRef.current) return

    // Smooth momentum based on velocity
    const momentum = velocityRef.current * 200 // multiplier for distance
    let newPosition = currentPosition + momentum
    newPosition = Math.max(-maxPosition, Math.min(0, newPosition))
    sliderRef.current.style.transition = "transform 0.5s ease-out"
    sliderRef.current.style.transform = `translateX(${newPosition}px)`
    setCurrentPosition(newPosition)
    velocityRef.current = 0
  }

  // Navigation
  const scrollLeft = () => {
    if (!sliderRef.current) return
    const visibleIndex = Math.round(Math.abs(currentPosition) / (cardWidth + cardGap))
    const newIndex = Math.max(0, visibleIndex - 1)
    const newPosition = -newIndex * (cardWidth + cardGap) + leftOffset

    if (sliderRef.current) sliderRef.current.style.transition = "transform 0.5s ease-out"
    const finalPos = Math.max(-maxPosition, Math.min(0, newPosition))
    sliderRef.current.style.transform = `translateX(${finalPos}px)`
    setCurrentPosition(finalPos)
  }

  const scrollRight = () => {
    if (!sliderRef.current) return

    const visibleIndex = Math.round(Math.abs(currentPosition) / (cardWidth + cardGap))
    const newIndex = Math.min(items.length - 1, visibleIndex + 1)
    const newPosition = -newIndex * (cardWidth + cardGap) + leftOffset

    if (sliderRef.current) sliderRef.current.style.transition = "transform 0.5s ease-out"
    const finalPos = Math.max(-maxPosition, Math.min(0, newPosition))
    sliderRef.current.style.transform = `translateX(${finalPos}px)`
    setCurrentPosition(finalPos)
  }



  const canScrollLeft = currentPosition < 0
  const canScrollRight = currentPosition > -maxPosition

  return (
    <div className="relative group/parent">
      {showNavigation && canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white border rounded-full p-2 transition-all duration-200 opacity-0 group-hover/parent:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {showNavigation && canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white border rounded-full p-2 transition-all duration-200 opacity-0 group-hover/parent:opacity-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <div ref={containerRef} className="overflow-hidden py-2">
        <div
          ref={sliderRef}
          className={`flex ${isDragging ? "cursor-grabbing" : "cursor-grab"} transition-transform duration-300 ease-out`}
          style={{ gap: `${cardGap}px`, transform: `translateX(${currentPosition}px)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {items.map((item, index) => (
            <div key={index} style={{ minWidth: `${cardWidth}px` }} className="px-2 transition-transform duration-300">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
