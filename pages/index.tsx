import type { NextPage } from 'next'
import Head from 'next/head'
import { Bot } from '../components/BotButton'
import styles from '../styles/Home.module.scss'
import Main from '../components/Main'

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
    const response: Latest = await (
      await fetch('https://same.yui.pw/api/v2/latest')
    ).json()
    return response
  } catch (error) {
    return null
  }
}
const Home: NextPage = () => {
  return (
    <Main>
      <div>
        <Head>
          <title>Samehadakuu</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className={styles.container}>
          <Bot />
        </div>
      </div>
    </Main>
  )
}

export default Home
