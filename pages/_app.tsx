import '../styles/globals.scss'
import type { AppProps } from 'next/app'

import NProgress from 'nprogress'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import * as gtag from '../components/gtag'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url)
      // NProgress.done()
    }
    router.events.on('routeChangeStart', () => {
      // NProgress.start()
    })
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
