import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { Loading } from '../../components/Loading'
import Custom404 from '../404'

const Stream = dynamic(() => import('../../components/Stream'))

export interface Player {
  title: string
  type: string
  url: string
}

export interface RawData {
  title: string
  url?: string
  prev?: string
  next?: string
  thumb: string
  download: string
  episode: string
  player: Player[]
  animeId: number
}

export interface SanitizedData {
  id: number
  title: string
  prev: number | null
  next: number | null
  thumb: string
  episode: number
  player: Player[]
  animeId: number
}

export interface InitialProps {
  data: SanitizedData | null
}

export const getId = (v: string | number | undefined) =>
  !v
    ? null
    : typeof v === 'number'
    ? Number(v)
    : +v.replace(/.+id=([0-9]+)/g, '$1')
export const getData = async (
  episodeId: number | string[]
): Promise<SanitizedData | null> => {
  try {
    if (!episodeId) throw new Error('Not a valid episodeId')
    const isArr = typeof episodeId === 'object'
    const url = isArr
      ? `https://same.yui.pw/api/v2/anime/${episodeId[0]}/${episodeId[1]}`
      : `https://same.yui.pw/api/v2/episode/${episodeId}`
    const response = await fetch(url)
    const data: RawData | null = await response.json()
    if (!data) throw new Error('Data is empty')
    const id: number = isArr ? getId(data.url!)! : +episodeId? episodeId : 0
    const { title, thumb, next, prev, episode, player, animeId } = data

    const result: SanitizedData = {
      id,
      title,
      thumb,
      next: getId(next),
      prev: getId(prev),
      episode: +episode,
      player,
      animeId,
    }

    return result
  } catch (error) {
    return null
  }
}
export const antiWibu = async (data: SanitizedData): Promise<SanitizedData> => {
  const isWibuThere = data.player.some(
    (player) => player.url.indexOf('wibuu.info') > -1
  )

  if (!isWibuThere) return data

  const newPlayer: Player[] = []

  await Promise.all(
    data.player.map(async (player) => {
      if (player.url.indexOf('wibuu.info') === -1) {
        newPlayer.push(player)
        return
      }
      const blog = player.url.split('embed.php?url=')[1].split('"')[0]
      const tobeReplaced = `https://wibuu.info/stream/embed.php?url=${blog}`
      const replacedUrl = `https://same.yui.pw/api/embed/${encodeURIComponent(
        blog
      )}`

      const response = await fetch(replacedUrl)
      const newUrl = await response.text()
      player.url = player.url.replace(tobeReplaced, newUrl)

      newPlayer.push(player)
    })
  )

  return { ...data, player: newPlayer }
}
const View = () => {
  const router = useRouter()
  const { episodeId } = router.query
  const [data, setData] = useState<SanitizedData | null | 0>(0)
  useEffect(() => {
    if (typeof episodeId === 'string') {
      getData(+episodeId).then((result) => {
        if (result) {
          if (result.animeId) {
            Router.push(`/view/${result.animeId}/${result.episode}`)
          }
          antiWibu(result)
            .then(setData)
            .catch((e) => setData(result))
        } else setData(result)
      })
    }
  }, [episodeId])
  if (data) {
    const { title, thumb, next, prev, episode, player } = data
    return (
      <Stream
        player={player}
        title={title}
        next={next}
        prev={prev}
        setData={setData}
        episodeId={data.id}
      />
    )
  }

  if (data === 0) {
    return <Loading />
  }

  if (!data) {
    return <Custom404 />
  }
}

export default View
