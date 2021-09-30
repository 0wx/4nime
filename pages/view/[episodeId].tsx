import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

const Stream = dynamic(() => import("../../components/Stream"))

export interface Player {
  title: string
  type: string
  url: string
}

export interface RawData {
  title: string
  prev?: string
  next?: string
  thumb: string
  download: string
  episode: string
  player: Player[]
  comment: string
}

export interface SanitizedData {
  title: string
  prev: number | null
  next: number | null
  thumb: string
  episode: number
  player: Player[]
}

export interface InitialProps {
  data: SanitizedData | null
}

const getId = (v: string | undefined) =>
  v ? +v.replace(/.+id=([0-9]+)/g, "$1") : null
const getData = async (episodeId: number): Promise<SanitizedData | null> => {
  try {
    if (!episodeId) throw new Error("Not a valid episodeId")

    const url = `https://same.yui.pw/x/apk/?page=episode&id=${episodeId}`
    const response = await fetch(url)
    const data: RawData | null = await response.json()
    if (!data) throw new Error("Data is empty")

    const { title, thumb, next, prev, episode, player } = data

    const result: SanitizedData = {
      title,
      thumb,
      next: getId(next),
      prev: getId(prev),
      episode: +episode,
      player,
    }

    return result
  } catch (error) {
    return null
  }
}

const View = () => {
  const router = useRouter()
  const { episodeId } = router.query
  const [data, setData] = useState<SanitizedData | null | 0>(0)
  useEffect(() => {
    if (typeof episodeId === "string") {
      getData(+episodeId).then((result) => {
        setData(result)
      })
    }
  }, [episodeId])
  if (data) {
    const { title, thumb, next, prev, episode, player } = data
    return <Stream player={player} title={title} next={next} prev={prev} />
  }

  if (data === 0) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>404</div>
  }
}

export default View
