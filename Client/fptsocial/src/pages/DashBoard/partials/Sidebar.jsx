import { useRef } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"

import SidebarLinkGroup from "./SidebarLinkGroup"
import { IconCaretLeftFilled, IconChevronDown, IconChevronUp, IconLayoutDashboardFilled, IconMenu2, IconMessageReport, IconUsers } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Drawer } from '@mui/material'

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const location = useLocation()
  const { pathname } = location
  const { t } = useTranslation()
  const sidebar = useRef(null)

  return (
    <>
      {
        !sidebarOpen && (
          <div className="absolute top-5 left-5 z-60">
            {/* Hamburger button */}
            <button
              className="text-white hover:bg-orange-600 bg-orangeFpt rounded-full p-1"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <IconMenu2 />
            </button>
          </div>
        )
      }
      <Drawer open={sidebarOpen} onClose={() => setSidebarOpen(!sidebarOpen)}>
        <div className="w-64 relative">
          {/* Sidebar */}
          <div
            id="sidebar"
            ref={sidebar}
            className={`flex flex-col absolute z-40 left-0 top-0 h-[100dvh] overflow-y-scroll  no-scrollbar w-64  2xl:!w-64 shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}  shadow-sm`}
          >

            {/* Sidebar header */}
            <div
              className="text-white bg-orangeFpt cursor-pointer rounded-full w-fit"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <IconCaretLeftFilled />
            </div>

            {/* Links */}
            <div className="space-y-8">
              {/* Pages group */}
              <div>
                <div className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
                  <span className=" 2xl:block">{t('admin.sidebar.manage')}</span>
                </div>
                <ul className="mt-3">
                  {/* Dashboard */}
                  <SidebarLinkGroup activeCondition={pathname === "/" || pathname.includes("dashboard")}>
                    {(handleClick, open) => {
                      return (
                        <>
                          <div
                            className={`transition duration-150 ${pathname === "/" || pathname.includes("dashboard") ? "" : "hover:text-gray-900 dark:hover:text-white"}`}
                            onClick={(e) => {
                              e.preventDefault()
                              handleClick()
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <IconLayoutDashboardFilled />
                                <span className="text-sm font-medium ml-4  2xl:opacity-100 duration-200">
                                  Main
                                </span>
                              </div>
                              <div className="flex shrink-0 ml-2">
                                {open ? <IconChevronDown /> : <IconChevronUp />}
                              </div>
                            </div>
                          </div>
                          <div className="2xl:block">
                            <ul className={` mt-1 ${!open && "hidden"}`}>
                              <li className="mb-1 last:mb-0">
                                <NavLink end to="/"
                                  className={({ isActive }) =>
                                    "block transition duration-150 truncate p-2 rounded-md font-semibold " + (isActive ? "text-blue-500" : "text-gray-500/90 hover:text-gray-700 ")
                                  }
                                >
                                  <span className="text-sm 2xl:opacity-100 duration-200">
                                    Dashboard
                                  </span>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                          <div className="2xl:block">
                            <ul className={` mt-1 ${!open && "hidden"}`}>
                              <li className="mb-1 last:mb-0">
                                <NavLink end to="/dashboard/settings"
                                  className={({ isActive }) =>
                                    "block transition duration-150 truncate p-2 rounded-md font-semibold " + (isActive ? "text-blue-500" : "text-gray-500/90 hover:text-gray-700 ")
                                  }
                                >
                                  <span className="text-sm 2xl:opacity-100 duration-200">
                                    System settings
                                  </span>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </>
                      )
                    }}
                  </SidebarLinkGroup>

                  {/* User */}
                  <SidebarLinkGroup activeCondition={pathname.includes("dashboard/manage")}>
                    {(handleClick, open) => {
                      return (
                        <>
                          <Link
                            className={`transition duration-150 ${pathname.includes("dashboard/manage") ? "" : ""}`}
                            onClick={(e) => {
                              handleClick()
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <IconUsers />
                                <span className="text-sm font-medium ml-4  2xl:opacity-100 duration-200">
                                  Manager Users/Groups
                                </span>
                              </div>
                              <div className="flex shrink-0 ml-2">
                                {open ? <IconChevronDown /> : <IconChevronUp />}
                              </div>
                            </div>
                          </Link>
                          <div className="">
                            <ul className={` mt-1 ${!open && "hidden"}`}>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  to="/dashboard/manage/users"
                                  className={({ isActive }) =>
                                    "block transition duration-150 truncate p-2 rounded-md font-semibold " + (isActive ? "bg-orangeFpt text-white" : "text-gray-500/90 hover:text-gray-700 ")
                                  }
                                >
                                  <span className="text-sm 2xl:opacity-100 duration-200">
                                    List users
                                  </span>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                          <div className="">
                            <ul className={` mt-1 ${!open && "hidden"}`}>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  to="/dashboard/manage/groups"
                                  className={({ isActive }) =>
                                    "block transition duration-150 truncate p-2 rounded-md font-semibold " + (isActive ? "bg-orangeFpt text-white" : "text-gray-500/90 hover:text-gray-700 ")
                                  }
                                >
                                  <span className="text-sm 2xl:opacity-100 duration-200">
                                    List groups
                                  </span>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </>
                      )
                    }}
                  </SidebarLinkGroup>

                  {/* Report */}
                  <SidebarLinkGroup activeCondition={pathname.includes("reports")}>
                    {(handleClick, open) => {
                      return (
                        <>
                          <Link
                            className={`transition duration-150 ${pathname.includes("users") ? "" : ""}`}
                            onClick={(e) => {
                              handleClick()
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <IconMessageReport />
                                <span className="text-sm font-medium ml-4  2xl:opacity-100 duration-200">
                                  {t('admin.sidebar.report.report_manage')}
                                </span>
                              </div>
                              <div className="flex shrink-0 ml-2">
                                {open ? <IconChevronDown /> : <IconChevronUp />}
                              </div>
                            </div>
                          </Link>
                          {/* User reports */}
                          <div className="">
                            <ul className={` mt-1 ${!open && "hidden"}`}>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  to="/dashboard/reports/users"
                                  className={({ isActive }) =>
                                    "block transition duration-150 truncate p-2 rounded-md font-semibold " + (isActive ? "bg-orangeFpt text-white" : "text-gray-500/90 hover:text-gray-700 ")
                                  }
                                >
                                  <span className="text-sm 2xl:opacity-100 duration-200">
                                    User Report
                                  </span>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                          {/* Post reports */}
                          <div className="">
                            <ul className={` mt-1 ${!open && "hidden"}`}>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  to="/dashboard/reports/groups"
                                  className={({ isActive }) =>
                                    "block transition duration-150 truncate p-2 rounded-md font-semibold " + (isActive ? "bg-orangeFpt text-white" : "text-gray-500/90 hover:text-gray-700 ")
                                  }
                                >
                                  <span className="text-sm 2xl:opacity-100 duration-200">
                                    Group Reports
                                  </span>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                          {/* Group reports */}
                          <div className="">
                            <ul className={` mt-1 ${!open && "hidden"}`}>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  to="/dashboard/reports/posts"
                                  className={({ isActive }) =>
                                    "block transition duration-150 truncate p-2 rounded-md font-semibold " + (isActive ? "bg-orangeFpt text-white" : "text-gray-500/90 hover:text-gray-700 ")
                                  }
                                >
                                  <span className="text-sm 2xl:opacity-100 duration-200">
                                    Post Reports
                                  </span>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                          {/* comment reports */}
                          <div className="">
                            <ul className={` mt-1 ${!open && "hidden"}`}>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  to="/dashboard/reports/comments"
                                  className={({ isActive }) =>
                                    "block transition duration-150 truncate p-2 rounded-md font-semibold " + (isActive ? "bg-orangeFpt text-white" : "text-gray-500/90 hover:text-gray-700 ")
                                  }
                                >
                                  <span className="text-sm 2xl:opacity-100 duration-200">
                                    Comment Reports
                                  </span>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </>
                      )
                    }}
                  </SidebarLinkGroup>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>


  )
}

export default Sidebar
