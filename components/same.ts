import axios from 'axios'
export const same = axios.create({ baseURL: process.env.API_URL! })
