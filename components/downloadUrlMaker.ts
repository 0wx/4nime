export interface Download {
  host: string
  url: string
  videoType: string
  quality: string
}
export const downloadUrlMaker = (download: Download[]) => {
  const caps: Download[][][] = []

  for (const dl of download) {
    if (!caps.length) {
      caps.push([[dl]])
      continue
    }

    const indexQuality = caps.findIndex((listByType) => {
      return listByType.every((list) =>
        list.every(({ videoType }) => videoType === dl.videoType)
      )
    })

    if (indexQuality === -1) {
      caps.push([[dl]])
      continue
    }

    const indexType = caps[indexQuality].findIndex((list) => {
      return list.every(({ quality }) => quality === dl.quality)
    })

    if (indexType === -1) {
      caps[indexQuality].push([dl])
      continue
    }

    caps[indexQuality][indexType].push(dl)
  }

  return caps
}
