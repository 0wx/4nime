import { TailSpin } from 'react-loading-icons'
import Head from 'next/head'
interface Props {
  height?: string
}
export const Loading = (props: Props) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: props.height || '90vh',
    }}
  >
    <Head>
      <title>Loading...</title>
    </Head>
    <TailSpin />
  </div>
)
