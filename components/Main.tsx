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
      <div
        style={{
          display: 'flex',
          marginTop: '50px',
          flexGrow: 1,
          height: 'calc(100% - 50px)',
        }}
      >
        {props.children}
      </div>
    </div>
  )
}

export default Main
