import { useState, useContext, useEffect } from "react"
import { useNavigate, Link, Outlet } from "react-router-dom"
import { UserContext } from "../App"
import UserNavigation from "./UserNavigation"
import axios from "axios"
import defaultUserProfileImage from "../imgs/user-profile.png"
import logo from "../imgs/logo.png"

const Navbar = () => {
 let [isVisible, setIsVisible] = useState(false)
 let [userNav, setUserNav] = useState(false)
 let navigate = useNavigate()

 let {
  userAuth,
  userAuth: {
   access_token,
   profile_img,
   new_notifications_available
  },
  setUserAuth
 } = useContext(UserContext)

 useEffect(() => {
  if (access_token) {
   axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/new-notifications", {
    headers: {
     "Authorization": `Bearer ${access_token}`
    }
   })
   .then(({ data }) => {
    setUserAuth({ ...userAuth, ...data })
   })
   .catch(err => {
    console.log(err)
   })
  }
 }, [access_token, setUserAuth, userAuth])

 const handleClick = () => {
  setUserNav(currentVal => !currentVal)
 }

 const handleBlur = () => {
  setTimeout(() => {
   setUserNav(false)
  }, 200)
 }

 const handleSearch = (e) => {
  let query = e.target.value
  if (e.keyCode === 13 && query.length) {
   navigate(`/search/${query}`)
  }
 }

 const handleImageLoadError = (e) => {
  e.target.src = defaultUserProfileImage
 }

 return (
  <>
   <nav className="navbar">
    <Link
     to="/"
     className="flex-none w-10"
    >
     <img
      src={logo}
      alt="Logo"
      className="w-full"
     />
    </Link>
    <div className={"absolute bg-white w-full left-0 top-full mt-0 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " + ( isVisible ? "show" : "hide")}>
     <input
      type="text"
      placeholder="Search"
      onKeyDown={handleSearch}
      className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
     />
     <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey" />
    </div>
    <div className="flex items-center gap-3 md:gap-6 ml-auto">
     <button
      type="button"
      onClick={() => setIsVisible(currentVal => !currentVal)}
      className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
     >
      <i className="fi fi-rr-search md:hidden text-2xl bg-grey w-12 h-12 rounded-full flex items-center justify-center" />
     </button>
     <Link
      to="/editor"
      className="hidden md:flex gap-2 link rounded-md"
     >
      <i className="fi fi-rr-file-edit" />
      <span>Write</span>
     </Link>
     {access_token ?
      <>
       <Link to="/dashboard/notifications">
        <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
         <i className="fi fi-rr-bell text-2xl block mt-1" />
         {
          userAuth ? new_notifications_available ?
          <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2" />
          : "" : ""
         }
        </button>
       </Link>
       <div
        className="relative"
        tabIndex={0}
        onClick={handleClick}
        onBlur={handleBlur}
       >
        <button className="w-12 h-12 mt-1">
         <img
          src={profile_img}
          alt="Profile image"
          onError={handleImageLoadError}
          className="w-full h-full object-cover rounded-full"
         />
        </button>
        {userNav ?? <UserNavigation />}
       </div>
      </>
      :
      <>
       <Link
        to="/signin"
        className="btn-dark py-2"
       >
        Sign In
       </Link>
       <Link
        to="/signup"
        className="btn-light py-2 hidden md:block"
       >
        Sign Up
       </Link>
      </>
     }
    </div>
   </nav>
   <Outlet />
  </>
 )
}

export default Navbar