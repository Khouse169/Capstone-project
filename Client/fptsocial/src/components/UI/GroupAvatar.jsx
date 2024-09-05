function GroupAvatar({ avatarSrc, size = 10 }) {
  return (
    <img
      src={avatarSrc}
      alt="group-img"
      className="rounded-xl aspect-square object-cover border border-gray-300"
      style={{
        height: `${size / 4}rem`, width: `${size / 4}rem`
      }}
    />
  )
}

export default GroupAvatar
