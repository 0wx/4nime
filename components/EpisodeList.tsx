import { useState, useEffect, CSSProperties } from 'react'
import { Loading } from './Loading'
import style from '../styles/Stream.module.scss'
import Link from 'next/link'
import { same } from './same'

interface Props {
  animeId: number
  current?: number
  list?: number[]
  style?: CSSProperties
  parentStyle?: CSSProperties
}
export const List = (props: Props) => {
  const { animeId, list } = props
  const [data, setData] = useState<number[] | null | 0>(props.list || 0)
  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!list)
      same
        .get<number[]>('/api/v2/anime/' + animeId)
        .then((data) => data.data)
        .then(setData)
        .catch(() => setData(null))
  }, [animeId, list])

  if (data === 0) return <Loading height="40px" />
  if (!data) return <div>Nothing here</div>
  return (
    <div style={props.parentStyle || {}} className={style.episodes}>
      {data
        .map((v) => +v)
        .sort((a, b) => b - a)
        .map((v, i) => {
          return (
            <Link
              key={i + 'eps'}
              href="/view/[[...animeId]]"
              as={`/view/${animeId}/${v}`}
              passHref
            >
              <div
                style={props.style || {}}
                className={
                  v === props.current
                    ? style.epsCurrent
                    : i % 2
                    ? style.epsOdd
                    : style.epsEven
                }
              >
                Episode {v}
              </div>
            </Link>
          )
        })}
    </div>
  )
}
