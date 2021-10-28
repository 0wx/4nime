import { useEffect, useState } from 'react'
import { Batch } from '../pages/batch/[batchId]'
import { Loading } from './Loading'
import style from '../styles/Download.module.scss'
import { nanoid } from 'nanoid'
import { randomLightColor } from 'seed-to-color'
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

const parser = (batch: Batch) => {
  const result: any = {}
  batch.download.forEach((value) => {
    const { videoType, quality, host, url } = value
    if (result[videoType]) {
      if (result[videoType][quality]) {
        result[videoType][quality].push({ host, url })
      } else {
        result[videoType][quality] = [{ host, url }]
      }
    } else {
      result[videoType] = { [quality]: [{ host, url }] }
    }
  })
  return result
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

  return (
    <div className={style.show}>
      {Object.keys(parser(data)).map((byType) => {
        return (
          <div key={nanoid()} className={style.byType}>
            {' '}
            {/** Kotak gedi jobo */}
            <div className={style.title}>{byType}</div> {/** title 'MKV' */}
            <div className={style.byTypeWrapper}>
              {Object.keys(parser(data)[byType]).map((byQuality) => {
                return (
                  <div key={nanoid()} className={style.byQuality}>
                    <div className={style.title2}>{byQuality}</div>{' '}
                    {/** title '1080p' */}
                    <div className={style.content}>
                      {parser(data)[byType][byQuality].map(
                        ({ host, url }: { host: string; url: string }) => {
                          return (
                            <span key={nanoid()} className={style.downloadUrl}>
                              <a
                                style={{ color: `#${randomLightColor(host)}` }}
                                href={url}
                                tabIndex={1}
                                target={'_blank'}
                                rel="noreferrer"
                                onClick={(e) => {
                                  const clicked =
                                    document.createAttribute('style')
                                  e.currentTarget.attributes.setNamedItem(
                                    clicked
                                  )
                                }}
                              >
                                {host}
                              </a>
                            </span>
                          )
                        }
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
