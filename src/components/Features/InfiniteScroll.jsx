/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useEffect, useRef, useState } from 'react'
import LoadingSkeleton from './LoadingSkeleton'
const InfiniteScroll = ({ children, loadMore, hasMore, loading }) => {
  const observerTarget = useRef(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        
      },
      { threshold: 1.0 }
      
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [observerTarget])

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      (setTimeout(() => { loadMore()
        // codice da eseguire dopo 0,5 secondo
      }, 500))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting, hasMore, loading])

  return (
    <>

      {children}
      {hasMore && (
        <div ref={observerTarget} className="h-20 flex items-center justify-center mt-5 mb-5">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full ">
              {[1, 2, 3].map((n) => (
                <LoadingSkeleton key={n} type="card" />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default InfiniteScroll 