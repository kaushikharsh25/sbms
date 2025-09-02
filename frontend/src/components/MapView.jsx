import { useEffect, useRef } from 'react'

// Placeholder map container. Integrate Google/Mapbox later.
export default function MapView({ points = [] }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    // In future: initialize map SDK here
  }, [])
  return (
    <div className="border rounded h-80 w-full flex items-center justify-center" ref={ref}>
      <div className="text-gray-500 text-sm">Map placeholder ({points.length} points)</div>
    </div>
  )
}


