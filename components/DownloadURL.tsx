import { useEffect, useState } from 'react'
import { Batch, dl } from '../pages/batch/[batchId]'
import { Loading } from './Loading'
import style from '../styles/Stream.module.scss'
import { same } from './same'

interface Download {
  host: string
  url: string
  videoType: string
  quality: string
}
interface DownloadButton {
  episodeId: number
}

interface RawData {
  title: string
  url: string
  anime: string
  download: Download[]
}
export const DownloadURL = (props: DownloadButton) => {
  const { episodeId } = props
  const [data, setData] = useState<Batch | 0 | null>(0)
  useEffect(() => {
    same.get<RawData>('/api/v2/download/' + episodeId)
      .then((v) => v.data)
      .then((v: RawData) => {
        return {
          title: v.title,
          thumb: '',
          download: v.download,
        }
      })
      .then(setData)
      .catch((e) => setData(null))
  }, [episodeId])
  if (data === 0)
    return (
      <div className={style.showLoading}>
        <Loading height="200px" />
      </div>
    )
  if (!data) return <div>Nothing Here</div>
  return <div className={style.show}>{dl(data)}</div>
}
