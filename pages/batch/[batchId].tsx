import style from "../../styles/Batch.module.scss"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Download, downloadUrlMaker } from "../../components/downloadUrlMaker"

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
    if (batchId)
      fetch(`https://same.yui.pw/x/batch/${batchId}`)
        .then((res) => res.json())
        .then(setData)
        .catch((_e) => setData(null))
    else setData(null)
  }, [batchId])

  if (data === 0) return <div>Loading...</div>
  if (data === null) return <div>404</div>

  return (
    <div className={style.container}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={data.thumb} alt={data.title} />
      <h2 style={{ color: "#eee" }}>{data.title}</h2>
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
                        <span key={"url" + index} className={style.link}>
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
    </div>
  )
}

export default Batch
