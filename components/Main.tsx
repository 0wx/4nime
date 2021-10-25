import Navbar from './Navbar'
const Main = (props: any) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Navbar />
      <div style={{ display: 'flex' }}>{props.children}</div>
    </div>
  )
}

export default Main
