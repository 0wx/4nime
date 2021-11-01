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
  episodeId?: number
  download?: Batch | null
}

interface RawData {
  title: string
  url: string
  anime: string
  download: Download[]
}

export const getDownloadURL = async(episodeId: number): Promise <Batch | null> => {
  try {
    const response = (await same
      .get<RawData>('/api/v2/download/' + episodeId)).data
    return {...response, thumb: '/logo-min.webp'}
      
  } catch (error) {
    return null
  }
}
export const DownloadURL = (props: DownloadButton) => {
  const { episodeId, download } = props
  const [data, setData] = useState<Batch | 0 | null>(download || 0)
  useEffect(() => {
    if(episodeId) getDownloadURL(episodeId)
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
