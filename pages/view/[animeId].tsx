/* eslint-disable @next/next/no-img-element */
import style from '../../styles/Anime.module.scss'
import { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import Main from '../../components/Main'
import Custom404 from '../404'
import { Loading } from '../../components/Loading'
import AnimeEpisode from './[[...animeId]]'
import { randomLightColor } from 'seed-to-color'
import { nanoid } from 'nanoid'
import { List } from '../../components/EpisodeList'
import Head from 'next/head'
import { ThreeDots } from 'react-loading-icons'
import Link from 'next/link'
export type RequestType = 'anime' | 'episode'
export interface RequestData {
  id: number
  type: RequestType
}

export interface LatestEpisode {
  episode: boolean
  url: string
}

export interface Genre {
  name: string
  link: string
}

export interface Season {
  name: string
  link: string
}

export interface AnimeInfo {
  title: string
  cover: string
  img: string
  type: string
  duration: string
  latest_episode: LatestEpisode
  released: string
  status: string
  score: string
  genre: Genre[]
  season: Season[]
  synopsis: string
  data: number[]
}

export interface Player {
  title: string
  type: string
  url: string
}

export interface EpisodeInfo {
  title: string
  next: string
  prev: string
  thumb: string
  download: string
  episode: string | null
  player: Player[]
  animeId: number
}

interface Episode {
  type: 'episode'
  data: EpisodeInfo
}
interface Anime {
  type: 'anime'
  data: AnimeInfo
}
const getdata = async (props: RequestData): Promise<Anime | Episode | null> => {
  try {
    const { id, type } = props
    const response: AnimeInfo | EpisodeInfo = await (
      await fetch(
        `https://same.yui.pw/api/v2/${type === 'anime' ? 'info' : type}/${id}`
      )
    ).json()
    if (type === 'anime') {
      const result: Anime = {
        type,
        data: response as AnimeInfo,
      }
      return result
    } else {
      const result: Episode = {
        type,
        data: response as EpisodeInfo,
      }
      return result
    }
  } catch (error) {
    return null
  }
}

interface BatchResponse {
  batch: number | null
}
const getBatch = async (id: number): Promise<number | null> => {
  try {
    const response = await fetch('https://same.yui.pw/api/v2/getbatch/' + id)
    const data: BatchResponse = await response.json()
    return data.batch
  } catch (error) {
    return null
  }
}
const AnimeId = () => {
  const [data, setData] = useState<Anime | Episode | null | 0>(0)
  const [batchId, setBatchId] = useState<number | null | 0>(0)
  const { query } = useRouter()
  const { animeId } = query

  useEffect(() => {
    if (animeId && typeof animeId === 'string' && Number(animeId) && animeId) {
      getdata({ type: 'anime', id: +animeId })
        .then((result) => {
          if (!result) return getdata({ type: 'episode', id: +animeId })
          setData(result)
          return
        })
        .then((result) => {
          if (result && result.type === 'episode') {
            if (Number(result.data.episode)) {
              Router.push(`/view/${result.data.animeId}/${result.data.episode}`)
              setData(0)
              return
            }
            setData(result)
            return
          }
        })
        .catch((e) => setData(null))
        .finally(() => {
          getBatch(+animeId).then(setBatchId)
        })
    }
  }, [animeId])
  if (data && data.type === 'episode' && typeof animeId === 'string') {
    return <AnimeEpisode animeId={animeId} />
  }
  if (data && data.type === 'anime' && typeof animeId === 'string') {
    const { cover, img, title, type, synopsis, released, score } = data.data
    const genre = data.data.genre ? data.data.genre.map((v) => v.name) : []
    const season = data.data.season ? data.data.season.map((v) => v.name) : []
    const episodes = data.data.data
      ? data.data.data.filter(Number).sort((a, b) => b - a)
      : []
    const info = [
      { key: 'Genre', value: genre.join(', ') },
      { key: 'Season', value: season.join(', ') },
      { key: 'Rilis', value: released },
      { key: 'Score', value: score },
    ]
    return (
      <Main>
        <Head>
          <title>{title}</title>
        </Head>
        <div className={style.container}>
          <div className={style.header}>
            <div className={style.coverWrapper}>
              <div className={style.coverWrapperWrapper}>
                <img
                  className={style.cover}
                  src={img || cover}
                  alt={title}
                  width={'auto'}
                />
                <div className={style.info}>
                  {info
                    .filter((v) => !!v.value)
                    .map((v) => {
                      return (
                        <div className={style.infoList} key={nanoid()}>
                          <div className={style.key}>{v.key}</div>
                          <div className={style.infoDetail}>{v.value}</div>
                        </div>
                      )
                    })}
                  <div className={style.infoList} key={nanoid()}>
                    <div className={style.key}>Batch</div>
                    <div className={style.infoDetail}>
                      {batchId === 0 ? (
                        <ThreeDots height={'6px'} />
                      ) : !batchId ? (
                        'Belum ada batch'
                      ) : (
                        <Link
                          href="/batch/[batchId]"
                          as={`/batch/${batchId}`}
                          passHref
                        >
                          <button className={style.downloadBatchButton}>Download Batch</button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.episodeListWrapper}>
                <div className={style.key}>Daftar</div>
                <List
                  animeId={+animeId}
                  list={episodes}
                  parentStyle={{
                    height: '300px',
                    border: '1px solid grey',
                    marginTop: '5px',
                  }}
                  style={{
                    fontSize: '12px',
                    padding: '7px',
                    border: '1px solid grey',
                  }}
                />
              </div>
            </div>
            <div className={style.detail}>
              <div className={style.title}>
                {title}
                <span
                  style={{ backgroundColor: `#${randomLightColor(type)}` }}
                  className={style.type}
                >
                  {type}
                </span>
              </div>
              <div className={style.synopsis}>
                <div className={style.key}>Synopsis:</div>
                {synopsis}
              </div>
            </div>
          </div>
        </div>
      </Main>
    )
  }
  if (data === 0)
    return (
      <Main>
        <Loading />
      </Main>
    )
  return (
    <Main>
      <Custom404 />
    </Main>
  )
}

export default AnimeId
