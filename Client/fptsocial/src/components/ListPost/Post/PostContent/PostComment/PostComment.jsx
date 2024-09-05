import { comment } from '~/apis/mock-data'
import ListComments from './ListComments/ListComments'
import Tiptap from '~/components/TitTap/TitTap'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { IconCaretDownFilled } from '@tabler/icons-react'
import { Popover, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { COMMENT_FILTER_TYPE } from '~/utils/constants'
import { selectCommentFilterType, setCommentFilterType } from '~/redux/activePost/activePostSlice'

function PostComment({ comment, postType }) {
  // const [isCreate, setIsCreate] = useState(false)
  // const [isChosePostAudience, setIsChosePostAudience] = useState(false)
  // const { handleSubmit } = useForm()
  // const [content, setContent] = useState('')
  // const user = useSelector(selectCurrentUser)
  // const [listPhotos, setListPhotos] = useState([])
  // const [listVideos, setListVideos] = useState([])
  // const [listStatus, setListStatus] = useState([])
  // const [choseStatus, setChoseStatus] = useState({})
  const commentFilter = useSelector(selectCommentFilterType)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleFilter = (type) => {
    dispatch(setCommentFilterType(type))
    handleClose()
  }

  return (
    <div className='w-full border-t'>
      <div className='px-4 pt-2'>
        <div id='comment-filter' onClick={handleClick} className='flex font-medium cursor-pointer w-fit'
        >
          {commentFilter == COMMENT_FILTER_TYPE.NEW ? t('standard.comment.new') : t('standard.comment.relevant')}
          <IconCaretDownFilled /></div>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}>
          <div className='flex flex-col p-2 gap-1'>
            <span className='cursor-pointer hover:bg-orangeFpt hover:text-white py-2 px-3 rounded-md'
              onClick={() => handleFilter(COMMENT_FILTER_TYPE.NEW)}>
              {t('standard.comment.new')}
            </span>
            <span className='cursor-pointer hover:bg-orangeFpt hover:text-white py-2 px-3 rounded-md'
              onClick={() => handleFilter(COMMENT_FILTER_TYPE.RELEVANT)}>
              {t('standard.comment.relevant')}
            </span>
          </div>
        </Popover>
        <ListComments comment={comment} postType={postType} />
      </div>
    </div>
  )
}

export default PostComment
