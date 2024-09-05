import { Link } from 'react-router-dom'
import { POST_TYPES } from '~/utils/constants'

function PostMedia({ postData, postType, isAdmin = false }) {
  const mediaList = postType == POST_TYPES.PROFILE_POST
    ? [
      ...(postData?.userPostPhotos || postData?.userPostPhoto)?.map(e => ({ type: 'image', position: e?.postPosition, owner: 'subPost', media: e, typePost: POST_TYPES.PHOTO_POST })) ?? [],
      ...(postData?.userPostVideos || postData?.userPostVideo)?.map(e => ({ type: 'video', position: e?.postPosition, owner: 'subPost', media: e, typePost: POST_TYPES.VIDEO_POST })) ?? []
    ]
    : [
      ...postData?.groupPostPhoto?.map(e => ({ type: 'image', position: e?.postPosition, owner: 'subPost', media: e, typePost: POST_TYPES.GROUP_PHOTO_POST })) ?? [],
      ...postData?.groupPostVideo?.map(e => ({ type: 'video', position: e?.postPosition, owner: 'subPost', media: e, typePost: POST_TYPES.GROUP_VIDEO_POST })) ?? []
    ]

  if (postType == POST_TYPES.PROFILE_POST) {
    if (postData?.photo) mediaList.push({ type: 'image', position: postData?.photo?.postPosition || 0, owner: 'mainPost', media: postData?.photo, typePost: POST_TYPES.PROFILE_POST })
    if (postData?.video) mediaList.push({ type: 'video', position: postData?.video?.postPosition || 0, owner: 'mainPost', media: postData?.video, typePost: POST_TYPES.PROFILE_POST })
  } else {
    if (postData?.groupPhoto) mediaList.push({ type: 'image', position: postData?.groupPhoto?.postPosition || 0, owner: 'mainPost', media: postData?.groupPhoto, typePost: POST_TYPES.GROUP_POST })
    if (postData?.groupVideo) mediaList.push({ type: 'video', position: postData?.groupVideo?.postPosition || 0, owner: 'mainPost', media: postData?.groupVideo, typePost: POST_TYPES.GROUP_POST })
  }
  mediaList.sort((a, b) => a.position - b.position)

  return (
    <div className="flex justify-center items-center w-full">
      {mediaList?.length > 0 && (
        <div
          id='media-container'
          className={`w-full grid grid-cols-12 `}
        >
          {mediaList.slice(0, isAdmin ? 1000 : 4)?.map((e, i) => {
            const media = e?.media
            if (e.type === 'image') {
              return (
                <Link
                  to={e?.owner == 'subPost' ? `/photo/${media?.userPostPhotoId || media?.groupPostPhotoId}?type=${e?.typePost}`
                    : `/media/${postData?.userPostId || postData?.groupPostId || postData?.postId}?type=${e?.typePost}`}
                  className={`relative  ${((isAdmin && mediaList?.length % 2 == 1) || (mediaList?.length == 1 || mediaList?.length == 3)) && i == 0 ? 'col-span-12' : 'col-span-6'}`}
                  onClick={(event) => { if (isAdmin) event.preventDefault() }}
                  key={i}
                >
                  <img
                    src={media?.photo?.photoUrl || media?.photoUrl || media?.groupPhoto?.photoUrl}
                    alt="post-img"
                    loading="lazy"
                    className="object-cover w-full h-full border"
                  />
                  {mediaList?.length > 4 && i == 3 && !isAdmin && (
                    <div className="bg-[rgba(0,0,0,0.5)] absolute right-0 top-0 bottom-0 left-0 text-white text-3xl font-bold flex justify-center items-center">
                      <span>+{mediaList.length - i - 1}</span>
                    </div>
                  )}
                </Link>
              )
            } else {
              return (
                <Link
                  to={e?.owner == 'subPost' ? `/video/${media?.userPostVideoId || media?.groupPostVideoId}?type=${e?.typePost}`
                    : `/media/${postData.userPostId || postData?.groupPostId || postData?.postId}?type=${e?.typePost}`}
                  className={`relative  ${((isAdmin && mediaList?.length % 2 == 1) || (mediaList?.length == 1 || mediaList?.length == 3)) && i == 0 ? 'col-span-12' : 'col-span-6'}`}
                  onClick={(event) => { if (isAdmin) event.preventDefault() }}
                  key={i}
                >
                  <video
                    controls
                    src={media?.video?.videoUrl || media?.videoUrl || media?.groupVideo?.videoUrl}
                    className=" object-cover w-full h-full border"
                  />
                  {mediaList?.length > 4 && i == 3 && !isAdmin && (
                    <div className="bg-[rgba(0,0,0,0.5)] absolute right-0 top-0 bottom-0 left-0 text-white text-3xl font-bold flex justify-center items-center">
                      <span>+{mediaList.length - i - 1}</span>
                    </div>
                  )}
                </Link>
              )
            }
          })}
        </div>
      )
      }
    </div >
  )
}

export default PostMedia