import { useContext } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../App"
import { removeFromSession } from "../common/session"
import PageAnimation from "./PageAnimation"

const UserNavigation = () => {
 let {
  userAuth: {
   username
  },
  setUserAuth
 } = useContext(UserContext)

 const signOut = () => {
  removeFromSession("user")
  setUserAuth({ access_token: null })
 }

 return (
  <PageAnimation transition={{duration: 0.2, y: { duration: 0.1}}} className="absolute right-0 z-50">
   <div className="bg-white absolute right-0 border border-grey w-60 duration-200">
    <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
     <i className="fi fi-rr-file-edit" />
     <p>Write</p>
    </Link>
    <Link to={`/user/${username}`} className="link pl-8 py-4">Profile</Link>
    <Link to="/settings/edit-profile" className="link pl-8 py-4">Settings</Link>
    <span className="absolute border-t border-grey w-[100%]" />
    <button onClick={signOut} className="text-left p-4 hover:bg-grey w-full pl-8 py-4">
     <h1 className="font-bold text-xl mg-1">Sign Out</h1>
     <p className="text-dark-grey">{`@${username}`}</p>
    </button>
   </div>
  </PageAnimation>
 )
}

export default UserNavigation