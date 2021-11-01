import { TailSpin } from 'react-loading-icons'
import Head from 'next/head'
interface Props {
  height?: string
  head?: string | null | number
}
export const Loading = (props: Props) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: props.height || '90vh',
      width: '100%',
    }}
  >
    {typeof props.head === 'undefined' && (
      <Head>
        <title>{'Loading...'}</title>
      </Head>
    )}

    {typeof props.head === 'string' && (
      <Head>
        <title>{props.head}</title>
      </Head>
    )}
    <TailSpin />
  </div>
)
