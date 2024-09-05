import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT, SEARCH_TYPE } from '~/utils/constants'
// export const getAllPost = async () => {
//   const response = await authorizedAxiosInstance.get(`${API_ROOT_FAKE_DATA}/products`)
//   return response.data
// }


export const checkUserExist = async () => {
  // console.log(token, 'checkUserExist');
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/checkuserexist`)
  return response.data
}


export const searchFriendByName = async ({ accUserId, userId, search }) => {
  // console.log(token, 'checkUserExist');
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Search/searchfriendbyname?AccessUserId=${accUserId}&UserId=${userId}&FindName=${search}`)
  return response.data?.data
}

export const getUserByNumber = async (userNumber) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getuserbynumber?UserNumber=${userNumber}`)
  return response.data?.data
}

export const getUserByUserId = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getuserbyuserid`)
  return response.data?.data
}

export const getOtherUserByUserId = async ({ userId, viewUserId }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getotheruserbyuserid?UserId=${userId}&ViewUserId=${viewUserId}`)
  return response.data?.data
}

export const getInterest = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserEntitiesDetail/getinterest`)
  return response.data?.data
}

export const getGender = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserEntitiesDetail/getgender`)
  return response.data?.data
}

export const getStatus = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserEntitiesDetail/getstatus`)
  return response.data?.data
}

export const getRelationships = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Relationship/getrelationship`)
  return response.data?.data
}

export const getListSettings = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserEntitiesDetail/getsettings`)
  return response.data?.data
}

export const getUserSettings = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserEntitiesDetail/getusersettings`)
  return response.data?.data
}

export const getButtonFriend = async (userId, friendId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getbuttonfriend?UserId=${userId}&FriendId=${friendId}`)
  return response.data?.data
}

export const updateFriendStatus = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserRelationship/friendstatus`, data)
  return response.data?.data
}

export const updateSettings = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserRelationship/updatesettings`, data)
  return response.data?.data
}

export const createUserChat = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Chat/createuserchat`, data)
  return response.data?.data
}
export const updateUserChat = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Chat/updateuserchat`, data)
  return response.data?.data
}


export const createAccount = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/FptAccount/createaccount`, data)
  return response.data?.data
}
export const resetPassword = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/FptAccount/resetpassword`, data)
  return response.data?.data
}
export const createByLogin = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserProfile/createbylogin`, data)
  return response.data?.data
}

export const createAdminProfile = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Admin/createadminprofile`, data)
  return response.data?.data
}
export const updateUserProfile = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserProfile/updateprofile`, data)
  return response.data?.data
}

export const sendFriend = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserRelationship/sendfriend`, data)
  return response.data?.data
}

//user profile
export const getAllFriend = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getallfriend`)
  return response.data?.data
}
export const getAllFriendOtherProfile = async (viewUserId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getallfriendotherprofile?ViewUserId=${viewUserId}`)
  return response.data?.data
}
export const suggestionFriend = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/suggestionfriend`)
  return response.data?.data
}
export const getAllFriendRequest = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getallfriendrequest`)
  return response.data?.data
}
export const getButtonSendMessage = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getbuttonsendmessage?ViewOtherId=${id}`)
  return response.data?.data
}
export const getAllYourFriendRequested = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getallfriendrequested`)
  return response.data?.data
}
export const blockUser = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserProfile/blockuser`, data)
  return response.data?.data
}
export const cancelBlockUser = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserProfile/cancelblockuser`, data)
  return response.data?.data
}
export const getBlockedUserList = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getlistuserisblocked`)
  return response.data?.data
}

export const getImageByUserId = async ({ userId, type = SEARCH_TYPE.ALL, page = 1, strangerId }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getImageByUserId?UserId=${userId}&Type=${type}&Page=${page}&StrangerId=${strangerId}`)
  return response.data?.data
}
export const getVideoByUserId = async ({ userId, page = 1, strangerId }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getVideoByUserId?UserId=${userId}&StrangerId=${strangerId}&Page=${page}`)
  return response.data?.data
}

// file upload
export const uploadImage = async ({ userId, data }) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UploadFile/uploadImage?userId=${userId}`, data)
  return response.data
}
export const uploadVideo = async ({ userId, data }) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UploadFile/uploadVideo?userId=${userId}`, data)
  return response.data
}


//search api
export const searchAll = async ({ search, type = SEARCH_TYPE.ALL, page = 1, pageSize = 10 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Search/searchAll?SearchContent=${search}&Type=${type}&Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}
export const updateReadNotification = async (id) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/api/Notifications/UpdateNotificationStatusbynotificationid?NotificationId=${id}`)
  return response.data?.data
}


//chat
export const getChatDetailById = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Chat/getchatdetailbyid?ChatId=${id}`)
  return response.data?.data
}

//noti
export const getNotificationsListByUserId = async ({ page = 1, pageSize = 10 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Notifications/getnotificationslistbyuserid?Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}

export const createGender = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserEntitiesDetail/creategender`, data)
  return response.data?.data
}
export const createInterest = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserEntitiesDetail/createinterest`, data)
  return response.data?.data
}
export const createGroupType = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/GroupEntity/creategrouptype`, data)
  return response.data?.data
}

