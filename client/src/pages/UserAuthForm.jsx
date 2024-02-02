/* eslint-disable react/prop-types */
import { useContext } from "react"
import { Link, Navigate } from "react-router-dom"
import { Toaster, toast } from "react-hot-toast"
import { storeInSession } from "../common/session"
import { UserContext } from "../App"
import { authWithGoogle } from "../common/firebase"
import Input from "../components/Input"
import PageAnimation from "../components/PageAnimation"
import axios from "axios"
import googleIcon from "../imgs/google.png"

const UserAuthForm = ({ type }) => {
 let {
  userAuth: {
   access_token
  },
  setUserAuth
 } = useContext(UserContext)

 const authFormServer = (formData, route) => {
  axios.post(import.meta.env.VITE_SERVER_DOMAIN + route, formData)
  .then(({ data }) => {
   storeInSession("user", JSON.stringify(data))
   setUserAuth(data)
  })
  .catch(({ response }) => {
   toast.error(response.data.error)
  })
 }

 const handleSubmit = (e) => {
  e.preventDefault()
  let route = type === "sign-in"
   ? "/signin"
   : "/signup"

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/

  let form = new FormData("authForm")
  let formData = {}

  for (let [key, value] of form.entries()) {
   formData[key] = value
  }

  let { fullname, email, password } = formData

  if (fullname) {
   if (fullname.length < 3) {
    return toast.error("Fullname must be at least 3 characters")
   }
  } 
  if (!email.length) {
   return toast.error("Email required")
  } 
  if (!emailRegex.test(email)) {
   return toast.error("Email is invalid")
  } 
  if (!passwordRegex.test(password)) {
   return toast.error("Password must be 6 to 20 characters with 1 numeric, 1 lowercase, and 1 uppercase character")
  }
  authFormServer(formData, route)
 }

 const handleGoogleAuth = (e) => {
  e.preventDefault()
  authWithGoogle().then(user => {
   let serverRoute = "/google-auth"
   let formData = {
    accessToken: user.accessToken
   }
   authFormServer(formData, serverRoute)
  }).catch(err => {
   toast.error("Trouble logging in")
   return console.log(err)
  })
 }

 return (
  <>
   {access_token ?
    (
    <Navigate to="/" />
    ) : (
     <PageAnimation key={type}>
     <section className="h-cover flex items-center justify-center">
      <Toaster />
      <form id="authForm" className="w-[80%] max-w-[400px]">
       <h1 className="text-4xl font-gelasio text-center mb-16">
        {type === "sign-in" ? "Welcome back" : "Sign up today"}
       </h1>
       {type != "sign-in" && (
        <Input
         type="text"
         id="fullname"
         name="fullname"
         placeholder="Full name"
         icon="fi-rr-user"
        />
       )}
       <Input
        type="email"
        id="email"
        name="email"
        placeholder="Email"
        icon="fi-rr-envelope"
       />
       <Input
        type="password"
        id="password"
        name="password"
        placeholder="Password"
        icon="fi-rr-key"
       />
       <button
        type="submit"
        onClick={handleSubmit}
        className="btn-dark center mt-14"
       >
        {type.replace("_", " ")}
       </button>
       <div className="relative w-full flex items-center gap-x-2 my-10 opacity-10 uppercase text-black font-bold">
        <hr className="w-1/2 border-black" />
        <span>or</span>
        <hr className="w-1/2 border-black" />
       </div>
       <button
        onClick={handleGoogleAuth}
        className="btn-dark flex items-center justify-center gap-x-4 w-[70%] center"
       >
        <img
         src={googleIcon}
         alt="Google icon"
         className="w-5"
        />
        Continue with Google
       </button>
       {type === "sign-in" ? (
        <p className="text-dark-grey text-xl text-center mt-6">
         Dont have an account?
         <Link
          to="/signup"
          className="underline text-black text-xl ml-1"
         >
          Sign up
         </Link>
        </p>
       ) : (
        <p className="text-dark-grey text-xl text-center mt-6">
         Already a member?
         <Link
          to="/signin"
          className="underline text-black text-xl ml-1"
         >
          Sign in
         </Link>
        </p>
       )}
      </form>
     </section>
    </PageAnimation>
    )
   }
  </>
 )
}

export default UserAuthForm