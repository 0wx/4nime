/* eslint-disable @next/next/no-img-element */
import style from '../styles/Home.module.scss'
import { useState, ChangeEvent, Dispatch, SetStateAction } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { nanoid } from 'nanoid'
import { randomLightColor } from 'seed-to-color'
import Link from 'next/link'
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
  search = async (e: ChangeEvent<HTMLInputElement> | string): Promise<void> => {
    const time = Date.now()
    const query = encodeURIComponent(typeof e === 'string' ? e : e.target.value)

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
  <FontAwesomeIcon
    style={{ cursor: 'pointer' }}
    icon={faSearch}
    size={'1x'}
    color="#eee"
  />
)
export const CloseIcon = () => (
  <FontAwesomeIcon
    style={{ cursor: 'pointer' }}
    icon={faTimes}
    size={'1x'}
    color="#eee"
  />
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
              <Link
                key={nanoid()}
                href="/view/[animeId]"
                as={`/view/${v.id}`}
                passHref
              >
                <div
                  className={style.result}
                  onClick={() => {
                    setData([])
                    // setShow(false)
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
              </Link>
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
          <Link key={nanoid()} href="/index" as={`/`} passHref>
            <img
              style={{ cursor: 'pointer' }}
              src="https://i.postimg.cc/PqnH93sL/logo-min.webp"
              alt="logo"
            />
          </Link>

          <div className={style.searchBox}>
            {show && (
              <div className={style.searchInput}>
                <input
                  autoFocus
                  onFocus={(e) => {
                    if (!!e.currentTarget.value) {
                      searchTool.search(e.currentTarget.value)
                    }
                  }}
                  type="text"
                  onChange={searchTool.search}
                />
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