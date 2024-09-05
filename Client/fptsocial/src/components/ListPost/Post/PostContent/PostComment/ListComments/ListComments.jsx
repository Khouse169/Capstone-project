import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Comment from './Comment/Comment'
import chatImg from '~/assets/img/chat.png'
import InfiniteScroll from '~/components/IntersectionObserver/InfiniteScroll'

function ListComments({ comment, postType }) {
  const { t } = useTranslation()
  const [displayedComments, setDisplayedComments] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (comment) {
      setDisplayedComments(comment.slice(0, 5))
      setHasMore(comment.length > 5)
      setPage(1)
    }
  }, [comment])

  const loadMoreComments = useCallback(() => {
    if (comment) {
      setPage(prevPage => {
        const nextPage = prevPage + 1
        const newComments = comment.slice(0, nextPage * 5)
        setDisplayedComments(newComments)
        setHasMore(newComments.length < comment.length)
        return nextPage
      })
    }
  }, [comment])


  return (
    <InfiniteScroll
      fetchMore={loadMoreComments}
      hasMore={hasMore}
      // endMessage={t('standard.comment.noMoreComments')}
      className='my-4 flex flex-col w-full gap-3 min-h-[350px] max-h-[500px] overflow-y-auto scrollbar-none-track'
    >
      {displayedComments.length === 0 && (
        <div className='flex flex-col items-center gap-2 text-gray-500'>
          {t('standard.comment.noComment')}
          <img src={chatImg} className='size-10' />
        </div>
      )}
      {displayedComments.map((e, i) => {
        const commentID = e?.commentId || e?.commentSharePostId || e?.commentVideoPostId || e?.commentPhotoPostId
          || e?.commentGroupPostId || e?.commentGroupSharePostId || e?.commentPhotoGroupPostId || e?.commentGroupVideoPostId || i
        return <Comment key={commentID} comment={e} postType={postType} />
      })}
    </InfiniteScroll>
  )
}

export default ListComments