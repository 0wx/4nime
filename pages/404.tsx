import { Bot } from '../components/BotButton'
import style from '../styles/404.module.scss'
import Head from 'next/head'

export default function Custom404() {
  return (
    <div className={style.patNolPat}>
      <Head>
        <title>404 - Tidak ada konten</title>
      </Head>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://c.tenor.com/GHSF-v48hVwAAAAd/anime-found.gif"
        alt="404"
        height="260"
      />
      <div className={style.title}>
        <h1>404</h1>
        <h2>Yg kamu cari ga ada bro.</h2>
        <Bot />
      </div>
    </div>
  )
}
