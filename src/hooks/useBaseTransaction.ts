import { useSendTransaction, useAccount } from 'wagmi'
import { parseEther } from 'viem'

// Encoded Builder String for code: bc_md0xlpyq
const BUILDER_STRING = "0x62635f6d6430786c7079710b0080218021802180218021802180218021"

export function useBaseTransaction() {
  const { address } = useAccount()
  const { sendTransaction, isPending, isSuccess, data, error } = useSendTransaction()

  // We do a zero-value self-transfer and append the builder string to the data payload
  // This satisfies the requirement of on-chain attribution while minimizing cost.
  const triggerBuilderTransaction = async () => {
    if (!address) return

    sendTransaction({
      to: '0x000000000000000000000000000000000000dead',
      value: parseEther('0'),
      data: BUILDER_STRING as `0x${string}`,
    })
  }

  return {
    triggerBuilderTransaction,
    isPending,
    isSuccess,
    txHash: data,
    error
  }
}
