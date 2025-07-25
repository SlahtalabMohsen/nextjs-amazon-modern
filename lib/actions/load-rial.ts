import useSettingStore from '@/hooks/use-setting-store'

// This is a utility function to ensure the Rial currency is available to the app
export function ensureRialCurrency() {
  // Check if we have the IRR currency in the available currencies
  const { setting, setSetting } = useSettingStore.getState()
  const { availableCurrencies } = setting
  
  // Check if Rial currency exists
  const rialExists = availableCurrencies.some(c => c.code === 'IRR')
  
  // If Rial doesn't exist, add it
  if (!rialExists) {
    const newCurrencies = [
      ...availableCurrencies,
      { 
        name: 'Iranian Rial', 
        code: 'IRR', 
        symbol: 'ریال', 
        convertRate: 100000 
      }
    ]
    
    // Update the store with the new currencies
    setSetting({
      ...setting,
      availableCurrencies: newCurrencies
    })
    
    console.log('Added Rial currency to available currencies')
  }
}

// Use this on client-side to initialize Rial
export function initializeRial() {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      ensureRialCurrency()
    }, 1000) // Wait for store to be initialized
  }
}
