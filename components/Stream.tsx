import { useState } from 'react'
import { Player } from '../pages/view/[episodeId]'
import style from '../styles/Stream.module.scss'
import Link from 'next/link'
import Head from 'next/head'
import { Bot } from './BotButton'
interface Props {
  player: Player[]
  next: number | null
  prev: number | null
  title: string
}

export default function Stream(props: Props) {
  const [server, selecServer] = useState(0)
  const { player, next, prev, title } = props
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
            {prev && (
              <Link href="/view/[episodeId]" as={`/view/${prev}`} passHref>
                <button>Episode Sebelumnya</button>
              </Link>
            )}
            {next && (
              <Link href="/view/[episodeId]" as={`/view/${next}`} passHref>
                <button>Episode Selanjutnya</button>
              </Link>
            )}
          </div>
        </div>
        <Bot />
      </div>
    </div>
  )
}
