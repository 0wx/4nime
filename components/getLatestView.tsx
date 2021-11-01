export interface LatestView {
  title: string
  animeId: number
  episode: number
  time?: number
}
export const latestViewVar = 'latestView'
export const update = (newData: LatestView[]) => {
  localStorage.setItem(latestViewVar, JSON.stringify(newData.slice(0, 10)))
  return newData
}
export const getList = (): LatestView[] => {
  const latestView = localStorage.getItem(latestViewVar)
  if (latestView) {
    try {
      const data: LatestView[] = JSON.parse(latestView)
      return data
    } catch (error) {
      return []
    }
  }

  return []
}

const satuMenit = 60000
const satuJam = satuMenit * 60
const satuHari = satuJam * 24
const satuBulan = satuHari * 30
const satuTahun = satuBulan * 12

export const timeParser = (time: number) => {
  const now = Date.now()
  const selangWaktu = now - time
  if (selangWaktu < satuMenit) return 'baru saja'

  if (selangWaktu < satuJam)
    return `${(selangWaktu / satuMenit).toFixed(0)} menit yang lalu`

  if (selangWaktu < satuHari)
    return `${(selangWaktu / satuJam).toFixed(0)} jam yang lalu`

  if (selangWaktu < satuBulan)
    return `${(selangWaktu / satuHari).toFixed(0)} hari yang lalu`

  if (selangWaktu < satuTahun)
    return `${(selangWaktu / satuBulan).toFixed(0)} bulan yang lalu`

  return `${(selangWaktu / satuJam).toFixed(0)} tahun yang lalu`
}
export const addList = (props: LatestView): LatestView[] => {
  const data = getList()
  const time = Date.now()
  props.time = time

  if (!data) {
    localStorage.setItem(latestViewVar, JSON.stringify([props]))
    return []
  }

  const animeIndex = data.findIndex((v) => v.animeId === props.animeId)
  if (animeIndex > -1) {
    return update([props, ...data.filter((_v, i) => i !== animeIndex)])
  } else {
    return update([props, ...data])
  }
}

export const remove = (animeId: number | string): LatestView[] => {
  const id = +animeId
  const data = getList()
  if (!data) return []

  return update(data.filter((v) => v.animeId !== id))
}

export const removeAll = () => localStorage.setItem(latestViewVar, '[]')
