import * as React from 'react'
import {FullPageSpinner} from './components/lib'
import {selectUser, loginWithToken} from 'slices/authSlice'
import {useSelector, useDispatch} from 'react-redux'
import * as auth from 'auth-provider'

const AuthenticatedApp = React.lazy(() =>
  import(/* webpackPrefetch: true */ './authenticated-app'),
)
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'))

function App() {
  const user = useSelector(selectUser)
  const isLoading = useSelector(state => {
    const status = state.auth.status

    return status === 'idle' || status === 'loading'
  })
  const dispatch = useDispatch()

  const checkLogIn = async () => {
    const token = await auth.getToken()
    if (!token) {
      return
    }
    dispatch(loginWithToken(token))
  }

  React.useLayoutEffect(() => {
    checkLogIn()
  }, [])

  if (isLoading) {
    return <FullPageSpinner />
  }

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  )
}

export {App}
