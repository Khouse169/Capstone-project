import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import avatarHolder from '~/assets/img/avatar_holder.png'

function UserAvatar({ avatarSrc, size = '2.5', isOther = true }) {
  const currentUser = useSelector(selectCurrentUser)
  let avatarUrl
  if (!isOther) {
    avatarUrl = currentUser?.avataPhotos?.find(e => e.isUsed == true)?.avataPhotosUrl
  }
  else avatarUrl = avatarSrc

  return (
    <img
      src={avatarUrl || 'invalid-url'}
      onError={e => {
        e.target.src = avatarHolder
        e.onerror = null
      }}
      alt="avatar"
      className="rounded-[50%] aspect-square object-cover border border-gray-300"
      style={{
        width: `${size}rem`,
        height: `${size}rem`
      }}
    />
  )
}

export default UserAvatar
