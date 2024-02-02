import { useState, useRef, useContext, useLayoutEffect } from "react"
import { Toaster, toast } from "react-hot-toast"
import { UserContext } from "../App"
import { uploadImage } from "../common/aws"
import { storeInSession } from "../common/session"
import { profileDataStructure } from "./Profile"
import axios from "axios"
import Input from "../components/Input"
import Loader from "../components/Loader"
import PageAnimation from "../components/PageAnimation"

const EditProfile = () => {
 let {
  userAuth,
  userAuth: {
   access_token
  },
  setUserAuth
 } = useContext(UserContext)

 const bioLimit = 200
 const [charactersLeft, setCharactersLeft] = useState(bioLimit)
 const [uploadedImg, setUploadedImg] = useState(null)
 const [loading, setLoading] = useState(true)
 const [profile, setProfile] = useState(profileDataStructure)

 let profileImgEl = useRef()
 let editProfileForm = useRef()

 let {
  personal_info: {
   fullname,
   username: profile_username,
   email,
   profile_img,
   bio
  },
  social_links
 } = profile

 useLayoutEffect(() => {
  if (access_token) {
   axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
    username: userAuth.username
   }).then(({ data }) => {
    setProfile(data)
    setLoading(false)
   }).catch(({ response }) => {
    return toast.error(response.data.error)
   })
  }
 }, [access_token, userAuth.username])

 const handleCharacterChange = (e) => {
  setCharactersLeft(bioLimit - e.target.value.length)
 }

 const handleImagePreview = (e) => {
  let img = e.target.files[0]
  profileImgEl.current.src = URL.createObjectURL(img)
  setUploadedImg(img)
 }

 const handleImageUpload = (e) => {
  e.preventDefault()
  if (uploadedImg) {
   let loadingToast = toast.loading("Loading...")
   e.target.setAttribute("disabled", true)
   uploadImage(uploadedImg).then((url) => {
    if (url) {
     axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile-img", { url }, {
      headers: {
       "Authorization": `Bearer ${access_token}`
      }
     }).then(({ data } ) => {
      let newUserAuth = { ...userAuth, profile_img: data.profile_img }
      storeInSession("user", JSON.stringify(newUserAuth))
      setUserAuth(newUserAuth)
      setUploadedImg(null)
      toast.dismiss(loadingToast)
      e.target.removeAttribute("disabled")
      toast.success("Uploaded")
     }).catch(({ response } ) => {
      toast.dismiss(loadingToast)
      e.target.removeAttribute("disabled")
      toast.error(response.data.error)
     })
    }
   })
  }
 }

 const handleSubmit = (e) => {
  e.preventDefault()
  let form = new FormData(editProfileForm.current)
  let formData = {}
  for (let [key, value] of form.entries()) {
   formData[key] = value
  }
  let {
   username,
   bio,
   youtube,
   instagram,
   facebook,
   twitter,
   github,
   website
  } = formData
  if (username.length < 3) {
   return toast.error("Username must be at least 3 characters")
  }
  if (bio.length > bioLimit) {
   return toast.error(`Bio must be ${bioLimit} characters or less`)
  }
  let loadingToast = toast.loading("Updating...")
  e.target.setAttribute("disabled", true)
  axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile", {
   username,
   bio,
   social_links: {
    youtube,
    instagram,
    facebook,
    twitter,
    github,
    website
   }
  }, {
   headers: {
    Authorization: `Bearer ${access_token}`
   }
  }).then(({ data }) => {
   if (userAuth.username !== data.username) {
    let newUserAuth = { ...userAuth, username: data.username }
    storeInSession("user", JSON.stringify(newUserAuth))
    setUserAuth(newUserAuth)
   }
   toast.dismiss(loadingToast)
   toast.success("Profile updated")
   e.target.removeAttribute("disabled")
  }).catch(({ response }) => {
   toast.dismiss(loadingToast)
   e.target.removeAttribute("disabled")
   toast.error(response.data.error)
  })
 }

 return (
  <PageAnimation>
   {loading ? (
    <Loader />
   ) : (
    <form ref={editProfileForm}>
     <Toaster />
     <h1 className="max-md:hidden">Edit Profile</h1>
     <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
      <div className="max-lg:center mb-5">
       <label
        htmlFor="UploadImage"
        id="profileImgLabel"
        className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden"
       >
        <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/80 opacity-0 hover:opacity-100 cursor-pointer">Upload Image</div>
        <img
         src={profile_img}
         alt="Profile image"
         ref={profileImgEl}
        />
       </label>
       <input
        type="file"
        id="UploadImage"
        accept=".jpeg, .png, .jpg"
        hidden
        onChange={handleImagePreview}
       />
       <button
        onClick={handleImageUpload}
        className="btn-light mt-5 max-lg:center lg:w-full px-10"
       >
        Upload
       </button>
      </div>
      <div className="w-full">
       <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
        <div>
         <Input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={fullname}
          disable={true}
          icon="fi-sr-user"
         />
        </div>
        <div>
         <Input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          disable={true}
          icon="fi-sr-envelope"
         />
        </div>
        <div>
         <Input
          type="text"
          name="username"
          placeholder="Username"
          value={profile_username}
          icon="fi-sr-at"
         />
         <p className="text-dark-grey -mt-3">
          Username will be used to search users and will be visible to all users
         </p>
         <textarea
          name="bio"
          maxLength={bioLimit}
          defaultValue={bio}
          placeholder="Bio"
          onChange={handleCharacterChange}
          className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
         />
         <p className="text-dark-grey mt-1">
          {charactersLeft} characters left
         </p>
         <p className="text-dark-grey my-6">
          Add your social handles below
         </p>
         <div className="md:grid md:grid-cols-2 gap-x-6">
          {Object.keys(social_links).map((key, i) => {
           let link = social_links[key]
           return (
            <Input
             key={i}
             type="text"
             name={key}
             value={link}
             placeholder="https://"
             icon={
              "fi " + (key !== "website" ? "fi-brands-" + key : "fi-br-link-alt")
             }
            />
           )
          })}
         </div>
         <button
          type="submit"
          onClick={handleSubmit}
          className="btn-dark w-auto px-10"
         >
          Update
         </button>
        </div>
       </div>
      </div>
     </div>
    </form>
   )}
  </PageAnimation>
 )
}

export default EditProfile