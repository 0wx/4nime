/* eslint-disable @next/next/no-img-element */
import style from '../styles/Home.module.scss'
import {
  useRef,
  useState,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  RefObject,
} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { nanoid } from 'nanoid'
import { randomLightColor } from 'seed-to-color'
import Router from 'next/router'
export interface Data {
  genre: string[]
  type: string
  score: string
}

export interface SearchResult {
  id: number
  title: string
  url: string
  img: string
  data: Data
  nonce: string
}

class SearchTool {
  last: number
  setData: Dispatch<SetStateAction<SearchResult[] | undefined>>
  constructor(setData: Dispatch<SetStateAction<SearchResult[] | undefined>>) {
    this.last = 0
    this.setData = setData
  }
  update = (data: SearchResult[], time: number): void => {
    if (time > this.last) {
      this.setData(data)
      this.last = time
    }
  }
  search = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const time = Date.now()
    const query = encodeURIComponent(e.target.value)

    try {
      const response: SearchResult[] = await (
        await fetch('https://same.yui.pw/api/v2/search/' + query)
      ).json()

      this.update(response, time)
    } catch (e: any) {
      this.update([], time)
    }
  }
}
export const SerachIcon = () => (
  <FontAwesomeIcon icon={faSearch} size={'1x'} color="#eee" />
)
export const CloseIcon = () => (
  <FontAwesomeIcon icon={faTimes} size={'1x'} color="#eee" />
)

const Navbar = () => {
  const [show, setShow] = useState<boolean>(false)
  const [data, setData] = useState<SearchResult[]>()
  const searchTool = new SearchTool(setData)

  const SearchResult = (props: { data: SearchResult[] }) => {
    return (
      <div className={style.searchResult}>
        <div style={{ pointerEvents: 'all' }}>
          {props.data.map((v) => {
            return (
              <div
                key={nanoid()}
                className={style.result}
                onClick={() => {
                  setData([])
                  setShow(false)
                  Router.push('/view/' + v.id + '/1')
                }}
              >
                <img src={v.img} alt={v.title} width="100px" height="100%" />

                <div className={style.detail}>
                  <div className={style.title}>
                    {v.title}
                    <span
                      style={{
                        backgroundColor: `#${randomLightColor(v.data.type)}`,
                        color: `#474747`,
                      }}
                      className={style.type}
                    >
                      {v.data.type}
                    </span>
                  </div>
                  <div className={style.genre}>
                    {v.data.genre.map((x) => {
                      return (
                        <span key={nanoid()} className={style.tag}>
                          {x}
                        </span>
                      )
                    })}
                  </div>
                  <div className={style.score}>⭐ {v.data.score}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={style.containerBox}>
      <div className={style.mainNav}>
        <div className={style.nav}>
          <img src="https://i.postimg.cc/PqnH93sL/logo-min.webp" alt="logo" />

          <div className={style.searchBox}>
            {show && (
              <div className={style.searchInput}>
                <input autoFocus type="text" onChange={searchTool.search} />
              </div>
            )}

            <button
              onClick={() => {
                if (show) setData([])
                setShow(!show)
              }}
            >
              {show ? <CloseIcon /> : <SerachIcon />}
            </button>
          </div>
        </div>
      </div>
      <div className={style.searchContainer}>
        {data && <SearchResult data={data} />}
      </div>
    </div>
  )
}

export default Navbar
