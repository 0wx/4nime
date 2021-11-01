import { useEffect, useState } from 'react'
import { Batch, dl } from '../pages/batch/[batchId]'
import { Loading } from './Loading'
import style from '../styles/Stream.module.scss'
import { same } from './same'
import { getBatch } from '../pages/view/[animeId]'

interface Download {
  host: string
  url: string
  videoType: string
  quality: string
}
interface DownloadButton {
  animeId: number | null
  download?: Batch | null
}

interface RawData {
  title: string
  url: string
  anime: string
  download: Download[]
}
interface BatchId {
  batch: number | null
}

export const DownloadURLBatch = (props: DownloadButton) => {
  const { animeId, download } = props
  const [data, setData] = useState<Batch | 0 | null>(download || 0)
  useEffect(() => {
    if (animeId)
      getBatch(animeId)
        .then((batchId) => {
          if (!batchId) throw new Error()
          same
            .get<Batch>(`/x/batch/${batchId}`)
            .then((res) => res.data)
            .then(setData)
            .catch((e) => setData(null))
        })
        .catch((e) => setData(null))
  }, [animeId])
  if (data === 0)
    return (
      <div className={style.showLoading}>
        <Loading head={null} height="20px" />
      </div>
    )
  if (!data) return <p style={{ textAlign: 'center' }}>Belum ada Batch</p>
  return <div className={style.show}>{dl(data)}</div>
}
