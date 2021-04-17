import '../styles/styles.scss'
import 'react-day-picker/lib/style.css'
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import Page from '../components/Page'
import initAuth from '../initAuth'
const queryClient = new QueryClient()
Sentry.init({
  dsn: "https://03a2b91423254907b2a8d30fff1d5fa5@o563417.ingest.sentry.io/5723861",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

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
