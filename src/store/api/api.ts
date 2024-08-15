import axios from 'axios'
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API

export const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})