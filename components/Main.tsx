import Navbar from './Navbar'
import Head from 'next/head'
interface Props {
  title?: string
  thumb?: string
  children: any
}
const Main = (props: any) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      {props.title && (
        <Head>{props.title && <title>{props.title}</title>}</Head>
      )}
      <Navbar />
      <div style={{ display: 'flex' }}>{props.children}</div>
    </div>
  )
}

export default Main
