export const darkTheme = (toogle?: boolean): boolean => {
  if (typeof toogle !== 'undefined') {
    localStorage.setItem('dark', toogle ? '1' : '0')
    return toogle
  }
  const theme = localStorage.getItem('dark')
  if (!theme) {
    localStorage.setItem('dark', '1')
    return true
  }

  return !!Number(theme)
}
