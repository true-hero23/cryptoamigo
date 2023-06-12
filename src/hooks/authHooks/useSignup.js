import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const signup = async (email, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('https://crypto-amigo-api.onrender.com/api/user/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(<div>
        <p>{json.error}. Contain:</p>
        <ul>
          <li>At least 8 characters length</li>
          <li>At least 1 number (0...9)</li>
          <li>At least 1 lowercase letter (a...z)</li>
          <li>At least 1 uppercase letter (A...Z)</li>
          <li>At least 1 special symbol (!...$)</li>
        </ul>
      </div>)
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // update the auth context
      dispatch({type: 'LOGIN', payload: json})

      // update loading state
      setIsLoading(false)
    }
  }

  return { signup, isLoading, error }
}