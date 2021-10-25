import { Dispatch, SetStateAction, useState } from 'react'
import { Player, SanitizedData } from '../pages/view/[episodeId]'
import style from '../styles/Stream.module.scss'
import Link from 'next/link'
import Head from 'next/head'
import { Bot } from './BotButton'
import { DownloadURL } from './DownloadURL'
import { List } from './EpisodeList'
interface Props {
  animeId?: string | string[]
  episodeId: number
  current: number
  player: Player[]
  next: number | null
  prev: number | null
  title: string
  setData: Dispatch<SetStateAction<0 | SanitizedData | null>>
}

export default function Stream(props: Props) {
  const [show, setShow] = useState<boolean>(false)
  const [showEpisodes, setShowEpisodes] = useState<boolean>(false)
  const [server, selecServer] = useState(0)
  const { player, next, prev, title, setData, animeId, episodeId } = props
  const isAnimeIdExist = typeof animeId === 'object'
  const Next =
    isAnimeIdExist && next
      ? () => (
          <Link
            href="/view/[[...animeId]]"
            as={`/view/${animeId[0]}/${next}`}
            passHref
          >
            <button onClick={() => setData(0)}>Episode Selanjutnya</button>
          </Link>
        )
      : next
      ? () => (
          <Link href="/view/[episodeId]" as={`/view/${next}`} passHref>
            <button onClick={() => setData(0)}>Episode Selanjutnya</button>
          </Link>
        )
      : null

  const Prev =
    isAnimeIdExist && prev
      ? () => (
          <Link
            href="/view/[[...animeId]]"
            as={`/view/${animeId[0]}/${prev}`}
            passHref
          >
            <button onClick={() => setData(0)}>Episode Sebelumnya</button>
          </Link>
        )
      : prev
      ? () => (
          <Link href="/view/[episodeId]" as={`/view/${prev}`} passHref>
            <button onClick={() => setData(0)}>Episode Sebelumnya</button>
          </Link>
        )
      : null
  return (
    <div className={style.mainContainer}>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={style.streamContainer}>
        <div
          className={style.stream}
          dangerouslySetInnerHTML={{ __html: player[server].url }}
        ></div>
      </div>
      <div className={style.navWrapper}>
        <div className={style.nav}>
          <div className={style.title}>{title}</div>
          <div className={style.button}>
            <div className={style.server}>
              {player &&
                player.map((value, index) => {
                  return (
                    <button key={index} onClick={() => selecServer(index)}>
                      {value.title}
                    </button>
                  )
                })}
            </div>
            <div className={prev ? style.navigation : style.navigationRight}>
              {Prev && <Prev />}
              {Next && <Next />}
            </div>
            <div className={style.downloadURL}>
              <button onClick={() => setShow((v) => !v)}>
                {!show ? 'Lihat Link Download' : 'Tutup Link Download'}
              </button>
              {show && <DownloadURL episodeId={episodeId} />}
              <button onClick={() => setShowEpisodes((v) => !v)}>
                {!showEpisodes ? 'Lihat Semua Episode' : 'Tutup Semua Episode'}
              </button>
              {isAnimeIdExist && showEpisodes && (
                <List current={props.current} animeId={+animeId[0]} />
              )}
            </div>
          </div>
          <Bot />
        </div>
      </div>
    </div>
  )
}
