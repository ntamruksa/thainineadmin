import '../styles/styles.scss'
import 'react-day-picker/lib/style.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import Page from '../components/Page'
import initAuth from '../initAuth'
const queryClient = new QueryClient()

initAuth()
function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Page>
        <Component {...pageProps} />
      </Page>
    </QueryClientProvider>
  )
}

export default MyApp
