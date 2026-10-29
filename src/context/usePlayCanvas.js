import { useContext } from 'react'
import { PlayCanvasContext } from './PlayCanvasContext'

export function usePlayCanvas() {
  const context = useContext(PlayCanvasContext)
  if (!context) {
    throw new Error('usePlayCanvas must be used within a PlayCanvasProvider')
  }
  return context
}

