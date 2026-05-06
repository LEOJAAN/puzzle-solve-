import { useState } from 'react'
import { useAccount } from 'wagmi'
import { base } from 'wagmi/chains'
import WalletConnect from './components/WalletConnect'
import NetworkGuard from './components/NetworkGuard'
import GameBoard from './components/GameBoard'
import './App.css'

function App() {
  const { isConnected, chain } = useAccount()
  const [username, setUsername] = useState('')
  const [isGameStarted, setIsGameStarted] = useState(false)

  const isBaseNetwork = chain?.id === base.id

  const handleStartGame = () => {
    if (isConnected && isBaseNetwork && username.trim()) {
      setIsGameStarted(true)
    }
  }

  return (
    <div className="app-container">
      <div className="background-decorations">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
      </div>
      
      <div className="content-wrapper glass-panel">
        <header className="app-header">
          <h1>Base Match-3</h1>
          <div className="header-actions">
            <WalletConnect />
          </div>
        </header>

        <main className="app-main">
          {!isConnected && (
            <div className="onboarding-section">
              <h2>Welcome to Base Match-3</h2>
              <p>Connect your wallet to start playing on the Base network.</p>
              <div className="onboarding-actions">
                <WalletConnect />
              </div>
            </div>
          )}

          {isConnected && !isBaseNetwork && (
            <NetworkGuard />
          )}

          {isConnected && isBaseNetwork && !isGameStarted && (
            <div className="onboarding-section">
              <h2>Ready to play?</h2>
              <div className="input-group">
                <label htmlFor="username">Enter your username:</label>
                <input 
                  type="text" 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Player123"
                  className="premium-input"
                />
              </div>
              <button 
                className="premium-btn primary"
                onClick={handleStartGame}
                disabled={!username.trim()}
              >
                Start Game
              </button>
            </div>
          )}

          {isConnected && isBaseNetwork && isGameStarted && (
            <GameBoard username={username} />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
