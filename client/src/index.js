// polyfills
import 'regenerator-runtime/runtime'
import 'whatwg-fetch'
import 'react-app-polyfill/ie9' // For IE 9-11 support
import Promise from 'bluebird'
import smoothscroll from 'smoothscroll-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {BrowserRouter} from 'react-router-dom'
import {dataProvidersConfig} from 'data-provider'
import './customBootstrap.css'
import App from './components/App'
import Loading from './components/Loading/Loading'
import {GoogleAnalyticsInitializer} from './utils'
import getConfiguredStore from './configureStore'
import {Provider} from 'react-redux'

window.Promise = Promise
smoothscroll.polyfill()

dataProvidersConfig({loadingComponent: <Loading />})

// a short-term fix for data-provider, should get fixed in next release
class DispatchProvider extends React.Component {
  static childContextTypes = {
    dispatch: PropTypes.func,
  }

  getChildContext() {
    return {dispatch: this.props.dispatch}
  }

  render() {
    return this.props.children
  }
}

const store = getConfiguredStore()
ReactDOM.render(
  <GoogleAnalyticsInitializer>
    <Provider store={store}>
      <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
        <DispatchProvider dispatch={store.dispatch}>
          <App />
        </DispatchProvider>
      </BrowserRouter>
    </Provider>
  </GoogleAnalyticsInitializer>,
  document.getElementById('root')
)
