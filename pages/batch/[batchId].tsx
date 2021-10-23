import style from '../../styles/Batch.module.scss'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Download, downloadUrlMaker } from '../../components/downloadUrlMaker'
import { Loading } from '../../components/Loading'
import Custom404 from '../404'
import { Bot } from '../../components/BotButton'
import Head from 'next/head'
interface Batch {
  title: string
  thumb: string
  download: Download[]
}

function xmur3(str: string) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
    (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
      (h = (h << 13) | (h >>> 19))
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return (h ^= h >>> 16) >>> 0
  }
}
function getRandomColor(seed: string) {
  const color = 'hsl(' + (xmur3(seed)() % 360) + ', 100%, 75%)'
  return color
}

export const dl = (data: Batch) =>
  downloadUrlMaker(data.download).map((listByType, index) => {
    return (
      <div key={`type${index}`} className={style.type}>
        <span className={style.typeTitle}>{listByType[0][0].videoType}</span>
        {listByType.map((listByQuality, index) => {
          return (
            <div key={`quality${index}`} className={style.quality}>
              <span className={style.qualityTitle}>
                [ {listByQuality[0].quality.trim()} ]
              </span>
              {listByQuality.map((v, index) => {
                return (
                  <span key={'url' + index} className={style.link}>
                    <a
                      style={{ color: getRandomColor(v.host) }}
                      href={v.url}
                      tabIndex={1}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        const clicked = document.createAttribute('style')
                        e.currentTarget.attributes.setNamedItem(clicked)
                      }}
                    >
                      {v.host}
                    </a>
                  </span>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  })
const Batch = () => {
  const [data, setData] = useState<Batch | 0 | null>(0)
  const router = useRouter()
  const batchId = Number(router.query?.batchId)

  useEffect(() => {
    if (batchId) {
      fetch(`https://same.yui.pw/x/batch/${batchId}`)
        .then((res) => res.json())
        .then(setData)
        .catch((_e) => {
          console.log(_e)
          setData(null)
        })
    }
  }, [batchId])
  if (typeof data === 'number') {
    return <Loading />
  }
  if (data === null) {
    return <Custom404 />
  }

  return (
    <div className={style.container}>
      <Head>
        <title>{data.title}</title>
      </Head>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={data.thumb} alt={data.title} />
      <h2 style={{ color: '#eee' }}>{data.title}</h2>
      <div className={style.url}>
        {dl(data)}
      </div>
      <Bot />
    </div>
  )
}

export default Batch
