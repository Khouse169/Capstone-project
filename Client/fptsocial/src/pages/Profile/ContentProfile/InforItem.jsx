import hideIcon from '~/assets/img/hide.png'

function InfoItem({ Icon, label, value }) {
  return (
    <div className='flex gap-1'>
      <Icon stroke={2} color='#c8d3e1' />
      {label && <span>{label}&nbsp;</span>}
      <span className='font-semibold capitalize'>{value
        || <img src={hideIcon} className='size-5' />
      }
      </span>
    </div>
  )
}

export default InfoItem