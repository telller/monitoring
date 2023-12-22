import { useStore } from '../src/store/index'
import { MainLayout } from 'components'
import { Provider } from 'react-redux'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'
import 'styles/globals.scss'
import 'styles/antd.scss'

dayjs.extend(utc)
dayjs.extend(tz)

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
