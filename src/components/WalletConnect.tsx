import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <button 
        className="premium-btn secondary"
        onClick={() => disconnect()}
      >
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          className="premium-btn primary"
          onClick={() => connect({ connector })}
        >
          Connect {connector.name}
          {isPending && ' (connecting)'}
        </button>
      ))}
    </div>
  )
}
