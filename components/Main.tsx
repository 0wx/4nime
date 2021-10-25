import Navbar from './Navbar'
const Main = (props: any) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
      }}
    >
      <Navbar />
      <div style={{ display: 'flex', flexGrow: 1 }}>{props.children}</div>
    </div>
  )
}

export default Main
