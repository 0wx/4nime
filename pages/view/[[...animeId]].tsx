import Router, { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Loading } from '../../components/Loading'
import Stream from '../../components/Stream'
import Custom404 from '../404'
import { antiWibu, getData, SanitizedData } from './[episodeId]'
import Main from '../../components/Main'
const Anime = () => {
  const router = useRouter()
  const { animeId } = router.query
  const [data, setData] = useState<SanitizedData | null | 0>(0)
  useEffect(() => {
    if (typeof animeId === 'object') {
      getData(animeId).then((result) => {
        if (result) {
          antiWibu(result)
            .then(setData)
            .catch((e) => setData(result))
        } else setData(result)
      })
    }
  }, [animeId])
  if (data) {
    const { title, next, prev, player, id, episode } = data
    return (
      <Main>
        <Stream
          player={player}
          title={title}
          next={next}
          prev={prev}
          setData={setData}
          animeId={animeId}
          episodeId={id}
          current={+episode}
        />
      </Main>
    )
  }

  if (data === 0) {
    return (
      <Main>
        <Loading />
      </Main>
    )
  }

  if (!data) {
    return (
      <Main>
        <Custom404 />
      </Main>
    )
  }
  if (typeof animeId === 'object') {
    return <div>{animeId}</div>
  }

  return (
    <Main>
      <Custom404 />
    </Main>
  )
}

export default Anime
