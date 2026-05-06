import { http, createConfig } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { injected, metaMask, safe } from 'wagmi/connectors'

// We include mainnet to allow detection of mainnet to prompt switching,
// but our primary chain is base.
export const wagmiConfig = createConfig({
  chains: [base, mainnet],
  connectors: [
    injected(),
    metaMask(),
    safe(),
  ],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
})
