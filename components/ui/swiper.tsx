// components/ui/swiper.tsx
"use client"

import { useState, useRef, useEffect, ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SwiperProps {
  items: ReactNode[]
  cardWidth?: number
  cardGap?: number
  showNavigation?: boolean
  showPagination?: boolean
}

export function Swiper({
  items,
  cardWidth = 300,
  cardGap = 16,
  showNavigation = true,
  showPagination = true
}: SwiperProps) {
  const [currentPosition, setCurrentPosition] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const velocityRef = useRef(0)
  const [lastDiff, setLastDiff] = useState(0)
  const startYRef = useRef(0)
  const isHorizontalSwipeRef = useRef(false)

  // Calculate container width on mount and resize
  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    updateContainerWidth()
    window.addEventListener('resize', updateContainerWidth)

    return () => {
      window.removeEventListener('resize', updateContainerWidth)
    }
  }, [])

  // Calculate max scroll position
  const maxPosition = Math.max(0, (items.length * (cardWidth + cardGap)) - containerWidth)

  // Calculate how many items are visible
  const getVisibleItemsCount = () => {
    if (containerWidth === 0) return 1
    return Math.floor(containerWidth / (cardWidth + cardGap))
  }

  // Calculate pagination dots count
  const getPaginationCount = () => {
    const visibleItems = getVisibleItemsCount()
    return Math.max(1, Math.ceil(items.length / visibleItems))
  }

  // Prevent default scroll behavior during horizontal swipe
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isHorizontalSwipeRef.current) {
        e.preventDefault()
      }
    }

    // Add passive: false to allow preventDefault()
    document.addEventListener('touchmove', preventScroll, { passive: false })

    return () => {
      document.removeEventListener('touchmove', preventScroll)
    }
  }, [])

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartPosition(e.touches[0].clientX)
    startYRef.current = e.touches[0].clientY
    isHorizontalSwipeRef.current = false

    if (sliderRef.current) {
      sliderRef.current.style.transition = 'none'
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const diffX = currentX - startPosition
    const diffY = currentY - startYRef.current

    // Determine if this is primarily a horizontal swipe
    if (!isHorizontalSwipeRef.current) {
      const isHorizontal = Math.abs(diffX) > Math.abs(diffY)
      isHorizontalSwipeRef.current = isHorizontal
    }

    // Only process horizontal movement
    if (isHorizontalSwipeRef.current) {
      const newPosition = currentPosition + diffX

      // Constrain
      const constrainedPosition = Math.max(-maxPosition, Math.min(0, newPosition))

      // Save velocity (diff)
      velocityRef.current = diffX
      setLastDiff(diffX)

      setCurrentPosition(constrainedPosition)
      setStartPosition(currentX)

      if (sliderRef.current) {
        sliderRef.current.style.transform = `translateX(${constrainedPosition}px)`
      }
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    isHorizontalSwipeRef.current = false

    if (sliderRef.current) {
      sliderRef.current.style.transition = "transform 0.5s ease-out"
    }

    // Apply momentum only for horizontal swipes
    const momentum = velocityRef.current * 15 // multiplier = strength
    let newPosition = currentPosition + momentum

    // Constrain
    newPosition = Math.max(-maxPosition, Math.min(0, newPosition))

    setCurrentPosition(newPosition)

    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(${newPosition}px)`
    }

    // Reset velocity
    velocityRef.current = 0
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartPosition(e.clientX)
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'none'
    }

    // Add event listeners for mouse move and up
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const currentX = e.clientX
    const diff = currentX - startPosition
    const newPosition = currentPosition + diff

    // Constrain to boundaries
    const constrainedPosition = Math.max(-maxPosition, Math.min(0, newPosition))

    setCurrentPosition(constrainedPosition)
    setStartPosition(currentX)

    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(${constrainedPosition}px)`
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)

    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 0.3s ease-out'
    }

    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  // Navigation functions
  const scrollLeft = () => {
    const newPosition = Math.min(0, currentPosition + (cardWidth + cardGap))
    setCurrentPosition(newPosition)
  }

  const scrollRight = () => {
    const newPosition = Math.max(-maxPosition, currentPosition - (cardWidth + cardGap))
    setCurrentPosition(newPosition)
  }

  const canScrollLeft = currentPosition < 0
  const canScrollRight = currentPosition > -maxPosition

  // Calculate current slide index for pagination
  const currentSlide = Math.round(Math.abs(currentPosition) / (cardWidth + cardGap))

  return (
    <div className="relative">
      {/* Navigation buttons */}
      {showNavigation && canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background rounded-full p-2 shadow-md bg-white hover:bg-accent transition-all duration-200 opacity-90 hover:opacity-100"
          aria-label="Previous items"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {showNavigation && canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background rounded-full p-2 shadow-md bg-white hover:bg-accent transition-all duration-200 opacity-90 hover:opacity-100"
          aria-label="Next items"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <div
        ref={containerRef}
        className="overflow-hidden py-2"
      >
        <div
          ref={sliderRef}
          className={`flex ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} transition-transform duration-300 ease-out`}
          style={{
            gap: `${cardGap}px`,
            transform: `translateX(${currentPosition}px)`
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          {items.map((item, index) => (
            <div
              key={index}
              style={{ minWidth: `${cardWidth}px` }}
              className="transition-transform duration-300"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      {/* {showPagination && items.length > 0 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: getPaginationCount() }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const visibleItems = getVisibleItemsCount()
                const newPosition = -index * (cardWidth + cardGap) * visibleItems
                setCurrentPosition(Math.max(-maxPosition, Math.min(0, newPosition)))
              }}
              className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/30'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )} */}
    </div>
  )
}