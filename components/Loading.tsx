import { TailSpin } from 'react-loading-icons'
import Head from 'next/head'
export const Loading = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '90vh',
    }}
  >
    <Head>
      <title>Loading...</title>
    </Head>
    <TailSpin />
  </div>
)
