import { useState } from "react"
import { Player } from "../pages/view/[episodeId]"
import style from "../styles/Stream.module.scss"
import Link from "next/link"

interface Props {
  player: Player[]
  next: number | null
  prev: number | null
  title: string
}

const antiWibu = (url: string): string => {
  if (url.indexOf("wibuu.info") === -1) return url

  const blog = url.split("embed.php?url=")[1].split('"')[0]
  const tobeReplaced = `https://wibuu.info/stream/embed.php?url=${blog}`
  const replacedUrl = `https://same.yui.pw/api/embed/${encodeURIComponent(
    blog
  )}`
  return url.replace(tobeReplaced, replacedUrl)
}
export default function Stream(props: Props) {
  const [server, selecServer] = useState(0)
  const { player, next, prev, title } = props
  return (
    <div>
      <div>
        <div
          className={style.stream}
          dangerouslySetInnerHTML={{ __html: antiWibu(player[server].url) }}
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
        <div className={style.footer}>
          <a href="tg://samehadakuu_bot">
            <button className={style.bot}>Kembali Ke @samehadakuu_bot</button>
          </a>
        </div>
      </div>
    </div>
  )
}
