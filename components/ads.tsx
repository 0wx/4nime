interface AdsProps {
  adsKey?: string
  height: number
  width: number
}

export const AdsTerra = (ads: AdsProps) => {
  const { height, width, adsKey } = ads
  if (adsKey) {
    return (
      <div
        style={{ height, width }}
        dangerouslySetInnerHTML={{
          __html: `<script type="text/javascript">
atOptions = {
  'key' : '${adsKey}',
  'format' : 'iframe',
  'height' : ${height},
  'width' : ${width},
  'params' : {}
};
document.write('<scr' +
 'ipt type="text/javascript" src="http'
  + (location.protocol === 'https:' ? 's' : '') 
  + '://www.effectiveperformanceformat.com/${adsKey}/invoke.js"></scr' 
  + 'ipt>');
</script>`,
        }}
      ></div>
    )
  }

  return (
    <div
      style={{
        height,
        width,
        border: '1px solid red',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        backgroundColor: 'white',
      }}
    >
      <span>
        {width} x {height}
      </span>
    </div>
  )
}
