import { useSwitchChain } from 'wagmi'
import { base } from 'wagmi/chains'

export default function NetworkGuard() {
  const { switchChain, isPending } = useSwitchChain()

  return (
    <div className="network-guard glass-panel">
      <h3>Wrong Network Detected</h3>
      <p>You are currently on an unsupported network, such as Ethereum mainnet. Please switch to Base network to continue playing.</p>
      <button 
        className="premium-btn primary"
        onClick={() => switchChain({ chainId: base.id })}
        disabled={isPending}
      >
        {isPending ? 'Switching...' : 'Switch to Base'}
      </button>
    </div>
  )
}
