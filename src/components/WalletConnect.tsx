import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [showOptions, setShowOptions] = useState(false)

  if (isConnected) {
    return (
      <button
        className="premium-btn secondary"
        onClick={() => disconnect()}
      >
        {address?.slice(0, 6)}...{address?.slice(-4)} (Disconnect)
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>

      {!showOptions && (
        <button
          className="premium-btn primary"
          onClick={() => setShowOptions(true)}
        >
          Connect Wallet
        </button>
      )}

      {showOptions && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '15px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{ fontSize: '14px', marginBottom: '8px', color: '#ccc', textAlign: 'center' }}>
            Select a Wallet
          </p>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              className="premium-btn primary"
              style={{ width: '200px', fontSize: '14px' }}
              onClick={() => {
                connect({ connector })
                setShowOptions(false)
              }}
            >
              {connector.name}
              {isPending && '...'}
            </button>
          ))}
          <button
            style={{
              marginTop: '5px',
              background: 'none',
              border: 'none',
              color: '#ff4d4d',
              cursor: 'pointer',
              fontSize: '12px'
            }}
            onClick={() => setShowOptions(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
