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
        {downloadUrlMaker(data.download).map((listByType, index) => {
          return (
            <div key={`type${index}`} className={style.type}>
              <span className={style.typeTitle}>
                {listByType[0][0].videoType}
              </span>
              {listByType.map((listByQuality, index) => {
                return (
                  <div key={`quality${index}`} className={style.quality}>
                    <span className={style.qualityTitle}>
                      [ {listByQuality[0].quality.trim()} ]
                    </span>
                    {listByQuality.map((v, index) => {
                      return (
                        <span key={'url' + index} className={style.link}>
                          <a href={v.url}>{v.host}</a>
                        </span>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
      <Bot />
    </div>
  )
}

export default Batch
