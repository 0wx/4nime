import { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react'
import { Player, SanitizedData } from '../pages/view/[[...animeId]]'
import style from '../styles/Stream.module.scss'
import Link from 'next/link'
import Head from 'next/head'
import { Bot } from './BotButton'
import { DownloadURL, getDownloadURL } from './DownloadURL'
import { List } from './EpisodeList'
import { Batch } from '../pages/batch/[batchId]'
import { Download } from './downloadUrlMaker'
import { getBatch } from '../pages/view/[animeId]'
import { DownloadURLBatch } from './DownloadURLBatch'
interface Props {
  animeId?: string | string[]
  episodeId: number
  current: number
  player: Player[]
  next: number | null
  prev: number | null
  title: string
}

class Get {
  list: string[]
  constructor() {
    this.list = []
  }

  get = (title: string) => {
    this.list.push(title)
    return this.list.filter((v) => v === title).length
  }
}
const acefile = /https:\/\/acefile.co\/f\/([0-9]+)\/?.+/i
const isAceFile = (v: Download) => acefile.test(v.url)
export default function Stream(props: Props) {
  const [show, setShow] = useState<boolean>(false)
  const [showEpisodes, setShowEpisodes] = useState<boolean>(false)
  const [showBatch, setShowBatch] = useState<boolean>(false)
  const [download, setDownload] = useState<Batch | null>(null)
  const [server, selectServer] = useState(0)
  const { player, next, prev, title, animeId, episodeId } = props
  const [streamPlayer, setStreamPlayer] = useState<Player[]>(player)
  const [epsFinder, searchEpisode] = useState<number>(0)
  const isAnimeIdExist = typeof animeId === 'object'
  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Getting Batch
    const tits = new Get()
    const onDownloadResponse = (dl: Batch | null) => {
      setDownload(dl)
      if (dl) {
        const newDl = dl.download
          .filter(isAceFile)
          .map((v) => {
            const idStream = v.url.replace(
              /https:\/\/acefile.co\/f\/([0-9]+)\/?.+/g,
              '$1'
            )
            const config =
              'FRAMEBORDER=0 MARGINWIDTH=0 MARGINHEIGHT=0 SCROLLING=NO WIDTH="100%" HEIGHT="100%" allowfullscreen="true"'

            const newStream = {
              type: 'schtml',
              title: `${v.host} ${v.quality}`,
              url: `<iframe src="https://acefile.co/player/${idStream}" ${config}></iframe>`,
            }

            return newStream
          })
          .sort((a, b): number => {
            if (a.title < b.title) {
              return -1
            }
            if (a.title > b.title) {
              return 1
            }
            return 0
          })
          .map((v) => {
            v.title = v.title.split(' ').join(` ${tits.get(v.title)} `)
            return v
          })
        setStreamPlayer((v) => [...v, ...newDl])
      }
    }
    getDownloadURL(episodeId).then(onDownloadResponse)
  }, [episodeId])
  const Next = isAnimeIdExist
    ? () => (
        <Link
          href="/view/[[...animeId]]"
          as={`/view/${animeId[0]}/${next}`}
          passHref
        >
          <button style={{ visibility: next ? 'visible' : 'hidden' }}>
            Episode Sebelumnya
          </button>
        </Link>
      )
    : () => (
        <Link href="/view/[episodeId]" as={`/view/${next}`} passHref>
          <button style={{ visibility: next ? 'visible' : 'hidden' }}>
            Episode Sebelumnya
          </button>
        </Link>
      )

  const Prev = isAnimeIdExist
    ? () => (
        <Link
          href="/view/[[...animeId]]"
          as={`/view/${animeId[0]}/${prev}`}
          passHref
        >
          <button style={{ visibility: prev ? 'visible' : 'hidden' }}>
            Episode Sebelumnya
          </button>
        </Link>
      )
    : () => (
        <Link href="/view/[episodeId]" as={`/view/${prev}`} passHref>
          <button style={{ visibility: prev ? 'visible' : 'hidden' }}>
            Episode Sebelumnya
          </button>
        </Link>
      )
  return (
    <div className={style.mainContainer}>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={style.streamContainer}>
        <div
          className={style.stream}
          dangerouslySetInnerHTML={{ __html: streamPlayer[server].url }}
        ></div>
      </div>
      <div className={style.navWrapper}>
        <div className={style.nav}>
          <div className={style.title}>{title}</div>
          <div className={style.button}>
            <div className={style.server}>
              <select
                className={style.selector}
                onChange={(e) => {
                  e.preventDefault()
                  selectServer(Number(e.target.value))
                }}
              >
                {streamPlayer &&
                  streamPlayer.map((value, index) => {
                    return (
                      <option
                        className={
                          server === index ? style.selected : style.nonselected
                        }
                        key={index}
                        value={index}
                        defaultValue={server === index ? index : index + 1}
                      >
                        {value.title}
                      </option>
                    )
                  })}
              </select>
            </div>
            <div className={prev ? style.navigation : style.navigationRight}>
              {Prev && <Prev />}
              {Next && <Next />}
            </div>
            <div className={style.downloadURL}>
              <button onClick={() => setShowBatch((v) => !v)}>
                {!showBatch ? 'Lihat Batch' : 'Tutup Batch'}
              </button>
              {showBatch && (
                <DownloadURLBatch
                  animeId={isAnimeIdExist ? +animeId[0] : null}
                />
              )}
              <button onClick={() => setShow((v) => !v)}>
                {!show ? 'Lihat Link Download' : 'Tutup Link Download'}
              </button>
              {show && download && <DownloadURL download={download} />}
              {show && !download && <DownloadURL episodeId={episodeId} />}
              <button
                onClick={() =>
                  setShowEpisodes((v) => {
                    if (v) searchEpisode(0)
                    return !v
                  })
                }
              >
                {!showEpisodes ? 'Lihat Semua Episode' : 'Tutup Semua Episode'}
              </button>
              {showEpisodes ? (
                <input
                  className={style.searchEpisode}
                  type="number"
                  placeholder="Masukan episode yang kamu cari..."
                  onChange={(e) => {
                    searchEpisode(+e.currentTarget.value)
                  }}
                />
              ) : (
                ''
              )}
              {isAnimeIdExist && showEpisodes && (
                <List
                  current={props.current}
                  find={epsFinder}
                  animeId={+animeId[0]}
                />
              )}
            </div>
          </div>
          <Bot />
        </div>
      </div>
    </div>
  )
}
