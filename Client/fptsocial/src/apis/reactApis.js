import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

//user react
export const getAllReactType = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactType`)
  return response.data?.data
}

export const getReactPostDetail = async ({ postType, postId, reactName, page = 1, userId }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getReactPostDetail?PostType=${postType}&PostId=${postId}&ReactName=${reactName}&PageNumber=${page}&UserId=${userId}`)
  return response.data?.data
}
export const getReactCommentPostDetail = async ({ commentType, commentId, reactName, page = 1, userId }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getReactCommentPostDetail?CommentType=${commentType}&CommentId=${commentId}&ReactName=${reactName}&PageNumber=${page}&UserId=${userId}`)
  return response.data?.data
}

export const getAllReactByPostId = async (id, page = 1) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByPostId?UserPostId=${id}&PageNumber=${page}`)
  return response.data?.data
}
export const getAllReactBySharePostId = async (id, page = 1) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactBySharePostId?SharePostId=${id}&PageNumber=${page}`)
  return response.data?.data
}
export const getAllReactByPhotoPostId = async (id, page = 1) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByPhotoPostId?UserPostPhotoId=${id}&PageNumber=${page}`)
  return response.data?.data
}
export const getAllReactByVideoPostId = async (id, page = 1) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByVideoPostId?UserPostVideoId=${id}&PageNumber=${page}`)
  return response.data?.data
}

export const getAllReactByCommentId = async (id, page = 1) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByCommentId?CommentId=${id}&PageNumber=${page}`)
  return response.data?.data
}
export const getAllReactByCommentSharePostId = async (id, page = 1) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByCommentSharePostId?CommentSharePostId=${id}&PageNumber=${page}`)
  return response.data?.data
}
export const getAllReactByCommentVideoId = async (id, page = 1) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByCommentVideoId?CommentVideoPostId=${id}&PageNumber=${page}`)
  return response.data?.data
}
export const getAllReactByCommentPhotoId = async (id, page = 1) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserReact/getAllReactByCommentPhotoId?CommentPhotoPostId=${id}&PageNumber=${page}`)
  return response.data?.data
}


export const createReactPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactPost`, data)
  return response.data?.data
}
export const createReactSharePost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactSharePost`, data)
  return response.data?.data
}

export const createReactPhotoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactPhotoPost`, data)
  return response.data?.data
}

export const createReactVideoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactVideoPost`, data)
  return response.data?.data
}

export const createReactCommentUserPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactCommentUserPost`, data)
  return response.data?.data
}
export const createReactCommentSharePost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactCommentSharePost`, data)
  return response.data?.data
}
export const createReactCommentUserPhotoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactCommentUserPhotoPost`, data)
  return response.data?.data
}
export const createReactCommentUserVideoPost = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserReact/createReactCommentUserVideoPost`, data)
  return response.data?.data
}
