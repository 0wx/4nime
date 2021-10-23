import { Dispatch, SetStateAction, useState } from 'react'
import { Player, SanitizedData } from '../pages/view/[episodeId]'
import style from '../styles/Stream.module.scss'
import Link from 'next/link'
import Head from 'next/head'
import { Bot } from './BotButton'
interface Props {
  animeId?: string | string[]
  player: Player[]
  next: number | null
  prev: number | null
  title: string
  setData: Dispatch<SetStateAction<0 | SanitizedData | null>>
}

export default function Stream(props: Props) {
  const [server, selecServer] = useState(0)
  const { player, next, prev, title, setData, animeId } = props
  const isAnimeIdExist = typeof animeId === 'object'
  const Next =
    isAnimeIdExist && next ? (() =>
      <Link
        href="/view/[[...animeId]]"
        as={`/view/${animeId[0]}/${next}`}
        passHref
      >
        <button onClick={() => setData(0)}>Episode Selanjutnya</button>
      </Link>
    ) : next ? (() =>
      <Link href="/view/[episodeId]" as={`/view/${next}`} passHref>
        <button onClick={() => setData(0)}>Episode Selanjutnya</button>
      </Link>
    ) : null

  const Prev =
    isAnimeIdExist && prev ? (() =>
      <Link href="/view/[[...animeId]]" as={`/view/${animeId[0]}/${prev}`} passHref>
        <button onClick={() => setData(0)}>Episode Sebelumnya</button>
      </Link>
    ) : prev ? (() =>
      <Link href="/view/[episodeId]" as={`/view/${prev}`} passHref>
        <button onClick={() => setData(0)}>Episode Sebelumnya</button>
      </Link>
    ) : null
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <div
          className={style.stream}
          dangerouslySetInnerHTML={{ __html: player[server].url }}
        ></div>
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.nav}>
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
        </div>
        <Bot />
      </div>
    </div>
  )
}
