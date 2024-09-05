let apiRoot = ""
let frontendRoot = ""
let clientId = ""
// dev environment
if (process.env.BUILD_MODE === "dev") {
  // apiRoot = "https://localhost:44329"
  apiRoot = "https://api.fptsocial.com"
  frontendRoot = "http://localhost:3000"
  clientId = "societe-front-end-dev"
}
// dev environment preview
if (process.env.BUILD_MODE === "dev_preview") {
  apiRoot = "https://api.fptsocial.com"
  frontendRoot = "https://fptsocial.com"
  clientId = "societe-front-end"
}
// deploy environment
if (process.env.BUILD_MODE === "production") {
  apiRoot = "https://api.fptsocial.com"
  frontendRoot = "https://14.225.210.40:3000"
  clientId = "societe-front-end"
}

const jwtToken = JSON.parse(window.sessionStorage.getItem(`oidc.user:https://feid.ptudev.net:${clientId}`))?.access_token

const userId = JSON.parse(window.sessionStorage.getItem(`oidc.user:https://feid.ptudev.net:${clientId}`))?.profile.userId
export const JWT_PROFILE = JSON.parse(window.sessionStorage.getItem(`oidc.user:https://feid.ptudev.net:${clientId}`))?.profile
export const API_ROOT = apiRoot
export const FRONTEND_ROOT = frontendRoot
export const CLIENT_ID = clientId
export const JWT_TOKEN = jwtToken
export const USER_ID = userId

export const CHAT_ENGINE_CONFIG_HEADER = {
  headers: {
    "Project-ID": "d7c4f700-4fc1-4f96-822d-8ffd0920b438",
    "User-Name": USER_ID,
    "User-Secret": USER_ID,
  },
};

import ukFlag from '~/assets/img/ukFlag.png'
import vnflag from '~/assets/img/vnFlag.png'
export const LANGUAGES = [
  { label: "English", code: "en", flag: ukFlag },
  { label: "Tiếng Việt", code: "vn", flag: vnflag }
]

export const POST_TYPES = {
  SHARE_POST: "share",
  PROFILE_POST: "profile",
  PHOTO_POST: "photo",
  VIDEO_POST: "video",
  GROUP_POST: "group",
  GROUP_PHOTO_POST: "group-photo",
  GROUP_VIDEO_POST: "group-video",
  GROUP_SHARE_POST: "group-share",
}

export const COMMENT_TYPES = {
  MAIN_COMMENT: "mainComment",
  PHOTO_COMMENT: "photoComment",
  VIDEO_COMMENT: "videoComment",
  MAIN_GROUP_COMMENT: "groupComment",
  PHOTO_GROUP_COMMENT: "photoGroupComment",
  VIDEO_GROUP_COMMENT: "videoGroupComment",
}

// export const SHARE_LOCATION = {
//   STORY: 'story',
//   GROUP: 'group',
// }

export const EDITOR_TYPE = {
  STORY: "feed",
  GROUP: "group",
  SHARE: "share",
  COMMENT: "comment",
}

export const UPDATE = "update"
export const CREATE = "create"

export const PUBLIC = "public"
export const PRIVATE = "private"

export const SEARCH_TYPE = {
  ALL: "All",
  GROUP: "Group",
  USER: "User",
  POST: "Post",
  AVATAR: "Avata",
  COVER: "Cover",
}

export const ADMIN = "admin"
export const CENSOR = "censor"
export const MEMBER = "member"

export const APPROVE = "Approve"
export const DECLINE = "Decline"

export const COMMENT_FILTER_TYPE = {
  NEW: 'New',
  RELEVANT: 'Most relevant',
}

export const REPORT_TYPES = {
  POST: "post",
  COMMENT: "comment",
  PROFILE: "profile",
}

export const CHAT_KEY = {
  ProjectID: "d7c4f700-4fc1-4f96-822d-8ffd0920b438",
  PrivateKey: "62e47fdf-0ea8-429d-a68a-af5d0932ffac",
}

export const DEFAULT_AVATAR = 'http://res.cloudinary.com/dqitgxwfl/image/upload/v1724605061/img/null/vwz1hjtvwtl8axvfpezd.png'
export const DEFAULT_COVER = 'http://res.cloudinary.com/dqitgxwfl/image/upload/v1724605086/img/null/dh7lwsue5cljnb6crjuk.jpg'