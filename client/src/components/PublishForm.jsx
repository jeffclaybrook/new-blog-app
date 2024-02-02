import { useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Toaster, toast } from "react-hot-toast"
import { UserContext } from "../App"
import { EditorContext } from "../pages/Editor"
import axios from "axios"
import Tags from "./Tags"
import PageAnimation from "./PageAnimation"

const PublishForm = () => {
 let { blog_id } = useParams()
 let characterLimit = 200
 let tagLimit = 10

 let {
  blog,
  blog: {
   title,
   des,
   tags,
   banner
  },
  setEditorState,
  setBlog,
  setTextEditor
 } = useContext(EditorContext)

 let {
  userAuth: {
   access_token
  }
 } = useContext(UserContext)

 let navigate = useNavigate()

 const handleCloseEvent = () => {
  setEditorState("editor")
 }

 const handleBlogTitleChange = (e) => {
  setBlog({ ...blog, title: e.target.value })
 }

 const handleCharacterChange = (e) => {
  setBlog({ ...blog, des: e.target.value })
 }

 const handleKeyStrokes = (e) => {
  if (e.keyCode === 13) {
   e.preventDefault()
  }
 }

 const handleKeyDown = (e) => {
  if (e.keyCode === 13 || e.keyCode === 188) {
   e.preventDefault()
   let tag = e.target.value
   if (tags.length < tagLimit) {
    if (!tags.includes(tag) && tag.length) {
     setBlog({ ...blog, tags: [...tags, tag] })
    } else {
     toast.error(`You can add a max of ${tagLimit} tags`)
    }
    e.target.value = ""
   }
  }
 }

 const publishBlog = (e) => {
  if (e.target.className.includes("disable")) {
   return
  }
  if (!title.length) {
   return toast.error("Enter a title to publish")
  } else if (des.length > 200 || !des.length) {
   return toast.error("Enter a description in 200 characters or less to publish")
  } else if (!tags.length) {
   return toast.error("Enter at least 1 tag to publish")
  } else {
   let loadingToast = toast.loading("Publishing...")
   e.target.classList.add("disable")
   blog_id ? blog["id"] = blog_id : ""
   blog.draft = false
   axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blog, {
    headers: {
     "Authorization": `Bearer ${access_token}`
    }
   }).then(() => {
    e.target.classList.remove("disable")
    toast.dismiss(loadingToast)
    toast.success("Published")
    resetEditor()
    setTimeout(() => {
     navigate(`/dashboard/blogs`)
    }, 500)
   }).catch(({ response }) => {
    e.target.classList.remove("disable")
    toast.dismiss(loadingToast)
    return toast.error(response.data.error)
   })
  }
 }

 const resetEditor = () => {
  setTextEditor({ isReady: false })
 }

 return (
  <PageAnimation>
   <section className="lg:fixed top-0 w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
    <Toaster />
    <button
     onClick={handleCloseEvent}
     className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
    >
     <i className="fi fi-br-cross" />
    </button>
    <div className="max-w-[550px] center">
     <p className="text-dark-grey mb-2">Preview</p>
     <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
      <img
       src={banner}
       alt="Banner"
      />
     </div>
     <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{title}</h1>
     <p className=" font-gelasio line-clamp-2 text-xl leading-7 mt-4">{des}</p>
    </div>
    <div className="border-grey lg:border-l lg:pl-8">
     <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
     <input
      type="text"
      defaultValue={title.length ? title : ""}
      placeholder="Blog Title"
      onChange={handleBlogTitleChange}
     />
     <p className="text-dark-grey mb-2 mt-9">Blog Description</p>
     <textarea
      id="shortDes"
      onChange={handleCharacterChange}
      onKeyDown={handleKeyStrokes}
      maxLength={characterLimit}
      defaultValue={des}
      className="h-40 resize-none leading-7 input-box pl-4"
     />
     <p className="mt-1 text-dark-grey text-sm text-right">{characterLimit - des.length} characters remaining</p>
     <p className="text-dark-grey mb-2 mt-9">Topics</p>
     <div className="relative input-box pl-2 py-2 pb-4">
      <input
       type="text"
       placeholder="Topic"
       onKeyDown={handleKeyDown}
       className="sticky input-box bg-white focus:bg-white top-0 left-0 pl-4 mb-3"
      />
      {tags.map((item, i) => (
       <Tags key={i} tag={item} />
      ))}
     </div>
     <p className="mt-1 mb-4 text-dark-grey text-right">{tagLimit - tags.length} tags remaining</p>
     <button
      onClick={publishBlog}
      className="btn-dark px-8"
     >
      {!blog_id ? "Publish" : "Save Changes"}
     </button>
    </div>
   </section>
  </PageAnimation>
 )
}

export default PublishForm