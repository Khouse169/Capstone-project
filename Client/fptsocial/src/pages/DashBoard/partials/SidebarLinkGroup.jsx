import { useState } from 'react'

function SidebarLinkGroup({
  children,
  activeCondition,
}) {

  const [open, setOpen] = useState(activeCondition)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <li className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${activeCondition && 'bg-gray-100'}`}>
      {children(handleClick, open)}
    </li>
  )
}

export default SidebarLinkGroup