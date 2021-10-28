/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import Head from 'next/head'
import style from '../styles/Index.module.scss'
import Main from '../components/Main'
import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import Link from 'next/link'
import { randomLightColor } from 'seed-to-color'
import { Loading } from '../components/Loading'
import { same } from '../components/same'
export interface Data {
  url: string
  episode: string
  time: string
}

export interface LatestResult {
  title: string
  url: string
  img: string
  type: string
  score: string
  data: Data
}
export interface BatchResult {
  batchId: number
  title: string
  thumb: string
  animeType: string
}
export interface Latest {
  latest: LatestResult[]
  batch: BatchResult[]
}
const getData = async (): Promise<Latest | null> => {
  try {
    const response: Latest = (
      await same.get<Latest>('/api/v2/latest')
    ).data
    return response
  } catch (error) {
    return null
  }
}
const Home: NextPage = () => {
  const [data, setData] = useState<Latest | null>(null)
  useEffect(() => {
    getData().then(setData)
  }, [])
  return (
    <Main>
      <Head>
        <title>Samehadakuu</title>
        <meta
          name="description"
          content="Download Anime Subtitle Indonesia Favoritmu"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={style.container}>
        <div className={style.latest}>
          <div className={style.headerText}>Update Terbaru</div>
          <div className={style.latestWrapper}>
            {!data && <Loading head={null} height="200px" />}
            {data &&
              data.latest.map((v) => {
                if (!Number(v.url.split('id=')[1]) && !Number(v.data.episode))
                  return
                return (
                  <Link
                    href="/view/[[...animeId]]"
                    as={`/view/${v.url.split('id=')[1]}/${v.data.episode}`}
                    passHref
                    key={nanoid()}
                  >
                    <div
                      className={style.latestItem}
                      style={{
                        background: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${v.img})`,
                        backgroundSize: 'cover',
                      }}
                    >
                      <div className={style.infoItem}>
                        <div className={style.title}>
                          {v.title.slice(0, 55).trim() +
                            (v.title.length > 55 ? '...' : '')}{' '}
                          <span
                            style={{
                              backgroundColor: `#${randomLightColor(v.type)}`,
                            }}
                            className={style.type}
                          >
                            {v.type}
                          </span>
                        </div>
                        <div className={style.episode}>
                          <span
                            style={{
                              backgroundColor: `#${randomLightColor(
                                `Episode` + v.data.episode
                              )}`,
                            }}
                            className={style.epsNumber}
                          >
                            Episode {v.data.episode}
                          </span>
                        </div>
                        {v.score && (
                          <div className={style.score}>{v.score}</div>
                        )}
                      </div>
                      <div className={style.time}>{v.data.time}</div>
                    </div>
                  </Link>
                )
              })}
          </div>
        </div>
        <div className={style.batch}>
          <div className={style.headerText}>Batch Terbaru</div>
          <div className={style.batchWrapper}>
            {!data && <Loading head={null} height="200px" />}
            {data &&
              data.batch.map((v) => {
                return (
                  <Link
                    href="/batch/[batchId]"
                    as={`/batch/${v.batchId}`}
                    passHref
                    key={nanoid()}
                  >
                    <div
                      style={{
                        background: `linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3) ), url(${v.thumb})`,
                        backgroundSize: 'cover',
                      }}
                      className={style.batchItem}
                    >
                      <div className={style.title}>
                        <span className={style.titleWrapper}>{v.title}</span>
                        <span
                          style={{
                            backgroundColor: `#${randomLightColor(
                              v.animeType
                            )}`,
                          }}
                          className={style.type}
                        >
                          {v.animeType}
                        </span>
                        <span
                          style={{
                            backgroundColor: `#${randomLightColor('Batch')}`,
                          }}
                          className={style.type}
                        >
                          BATCH
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
          </div>
        </div>
      </div>
    </Main>
  )
}

export default Home
