import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const getGroupByGroupId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Group/getgroupbygroupid?GroupId=${id}`)
  return response.data?.data
}

export const suggestionGroup = async ({ userId, showAll = true }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/suggestionGroup?UserId=${userId}&ShowAll=${showAll}`)
  return response.data?.data
}
export const searchGroupPost = async ({ groupId, search, page = 1, pageSize = 10 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Search/searchGroupPost?GroupId=${groupId}&SearchString=${search}&Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}
export const getGroupType = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/GroupEntity/getgrouptype`)
  return response.data?.data
}
export const getListFriendInvited = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Group/getlistfriendinvated?GroupId=${id}`)
  return response.data?.data
}
export const getListMemberGroup = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Group/getlistmemberingroup?GroupId=${id}`)
  return response.data?.data
}
export const getImageInGroup = async ({ groupId, page = 1 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Group/getImageInGroup?GroupId=${groupId}&Page=${page}`)
  return response.data?.data
}
export const getVideoInGroup = async ({ groupId, page = 1 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Group/getVideoInGroup?GroupId=${groupId}&Page=${page}`)
  return response.data?.data
}

export const getGroupStatusForCreate = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/GroupEntity/getgroupstatusforcreate`)
  return response.data?.data
}

export const getGroupStatus = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/GroupEntity/getgroupstatus`)
  return response.data?.data
}

export const getGroupByUserId = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Group/getgroupbyuserid`)
  return response.data?.data
}

export const getRequestJoin = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Group/getrequestjoin?GroupId=${id}`)
  return response.data?.data
}


export const invitesFriend = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Group/InvatedFriend`, data)
  return response.data?.data
}
export const requestJoinGroup = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Group/requestjoingroup`, data)
  return response.data?.data
}
export const cancelRequestJoin = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Group/cancelrequesttojoin`, data)
  return response.data?.data
}
export const leftGroup = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Group/lefttothegroup`, data)
  return response.data?.data
}


//admin apis get
export const getGroupSettingByGroupId = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Group/getgroupsettingbyid?GroupId=${id}`)
  return response.data?.data
}
export const getListMemberByRole = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Group/getlistmemberrole?GroupId=${id}`)
  return response.data?.data
}
export const getGroupRole = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/GroupEntity/getgrouprole`)
  return response.data?.data
}
export const getInvitedGroup = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getinvatedgroup`)
  return response.data?.data
}
export const getGroupPostIdPendingByGroupId = async ({ groupId, page = 1, pageSize = 10 }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/GroupPost/getGroupPostIdPendingByGroupId?GroupId=${groupId}&Page=${page}&PageSize=${pageSize}`)
  return response.data?.data
}



//admin apis post
export const createGroup = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Group/creategroup`, data)
  return response.data?.data
}
export const memberJoinStatus = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Group/memberjoinstatus`, data)
  return response.data?.data
}
export const updateGroupSetting = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Group/updategroupsetting`, data)
  return response.data?.data
}
export const updateGroupInformation = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Group/updategroupinformation`, data)
  return response.data?.data
}
export const updateOrRemoveMember = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Group/updateorremovemember`, data)
  return response.data?.data
}
export const deleteGroup = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/Group/deletegroup`, data)
  return response.data?.data
}
