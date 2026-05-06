import { useBaseTransaction } from '../hooks/useBaseTransaction'
import { CheckCircle2 } from 'lucide-react'

export default function DailyCheckIn() {
  const { triggerBuilderTransaction, isPending, isSuccess } = useBaseTransaction()

  if (isSuccess) {
    return (
      <div className="glass-panel" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)' }}>
        <CheckCircle2 size={24} />
        <span style={{ fontWeight: '600' }}>Daily Check-In Complete!</span>
      </div>
    )
  }

  return (
    <div className="glass-panel" style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '500px' }}>
      <div>
        <h4 style={{ margin: 0, color: 'var(--color-text)' }}>Daily Check-In</h4>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Check in on Base to earn rewards!</p>
      </div>
      <button 
        className="premium-btn primary" 
        style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        onClick={() => triggerBuilderTransaction()}
        disabled={isPending}
      >
        {isPending ? 'Checking in...' : 'Check In'}
      </button>
    </div>
  )
}
