import  { useState } from 'react'

export const Quota = () => {
const [quotaNumber, setQuotaNumber] = useState<number>()
    
    const quotaBase = async () => {
    const quota: StorageEstimate = await navigator.storage.estimate();
    setQuotaNumber((quota.usage! / quota.quota!) * 100)
  }
  quotaBase()

  return (
    <div style={{fontSize: '11px', padding: '10px'}}>Использовано ~{Math.floor(quotaNumber as number)}% хранилища</div>
  )
}
