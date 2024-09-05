export const WHITESPACE_RULE = /\S/
export const FIELD_REQUIRED_MESSAGE = 'This field is required.'
export const WHITESPACE_MESSAGE = 'Not accept only whitespace.'

export const USERNAME_RULE = /^[\p{L}0-9._]{3,20}$/u
export const USERNAME_MESSAGE = 'The username must be between 3 and 20 characters, No spaces allowed.'

export const PHONE_NUMBER_RULE = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
export const PHONE_NUMBER_MESSAGE = 'Phone number is invalid in vietnam'

export const EMAIL_RULE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const EMAIL_MESSAGE = 'Email is invalid. (example@example.com)'

export const URL_RULE = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/
export const URl_MESSAGE = 'Url is invalid'

// file validate
export const LIMIT_COMMON_FILE_SIZE = 31457280 // 30 MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'video/mp4', 'video/webm']
export const singleFileValidator = (file) => {
  if (!file || !file.name || !file.size || !file.type) {
    return 'File cannot be blank.'
  }

  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return 'Maximum file size exceeded. (30MB)'
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return 'File type is invalid. Only accept jpg, jpeg, png, mp4, webm'
  }
  return null
}