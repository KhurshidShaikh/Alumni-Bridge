import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectToken, selectCurrentUser } from '../store/selectors/userSelectors'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function AuthTest() {
  const token = useSelector(selectToken)
  const currentUser = useSelector(selectCurrentUser)
  const [testResult, setTestResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const testAuth = async () => {
    setIsLoading(true)
    setTestResult('')

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
      
      console.log('Testing auth with token:', token ? 'Token exists' : 'No token')
      console.log('Current user:', currentUser)
      
      const response = await fetch(`${backendUrl}/api/profile/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Response status:', response.status)
      
      const data = await response.json()
      console.log('Response data:', data)

      if (response.ok) {
        setTestResult(`✅ Auth Success: ${JSON.stringify(data, null, 2)}`)
      } else {
        setTestResult(`❌ Auth Failed (${response.status}): ${JSON.stringify(data, null, 2)}`)
      }
    } catch (error) {
      console.error('Auth test error:', error)
      setTestResult(`❌ Network Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>Authentication Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p><strong>Token:</strong> {token ? '✅ Present' : '❌ Missing'}</p>
          <p><strong>User:</strong> {currentUser?.name || '❌ No user'}</p>
          <p><strong>User ID:</strong> {currentUser?._id || '❌ No ID'}</p>
          <p><strong>Profile Complete:</strong> {currentUser?.isProfileComplete ? '✅ Yes' : '❌ No'}</p>
        </div>
        
        <Button onClick={testAuth} disabled={isLoading}>
          {isLoading ? 'Testing...' : 'Test API Authentication'}
        </Button>
        
        {testResult && (
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {testResult}
          </pre>
        )}
      </CardContent>
    </Card>
  )
}

export default AuthTest
