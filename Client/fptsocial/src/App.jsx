import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from 'oidc-react'
import { useSelector } from 'react-redux'
import Login from './pages/Auth/Login'
import HomePage from './pages/HomePage/HomePage'
import Profile from './pages/Profile/Profile'
import NotFound from './pages/404/NotFound'
import oidcConfig from './utils/authOidc'
import FirstTimeLogin from './pages/FirstTimeLogin/FirstTimeLogin'
import { selectCurrentUser } from './redux/user/userSlice'
import PageLoadingSpinner from './components/Loading/PageLoadingSpinner'
import AccountCheckExist from './pages/Auth/AccountCheckExist'
import NotAvailable from './pages/404/NotAvailable'
import Setting from './pages/Settings/Setting'
import Friends from './pages/Friends/Friends'
import Groups from './pages/Groups'
import Group from './pages/Groups/_id'
import Media from './pages/Media'
import Post from './pages/Post/_id'
import ChatsPage from './pages/ChatsPage'
import Dashboard from './pages/DashBoard/DashBoard'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'
import Unauthorization from './pages/404/Unauthorization'
import Search from './pages/Search'
import ChatBot from './pages/ChatBot/ChatBot'
import { JWT_TOKEN } from './utils/constants'
import Notification from './pages/Notification/Notification'

const jwtToken = JWT_TOKEN

const ProtectedRouteByJWT = ({ jwtToken }) => {
  if (!jwtToken) return window.location.assign('/login')
  return <Outlet />
}

const ProtectedRouteByUser = ({ user }) => {
  if (!user) return <Navigate to='/checkexist' replace={true} />
  else if (user?.role == 'Societe-admin') return <Navigate to='/dashboard' replace={true} />
  return <Outlet />
}
const ProtectedAdminRoute = ({ user }) => {
  if (user?.role !== 'Societe-admin') return <Navigate to='/unauthorization' replace={true} />
  return <Outlet />
}

const UnauthorizeRoute = ({ jwtToken }) => {
  const location = useLocation()
  if (!!(jwtToken && location.pathname === '/login')) {
    return <Navigate to='/' replace={true} />
  }
  return <Outlet />
}

const UnCheckUser = ({ user }) => {
  if (user) return <Navigate to='/' replace={true} />
  return <Outlet />
}

const Home = () => {
  if (!jwtToken) return <div className='w-screen h-screen flex items-center justify-center'><PageLoadingSpinner /></div>
  else return <Navigate to='/' />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      {/* AuthProvider Wrapper */}
      <Route element={<AuthProvider {...oidcConfig}><Outlet /></AuthProvider>}>
        {/* Unprotected Route */}
        <Route element={<UnauthorizeRoute jwtToken={jwtToken} />}>
          {/* Authentication */}
          <Route path='/login' element={<Login />} />
          <Route path='/signin' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot' element={<ForgotPassword />} />
        </Route>
        {/* Check after FEID login page */}
        <Route path='/home' element={<Home />} />

        {/* Protected Route */}
        <Route element={<ProtectedRouteByJWT jwtToken={jwtToken} />}>
          <Route path='/checkexist' element={<AccountCheckExist />} />
          <Route>
            <Route path='/chats-page' element={<ChatsPage />} />
            <Route path='/chats-page/:chatId' element={<ChatsPage />} />
          </Route>
          <Route element={<UnCheckUser user={currentUser} />}>
            <Route path='/firstlogin' element={<FirstTimeLogin />} />
            <Route path='/updateadmin' element={<FirstTimeLogin />} />
          </Route>

          {/* Route need existed user */}
          <Route element={<ProtectedRouteByUser user={currentUser} jwtToken={jwtToken} />}>
            <Route path='/' element={<Navigate to='/homepage' />} />

            <Route path='/settings' element={<Setting />} />
            <Route path='/chatbot' element={<ChatBot />} />

            {/* Home page */}
            <Route path='/homepage' element={<HomePage />} />
            <Route path='/search' element={<Search />} >
              <Route path='user' element={<Search />} />
              <Route path='group' element={<Search />} />
              <Route path='post' element={<Search />} />
            </Route>
            <Route path='/notifications' element={<Notification />} />
            {/* Photo, Video post */}
            <Route path='/photo/:photoId' element={<Media />} />
            <Route path='/media/:postId' element={<Media />} />
            <Route path='/video/:videoId' element={<Media />} />
            <Route path='/post/:postId' element={<Post />} />
            {/* Profile page */}
            <Route path='/profile' element={<Profile />} />

            {/* Friend page */}
            <Route path='/friends' element={<Friends />}>
              {/* <Route path='' element={<Friends />} /> */}
              <Route path='requests' element={<Friends />} />
              <Route path='sendrequests' element={<Friends />} />
              <Route path='suggestions' element={<Friends />} />
              <Route path='list' element={<Friends />} />
            </Route>

            {/* Group page */}
            <Route path='/groups' element={<Groups />}>
              <Route path='feed' element={<Groups />} />
              <Route path='invites' element={<Groups />} />
              <Route path='discover' element={<Groups />} />
              <Route path='joins' element={<Groups />} />
              <Route path='create' element={<Groups />} />
            </Route>
            <Route path='/groups/:groupId' element={<Group />} >
              <Route path='member-requests' element={<Group />} />
              <Route path='member-manage' element={<Group />} />
              <Route path='settings' element={<Group />} />
              <Route path='pending-posts' element={<Group />} />
              <Route path='post/:postId' element={<Group />} />
            </Route>
          </Route>
          <Route element={<ProtectedAdminRoute user={currentUser} />} >
            <Route path="/dashboard" element={<Dashboard />} >
              <Route path='settings' element={<Dashboard />} />
              <Route path='manage/users' element={<Dashboard />} />
              <Route path='manage/groups' element={<Dashboard />} />
              <Route path='reports' element={<Dashboard />} >
                <Route path='users' element={<Dashboard />} />
                <Route path='groups' element={<Dashboard />} />
                <Route path='posts' element={<Dashboard />} />
                <Route path='comments' element={<Dashboard />} />
              </Route>
            </Route>
          </Route>
        </Route>

        {/* 404 not found */}
        <Route path='/notavailable' element={<NotAvailable />} />
        <Route path='/unauthorization' element={<Unauthorization />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App