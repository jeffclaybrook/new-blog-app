import { useState, useEffect, createContext } from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import { lookInSession } from "./common/session"
import Navbar from "./components/Navbar"
import SideNavbar from "./components/SideNavbar"
import Blog from "./pages/Blog"
import ChangePassword from "./pages/ChangePassword"
import Dashboard from "./pages/Dashboard"
import Editor from "./pages/Editor"
import EditProfile from "./pages/EditProfile"
import Home from "./pages/Home"
import ManageBlogs from "./pages/ManageBlogs"
import NotFound from "./pages/NotFound"
import Notifications from "./pages/Notifications"
import Profile from "./pages/Profile"
import Search from "./pages/Search"
import UserAuthForm from "./pages/UserAuthForm"

export const UserContext = createContext({})

const App = () => {
 const [userAuth, setUserAuth] = useState({})

 useEffect(() => {
  let userInSession = lookInSession("user")
  userInSession
  ? setUserAuth(JSON.parse(userInSession))
  : setUserAuth({ access_token: null })
 }, [])

 return (
  <UserContext.Provider value={{ userAuth, setUserAuth }}>
   <Routes>
    <Route path="/editor" element={<Editor />} />
    <Route path="/editor:blog_id" element={<Editor />} />
    <Route path="/" element={<Navbar />}>
     <Route index element={<Home />} />
     <Route path="dashboard" element={<Dashboard />}>
      <Route index element={<Navigate to="blogs" />} />
      <Route path="blogs" element={<ManageBlogs />} />
      <Route path="notifications" element={<Notifications />} />
     </Route>
     <Route path="settings" element={<SideNavbar />}>
      <Route path="edit-profile" element={<EditProfile />} />
      <Route path="change-password" element={<ChangePassword />} />
     </Route>
     <Route path="signin" element={<UserAuthForm type="sign_in" />} />
     <Route path="signup" element={<UserAuthForm type="sign_up" />} />
     <Route path="user/:id" element={<Profile />} />
     <Route path="blog/:blog_id" element={<Blog />} />
     <Route path="search/:query" element={<Search />} />
     <Route path="*" element={<NotFound />} />
    </Route>
   </Routes>
  </UserContext.Provider>
 )
}

export default App