import { useState, useEffect } from 'react'
import { createInitialGrid, findMatches, applyGravity, GRID_SIZE } from '../game/GameEngine'
import type { TileData } from '../game/GameEngine'
import { useBaseTransaction } from '../hooks/useBaseTransaction'
import DailyCheckIn from './DailyCheckIn'

interface GameBoardProps {
  username: string
}

export default function GameBoard({ username }: GameBoardProps) {
  const [grid, setGrid] = useState<TileData[][]>(createInitialGrid())
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(30)
  const [level, setLevel] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [dragStartInfo, setDragStartInfo] = useState<{x: number, y: number} | null>(null)
  const [touchStartInfo, setTouchStartInfo] = useState<{x: number, y: number, screenX: number, screenY: number} | null>(null)
  const { triggerBuilderTransaction, isPending, isSuccess } = useBaseTransaction()

  // Resolve matches recursively
  useEffect(() => {
    if (isProcessing) return
    
    const resolveBoard = () => {
      const { matches, score: matchScore } = findMatches(grid)
      if (matches.size > 0) {
        setIsProcessing(true)
        setScore(s => s + matchScore)
        
        setTimeout(() => {
          setGrid(g => applyGravity(g, matches))
          setIsProcessing(false)
        }, 300) // Animation delay
      } else {
        // Check for level up
        if (score > level * 1000) {
          setLevel(l => l + 1)
          setMoves(m => m + 10)
        }
      }
    }
    resolveBoard()
  }, [grid, isProcessing, score, level])

  const handleTileDragStart = (x: number, y: number) => {
    if (isProcessing || moves <= 0) return
    setDragStartInfo({x, y})
  }

  const handleTileDrop = (targetX: number, targetY: number) => {
    if (!dragStartInfo || isProcessing || moves <= 0) return
    
    const startX = dragStartInfo.x
    const startY = dragStartInfo.y

    // Check if adjacent
    const isAdjacent = Math.abs(startX - targetX) + Math.abs(startY - targetY) === 1
    
    if (isAdjacent) {
      // Swap tiles
      const newGrid = [...grid.map(row => [...row])]
      const temp = newGrid[startY][startX]
      newGrid[startY][startX] = newGrid[targetY][targetX]
      newGrid[targetY][targetX] = temp
      
      // Update coordinates
      newGrid[startY][startX].x = startX
      newGrid[startY][startX].y = startY
      newGrid[targetY][targetX].x = targetX
      newGrid[targetY][targetX].y = targetY

      // Ensure swap results in a match
      const { matches } = findMatches(newGrid)
      if (matches.size > 0) {
        setGrid(newGrid)
        setMoves(m => m - 1)
      }
    }
    
    setDragStartInfo(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault() // Required to allow drop
  }

  const handleTouchStart = (e: React.TouchEvent, x: number, y: number) => {
    if (isProcessing || moves <= 0) return
    const touch = e.touches[0]
    setTouchStartInfo({ x, y, screenX: touch.clientX, screenY: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartInfo || isProcessing || moves <= 0) return
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartInfo.screenX
    const deltaY = touch.clientY - touchStartInfo.screenY

    if (Math.abs(deltaX) > 20 || Math.abs(deltaY) > 20) {
      let targetX = touchStartInfo.x
      let targetY = touchStartInfo.y

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        targetX += deltaX > 0 ? 1 : -1
      } else {
        // Vertical swipe
        targetY += deltaY > 0 ? 1 : -1
      }

      // Check bounds
      if (targetX >= 0 && targetX < GRID_SIZE && targetY >= 0 && targetY < GRID_SIZE) {
        setDragStartInfo({ x: touchStartInfo.x, y: touchStartInfo.y })
        // Need to simulate drop
        setTimeout(() => handleTileDrop(targetX, targetY), 0)
      }
    }
    setTouchStartInfo(null)
  }

  if (moves <= 0) {
    return (
      <div className="end-screen glass-panel">
        <h2>Game Over, {username}!</h2>
        <p>Final Score: {score}</p>
        <p>Level Reached: {level}</p>
        
        <div style={{ marginTop: '20px' }}>
          <button 
            className="premium-btn primary"
            onClick={() => triggerBuilderTransaction()}
            disabled={isPending || isSuccess}
          >
            {isPending ? 'Submitting...' : isSuccess ? 'Score Submitted!' : 'Submit Score on Base'}
          </button>
        </div>
        
        {isSuccess && <p style={{color: 'var(--color-primary)', marginTop: '10px'}}>Successfully tracked on Base using Builder Code!</p>}
        
        <button 
          className="premium-btn secondary"
          style={{ marginTop: '20px' }}
          onClick={() => {
            setGrid(createInitialGrid())
            setScore(0)
            setMoves(30)
            setLevel(1)
          }}
        >
          Play Again
        </button>
      </div>
    )
  }

  return (
    <div className="game-container">
      <DailyCheckIn />
      
      <div className="game-header">
        <div className="stat-box">
          <span className="stat-label">Level</span>
          <span className="stat-value">{level}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Score</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Moves</span>
          <span className="stat-value">{moves}</span>
        </div>
      </div>

      <div className="grid">
        {grid.map((row, y) => (
          row.map((tile, x) => (
            <div
              key={tile.id}
              className={`tile tile-type-${tile.type} ${tile.type === -1 ? 'empty' : ''}`}
              draggable={tile.type !== -1 && !isProcessing}
              onDragStart={() => handleTileDragStart(x, y)}
              onDrop={() => handleTileDrop(x, y)}
              onDragOver={handleDragOver}
              onTouchStart={(e) => handleTouchStart(e, x, y)}
              onTouchEnd={handleTouchEnd}
            />
          ))
        ))}
      </div>
    </div>
  )
}
