import { CurrencyContext } from '../../context/CurrencyContext'
import { useContext } from 'react'

export const useCurrencyContext = () => {
  const context = useContext(CurrencyContext)

  if (!context) {
    throw Error('useCurrencyContext must be used inside an CurrencyContextProvider')
  }

  return context
}