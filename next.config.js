/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  target: "serverless",
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://t.me/samehadakuu_bot', // Matched parameters can be used in the destination
        permanent: true,
      }]
    }
}
