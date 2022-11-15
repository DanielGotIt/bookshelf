import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import {createRoot} from 'react-dom/client'
import {Profiler} from 'components/profiler'
import {App} from './app'
import {AppProviders} from './context'
import {store} from 'store'
import {Provider} from 'react-redux'

loadDevTools(() => {
  createRoot(document.getElementById('root')).render(
    <Profiler id="App Root" phases={['mount']}>
      <AppProviders>
        <Provider store={store}>
          <App />
        </Provider>
      </AppProviders>
    </Profiler>,
  )
})
