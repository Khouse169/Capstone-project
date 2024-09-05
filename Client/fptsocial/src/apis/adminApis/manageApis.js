import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const getDataForAdmin = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Admin/getDataForAdmin`)
  return response.data?.data
}
export const getAllUserForAdmin = async ({ page, pageSize = 10 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Admin/getAllUserForAdmin?Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}
export const getAllGroupForAdmin = async ({ page, pageSize = 10 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Admin/getAllGroupForAdmin?Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}
export const getNumberUserByDayForAdmin = async ({ page, pageSize = 10 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Admin/getNumberUserByDayForAdmin?Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}
