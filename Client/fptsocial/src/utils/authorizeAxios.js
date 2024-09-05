import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { JWT_TOKEN } from './constants'

const jwtToken = JWT_TOKEN
let authorizedAxiosInstance = axios.create({
  // withCredentials: true
})

// function getCookie(name) {
//   const cookies = document.cookie.split(';');
//   for (let i = 0; i < cookies.length; i++) {
//     let cookie = cookies[i].trim();
//     if (cookie.startsWith(name + '=')) {
//       return cookie.substring(name.length + 1);
//     }
//   }
//   return null
// }

// const X_XSRF_TOKEN = getCookie('XSRF-TOKEN')

// max request time: 10 minutes
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// authorizedAxiosInstance.defaults.headers.common['X-XSRF-TOKEN'] = `${X_XSRF_TOKEN}`
authorizedAxiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + jwtToken
// authorizedAxiosInstance.defaults.withCredentials = true;
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Do something before request is sent
  interceptorLoadingElements(true)
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  interceptorLoadingElements(false)
  if (error.response?.status === 401) {
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }
  let errorMessage = error.errorMessage
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  // except 410 refresh token
  if (errorMessage.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance