import { Popover } from '@mui/material'
import { IconCaretDownFilled, IconChevronDown, IconFileDescription, IconUsersGroup } from '@tabler/icons-react'
import { useCallback, useState } from 'react'
import { getGroupPostByGroupId } from '~/apis/groupPostApis'
import ListPost from '~/components/ListPost/ListPost'
import NewPost from '~/components/Modal/NewPost/NewPost'
import { POST_TYPES } from '~/utils/constants'
import PostGroupDetail from './PostDetail'

function GroupHomeDiscussions({ group, isPostDetail }) {
  const [filterType, setFilterType] = useState('New')
  const [anchorEl, setAnchorEl] = useState(null)

  const handleGetPost = useCallback(({ page, pageSize }) =>
    getGroupPostByGroupId({
      groupId: group?.groupId,
      type: filterType,
      page,
      pageSize
    }), [filterType, group])

  const handleChangeFilterType = (type) => {
    setFilterType(type)
    handleClose()
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div id='list-group-post'
      className='flex flex-col items-center lg:flex-row lg:justify-center lg:items-start w-full gap-3 bg-fbWhite'>
      <div className='relative flex flex-col gap-3'>
        {
          isPostDetail && <PostGroupDetail />
        }
        <div>
          {
            !isPostDetail &&
            <>
              <NewPost postType={POST_TYPES.GROUP_POST} groupId={group?.groupId} />
              <div onClick={handleClick} className='font-semibold text-blue-500 text-sm flex cursor-pointer w-fit py-2'>
                {filterType == 'New' ? 'Newest post' : 'Relative post'}<IconCaretDownFilled />
              </div>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <div className='p-1'>
                  <div className='py-2 px-1 cursor-pointer hover:bg-gray-100 rounded-md' onClick={() => handleChangeFilterType('New')}>Newest Post</div>
                  <div className='py-2 px-1 cursor-pointer hover:bg-gray-100 rounded-md' onClick={() => handleChangeFilterType('Valid ')}>Relative Post</div>
                </div>
              </Popover>
              {
                group && <ListPost getListPostFn={handleGetPost} />
              }
            </>
          }
        </div>
      </div>
    </div >
  )
}

export default GroupHomeDiscussions
