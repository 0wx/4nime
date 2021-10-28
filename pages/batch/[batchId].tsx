import style from '../../styles/Batch.module.scss'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Download, downloadUrlMaker } from '../../components/downloadUrlMaker'
import { Loading } from '../../components/Loading'
import Custom404 from '../404'
import { Bot } from '../../components/BotButton'
import Main from '../../components/Main'
import { nanoid } from 'nanoid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowRestore, faTimes } from '@fortawesome/free-solid-svg-icons'
import { same } from '../../components/same'
export interface Batch {
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

interface ToolBarRef {
  ref: HTMLDivElement | null
  key: string
  show: boolean
}
export class ToolBar {
  list: ToolBarRef[]
  divs: ToolBarRef[]
  constructor() {
    this.list = []
    this.divs = []
  }

  add = (key: string) => {
    return (ref: HTMLDivElement | null) => {
      this.list.push({ key, ref, show: true })
    }
  }
  addDiv = (key: string) => {
    return (ref: HTMLDivElement | null) => {
      this.divs.push({ key, ref, show: true })
    }
  }

  toogle = (key: string) => {
    const index = this.list.findIndex((v) => v.key === key)
    if (index === -1) return () => {}
    return () => {
      this.list[index].show = !this.list[index].show
      this.list[index].ref!.style.display = this.list[index].show
        ? 'block'
        : 'none'
    }
  }
  close = (key: string) => {
    const indexDiv = this.divs.findIndex((v) => v.key === key)
    if (indexDiv === -1) return () => {}
    return () => {
      this.divs[indexDiv].show = !this.divs[indexDiv].show
      this.divs[indexDiv].ref!.style.display = this.divs[indexDiv].show
        ? 'block'
        : 'none'
    }
  }
}
export const dl = (data: Batch) => {
  const tool = new ToolBar()
  return downloadUrlMaker(data.download).map((listByType, index) => {
    const key = nanoid()
    return (
      <div ref={tool.addDiv(key)} key={`type${index}`} className={style.byType}>
        <div className={style.titleWrapper}>
          <div className={style.title} onClick={() => tool.toogle(key)()}>
            {listByType[0][0].videoType
              .split(' ')
              .filter((v) => !data.title.split(' ').some((x) => x === v))}
          </div>
          <span onClick={() => tool.toogle(key)()}>
            <FontAwesomeIcon
              style={{ cursor: 'pointer' }}
              icon={faWindowRestore}
              size={'1x'}
            />
          </span>
          <span onClick={() => tool.close(key)()}>
            <FontAwesomeIcon
              style={{ cursor: 'pointer' }}
              icon={faTimes}
              size={'1x'}
            />
          </span>
        </div>
        <div ref={tool.add(key)} className={style.byTypeWrapper}>
          {listByType.map((listByQuality, index) => {
            return (
              <div key={`quality${index}`} className={style.byQuality}>
                <div className={style.title2}>
                  {listByQuality[0].quality.trim()}
                </div>
                <div className={style.content}>
                  {listByQuality.map((v, index) => {
                    return (
                      <span key={'url' + index} className={style.downloadUrl}>
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
              </div>
            )
          })}
        </div>
      </div>
    )
  })
}
const Batch = () => {
  const [data, setData] = useState<Batch | 0 | null>(0)
  const router = useRouter()
  const batchId = Number(router.query?.batchId)

  useEffect(() => {
    if (batchId) {
      same
        .get<Batch>(`/x/batch/${batchId}`)
        .then((res) => res.data)
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
    <Main title={data.title}>
      <div className={style.container}>
        <div className={style.containerWrapper}>
          <div className={style.info}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.thumb} alt={data.title} />
            <h2 className={style.infoTitle} style={{ color: '#eee' }}>
              {data.title}
            </h2>
            <Bot />
          </div>
          <div className={style.url}>{dl(data)}</div>
        </div>
      </div>
    </Main>
  )
}

export default Batch
