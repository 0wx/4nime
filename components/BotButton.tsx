import { DownloadURL } from './DownloadURL'
import { useState } from 'react'
export interface BackToBot {
  episodeId?: number
}
export const Bot = (props: BackToBot) => {
  const [show, setShow] = useState<boolean>(false)
  return (
    <div>
      {props.episodeId && (
        <button onClick={() => setShow(v => !v)}>Lihat Download URL</button>
      )}
      {props.episodeId && show && <DownloadURL episodeId={props.episodeId} />}
      <a href="tg://resolve?domain=samehadakuu_bot">
        <button
          style={{
            backgroundColor: '#0088cc',
            padding: '15px 25px',
            color: '#eee',
            borderRadius: '25px',
            fontWeight: 'bold',
            border: 'none',
            cursor: ' pointer',
            margin: '20px 0'
          }}
        >
          Kembali Ke @samehadakuu_bot
        </button>
      </a>
    </div>
  )
}
