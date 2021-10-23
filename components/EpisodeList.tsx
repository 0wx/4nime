import { useState, useEffect } from 'react'
import { Loading } from './Loading'
import style from '../styles/Stream.module.scss'
import Link from 'next/link'

interface Props {
  animeId: number
  current: number
}
export const List = (props: Props) => {
  const { animeId } = props
  const [data, setData] = useState<Array<string> | null | 0>(0)
  useEffect(() => {
    fetch('https://same.yui.pw/api/v2/anime/' + animeId)
      .then((data) => data.json())
      .then(setData)
      .catch(() => setData(null))
  }, [animeId])
  if (data === 0) return <Loading height="20px" />
  if (!data) return <div>Nothing here</div>
  return (
    <div className={style.episodes}>
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
