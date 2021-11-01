import { useState, useEffect, CSSProperties, LegacyRef } from 'react'
import { Loading } from './Loading'
import style from '../styles/Stream.module.scss'
import Link from 'next/link'
import { same } from './same'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideo } from '@fortawesome/free-solid-svg-icons'

interface Props {
  animeId: number
  current?: number
  list?: number[]
  style?: CSSProperties
  parentStyle?: CSSProperties
  find?: number
}

export const List = (props: Props) => {
  const { animeId, list } = props
  const [data, setData] = useState<number[] | null | 0>(props.list || 0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [ok, setOk] = useState<number>(0)
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

  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms))
  const selectRef = (i: number) => {
    if (i === props.current)
      return (e: HTMLDivElement) => {
        if (e && !ok) {
          setOk(1)
          wait(1000).then(() =>
            e.scrollIntoView({ behavior: 'smooth', block: 'center' })
          )
        }
      }

    return () => {}
  }
  return (
    <div style={props.parentStyle || {}} className={style.episodes}>
      {data
        .map((v) => +v)
        .sort((a, b) => b - a)
        .filter((v) => {
          if (!props.find) return v
          return v === props.find
        })
        .map((v, i) => {
          return (
            <Link
              key={i + 'eps'}
              href="/view/[[...animeId]]"
              as={`/view/${animeId}/${v}`}
              passHref
            >
              <div
                ref={selectRef(v)}
                style={props.style || {}}
                className={
                  v === props.current
                    ? style.epsCurrent
                    : i % 2
                    ? style.epsEven
                    : style.epsOdd
                }
              >
                Episode {v}{' '}
                {v === props.current ? (
                  <FontAwesomeIcon
                    style={{ cursor: 'pointer', marginLeft: '5px' }}
                    icon={faVideo}
                    size={'1x'}
                    color="#555"
                  />
                ) : (
                  ''
                )}
              </div>
            </Link>
          )
        })}
    </div>
  )
}
