import { useState, useRef, useEffect, useCallback } from 'react'
import { PlayCanvasContext } from './PlayCanvasContext'

// Use the official iframeless PlayCanvas embed URL (/e/p/) so postMessages arrive
// directly in the PlayCanvas scene without being blocked by the /p/ wrapper
const DEFAULT_PLAYCANVAS_SRC = 'https://playcanv.as/e/p/3d344487/'

export function PlayCanvasProvider({ children, src = DEFAULT_PLAYCANVAS_SRC }) {
  const [activeContainer, setActiveContainer] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const iframeRef = useRef(null)

  // Ensure /e/p/ is used so that postMessage reaches the PlayCanvas scene
  const effectiveSrc = (src || DEFAULT_PLAYCANVAS_SRC).replace('playcanv.as/p/', 'playcanv.as/e/p/')

  const [rect, setRect] = useState({
    top: 0,
    left: -99999,
    width: 0,
    height: 0,
  })

  const registerContainer = useCallback((element) => {
    setActiveContainer(element)
  }, [])

  const unregisterContainer = useCallback(() => {
    setActiveContainer(null)
  }, [])

  const updateRect = useCallback(() => {
    if (!activeContainer) return
    if (!document.body.contains(activeContainer)) return

    const r = activeContainer.getBoundingClientRect()
    setRect((prev) => {
      if (
        prev.top === r.top &&
        prev.left === r.left &&
        prev.width === r.width &&
        prev.height === r.height
      ) {
        return prev
      }
      return {
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
      }
    })
  }, [activeContainer])

  useEffect(() => {
    if (!activeContainer) return

    const rafId = requestAnimationFrame(updateRect)
    const timeoutId = setTimeout(updateRect, 100)

    let observer = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        updateRect()
      })
      observer.observe(activeContainer)
    }

    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, true)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timeoutId)
      if (observer) observer.disconnect()
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [activeContainer, updateRect])

  const requestFullscreen = useCallback(() => {
    const el = iframeRef.current
    if (!el) return
    if (el.requestFullscreen) {
      el.requestFullscreen()
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen()
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen()
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen()
    }
  }, [])

  // Send postMessage to the PlayCanvas iframe
  const sendMessage = useCallback((message) => {
    if (!iframeRef.current?.contentWindow) {
      console.warn('[PlayCanvas] iframe is not ready to receive messages yet')
      return
    }

    try {
      iframeRef.current.contentWindow.postMessage(message, '*')

      // If wrapped in a nested frame, also target child window
      try {
        if (iframeRef.current.contentWindow[0]) {
          iframeRef.current.contentWindow[0].postMessage(message, '*')
        }
      } catch {
        // cross-origin
      }

      console.log('[PlayCanvas postMessage sent]:', message)
    } catch (err) {
      console.error('[PlayCanvas postMessage error]:', err)
    }
  }, [])

  // Listen for messages emitted from PlayCanvas
  useEffect(() => {
    const handleIncoming = (event) => {
      if (!event.data) return
      if (event.data === 'ready' || event.data?.type === 'PLAYCANVAS_READY' || event.data?.event === 'ready') {
        setIsLoaded(true)
      }
    }

    window.addEventListener('message', handleIncoming)
    return () => window.removeEventListener('message', handleIncoming)
  }, [])

  const isVisible = Boolean(activeContainer)

  // Clamp height to ensure iframe never overflows below viewport
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800
  const availableHeight = Math.max(0, viewportHeight - rect.top)
  const clampedHeight = availableHeight > 0 ? Math.min(rect.height, availableHeight) : rect.height

  // Upward visual offset to help center vanity vertically (PlayCanvas camera default focuses high on mirror)
  const verticalOffset = Math.min(35, rect.top)

  const iframeStyle = isVisible
    ? {
      position: 'fixed',
      top: `${rect.top - verticalOffset}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${clampedHeight + verticalOffset}px`,
      maxHeight: `${availableHeight + verticalOffset}px`,
      zIndex: 10,
      opacity: 1,
      pointerEvents: 'auto',
      border: 'none',
      transition: 'opacity 0.25s ease-in-out',
    }
    : {
      position: 'fixed',
      top: 0,
      left: '-99999px',
      width: '100vw',
      height: '100vh',
      zIndex: -999,
      opacity: 0,
      pointerEvents: 'none',
      border: 'none',
    }

  return (
    <PlayCanvasContext.Provider
      value={{
        registerContainer,
        unregisterContainer,
        requestFullscreen,
        sendMessage,
        isLoaded,
        activeContainer,
      }}
    >
      {children}

      {/* Persistent PlayCanvas iframe loaded on landing page in background */}
      <iframe
        ref={iframeRef}
        src={effectiveSrc}
        title="Furniture 3D Preview"
        style={iframeStyle}
        allow="fullscreen; xr-spatial-tracking"
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
      />
    </PlayCanvasContext.Provider>
  )
}
