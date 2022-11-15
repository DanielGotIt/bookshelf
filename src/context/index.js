import * as React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {ReactQueryConfigProvider} from 'react-query'
import {Provider} from 'react-redux'
import {store} from 'store'
import {AuthProvider} from './auth-context'

const queryConfig = {
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
    retry(failureCount, error) {
      if (error.status === 404) return false
      else if (failureCount < 2) return true
      else return false
    },
  },
}

function AppProviders({children}) {
  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <Router>
        <AuthProvider>
          <Provider store={store}>{children}</Provider>
        </AuthProvider>
      </Router>
    </ReactQueryConfigProvider>
  )
}

export {AppProviders}
