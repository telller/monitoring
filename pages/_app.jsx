import { useStore } from '../src/store/index'
import { MainLayout } from 'components'
import { Provider } from 'react-redux'
import 'styles/globals.scss'
import 'styles/antd.scss'

const App = ({ Component, pageProps }) => {
  const store = useStore(pageProps.initialReduxState)

  return (
    <Provider store={store}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </Provider>
  )
}

export default App
