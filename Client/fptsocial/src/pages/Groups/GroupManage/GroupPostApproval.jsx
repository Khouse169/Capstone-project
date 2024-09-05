
import { Accordion, AccordionDetails, AccordionSummary, Button } from '@mui/material'
import { IconChevronDown } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGroupPostIdPendingByGroupId, getRequestJoin, memberJoinStatus } from '~/apis/groupApis'
import { approveGroupPost } from '~/apis/groupPostApis'
import PostContents from '~/components/ListPost/Post/PostContent/PostContents'
import PostMedia from '~/components/ListPost/Post/PostContent/PostMedia'
import SearchNotFound from '~/components/UI/SearchNotFound'
import UserAvatar from '~/components/UI/UserAvatar'
import { selectIsReload, triggerReload } from '~/redux/ui/uiSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { APPROVE, DECLINE, POST_TYPES } from '~/utils/constants'
import { compareDateTime } from '~/utils/formatters'

function GroupPostApproval({ group }) {
  const [listPendingPost, setListPendingPost] = useState([])
  const currentUser = useSelector(selectCurrentUser)
  const isReload = useSelector(selectIsReload)
  const dispatch = useDispatch()

  useEffect(() => {
    getGroupPostIdPendingByGroupId({ groupId: group?.groupId }).then(data => setListPendingPost(data))
  }, [group, isReload])

  const handlePostRequest = (postId, isShare, type) => {
    const submitData = {
      'userId': currentUser?.userId,
      'groupPostId': !isShare ? postId : null,
      'groupSharePostId': isShare ? postId : null,
      'type': type
    }
    approveGroupPost(submitData).then(() => dispatch(triggerReload()))
  }

  return (
    <div className='bg-fbWhite w-full '>
      <div className='h-[50px] p-6 bg-white flex justify-center items-center'>
        <h1 className='text-2xl font-semibold text-orangeFpt'>
          Post approve
        </h1>
      </div>
      <div className='flex h-[calc(100vh_-_100px-_60px)] flex-col items-center overflow-y-auto scrollbar-none-track'>
        <div className='flex flex-col gap-4 w-[90%] md:w-[500px] my-8'>
          {
            listPendingPost?.map(request => (
              <div key={request?.postId} className='flex justify-between items-center bg-white p-2 rounded-lg'>
                <Accordion sx={{ width: '100%' }}>
                  <AccordionSummary
                    expandIcon={<IconChevronDown />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <div className='flex justify-between w-full'>
                      <div className='flex gap-2'>
                        <UserAvatar avatarSrc={request?.userAvatar?.avataPhotosUrl || request?.userAvata} isOther={true} />
                        <div className='flex flex-col gap-1'>
                          <div className='font-bold'>{request?.userName}</div>
                          <div className='text-gray-500'>{compareDateTime(request?.createdAt)}</div>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button className='interceptor-loading' variant="contained"
                          onClick={() => handlePostRequest(request?.postId, request?.isShare, APPROVE)}>
                          Approve
                        </Button>
                        <Button className='interceptor-loading' variant="contained" color='warning'
                          onClick={() => handlePostRequest(request?.postId, request?.isShare, DECLINE)}>
                          Decline
                        </Button>
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className='w-full'>
                      <PostContents postData={request} postType={POST_TYPES.GROUP_POST} />
                      <PostMedia postData={request} postType={POST_TYPES.GROUP_POST} />
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>

            ))
          }
          {
            listPendingPost?.length == 0 && <SearchNotFound isNoneData />
          }
        </div>
      </div>
    </div>
  )
}

export default GroupPostApproval
