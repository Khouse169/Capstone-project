import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'


export const getReportType = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Report/getreporttype`)
  return response.data?.data
}


export const createReportComment = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Report/createReportComment`, data)
  return response.data?.data
}
export const createReportPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Report/createReportPost`, data)
  return response.data?.data
}
export const createReportProfile = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Report/createReportProfile`, data)
  return response.data?.data
}

export const handleReport = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Report/processReport`, data)
  return response.data?.data
}


