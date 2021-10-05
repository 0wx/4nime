import style from "../styles/404.module.scss"
export default function Custom404() {
  return (
    <div className={style.patNolPat}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://c.tenor.com/GHSF-v48hVwAAAAd/anime-found.gif"
        alt="404"
        height="260"
      />
      <div className={style.title}>
        <h1>404</h1>
        <h2>Yg kamu cari ga ada bro.</h2>
        <div className={style.footer}>
          <a href="tg://resolve?domain=samehadakuu_bot">
            <button className={style.bot}>Kembali Ke @samehadakuu_bot</button>
          </a>
        </div>
      </div>
    </div>
  )
}
