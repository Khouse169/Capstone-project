import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { store } from './redux/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import persistStore from 'redux-persist/es/persistStore'
import '~/css/style.css'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme.js'
import { CssBaseline } from '@mui/material'
import { ConfirmProvider } from 'material-ui-confirm'

const persistor = persistStore(store)


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store} >
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <CssVarsProvider >
          <ConfirmProvider defaultOptions={{
            allowClose: false,
            dialogProps: { maxWidth: 'xs' },
            titleProps: { fontWeight: '600' },
            buttonOrder: ['confirm', 'cancel'],
            cancellationButtonProps: { color: 'warning' },
            confirmationButtonProps: { color: 'primary', variant: 'contained' }
          }}>
            {/* <CssBaseline /> */}
            <App />
            <ToastContainer position="bottom-left" theme="dark" autoClose={2000} hideProgressBar limit={2} newestOnTop />
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
)
