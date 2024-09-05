import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const getListReportUser = async ({ page = 1, pageSize = 10, userId }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Report/getListReportUser?Page=${page}&PageSize=${pageSize}&UserId=${userId}`)
  return response.data?.data
}
export const getListReportPost = async ({ userPostId = '', userPostPhotoId = '', userPostVideoId = '', groupPostId = '', groupPostVideoId = '', groupPostPhotoId = '',
  sharePostId = '', groupSharePostId = '', page = 1, pageSize = 10 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Report/getListReportPost?
    UserPostId=${userPostId}&UserPostPhotoId=${userPostPhotoId}&UserPostVideoId=${userPostVideoId}&GroupPostId=${groupPostId}&GroupPostVideoId=${groupPostVideoId}&
    GroupPostPhotoId=${groupPostPhotoId}&SharePostId=${sharePostId}&GroupSharePostId=${groupSharePostId}&Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}
export const getListReportGroup = async ({ page = 1, pageSize = 10, groupId }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Report/getListReportGroup?Page=${page}&PageSize=${pageSize}&GroupId=${groupId}`)
  return response.data?.data
}
export const getListReportComment = async ({ commentId = '', commentPhotoPostId = '', commentVideoPostId = '', commentGroupPostId = '', commentPhotoGroupPostId = '', commentGroupVideoPostId = '',
  commentSharePostId = '', commentGroupSharePostId = '', page = 1, pageSize = 10 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Report/getListReportComment?CommentId=${commentId}&CommentPhotoPostId=${commentPhotoPostId}&
    &CommentVideoPostId=${commentVideoPostId}&CommentGroupPostId=${commentGroupPostId}&CommentPhotoGroupPostId=${commentPhotoGroupPostId}&CommentGroupVideoPostId=${commentGroupVideoPostId}
    &CommentSharePostId=${commentSharePostId}&CommentGroupSharePostId=${commentGroupSharePostId}&
    Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}


export const getReportPost = async ({ page = 1, pageSize = 10 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Report/getReportPost?Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}
export const getReportGroup = async ({ page = 1, pageSize = 10 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Report/getReportGroup?Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}
export const getReportUser = async ({ page = 1, pageSize = 10 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Report/getReportUser?Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}
export const getReportComment = async ({ page = 1, pageSize = 10 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Report/getReportComment?Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}
export const deactiveUserByUserId = async (id) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserProfile/deactiveUserByUserId?UserId=${id}`)
  return response.data?.data
}
export const activeUserByUserId = async (id) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserProfile/activeUserByUserId?UserId=${id}`)
  return response.data?.data
}