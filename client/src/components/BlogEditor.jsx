import { useEffect, useContext, useRef } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Toaster, toast } from "react-hot-toast"
import { EditorContext } from "../pages/Editor"
import { uploadImage } from "../common/aws"
import { UserContext } from "../App"
import EditorJS from "@editorjs/editorjs"
import axios from "axios"
import PageAnimation from "./PageAnimation"
import tools from "./Tools"
import logo from "../imgs/logo.png"
import blogBanner from "../imgs/blog-banner.png"

const BlogEditor = () => {
 let {
  blog,
  blog: {
   title,
   des,
   banner,
   content,
   tags
  },
  setBlog,
  textEditor,
  setTextEditor,
  setEditorState
 } = useContext(EditorContext)

 let {
  userAuth: {
   access_token
  }
 } = useContext(UserContext)

 let { blog_id } = useParams()
 let blogBannerRef = useRef()
 let navigate = useNavigate()

 useEffect(() => {
  setTextEditor(new EditorJS({
   holderid: "textEditor",
   tools: tools,
   data: Array.isArray(content) ? content[0] : content,
   placeholder: "Let's write an awesome story"
  }))
 }, [content, setTextEditor])

 const handleBannerUpload = (e) => {
  let img = e.target.files[0]
  if (img) {
   let loadingToast = toast.loading("Uploading...")
   uploadImage(img).then((url) => {
    if (url) {
     setBlog(latestBlogObj => ({ ...latestBlogObj, banner: url }))
     toast.dismiss(loadingToast)
     toast.success("Uploaded")
     blogBannerRef.current.src = url
    }
   }).catch(err => {
    toast.dismiss(loadingToast)
    return toast.error(err)
   })
  }
 }

 const handleTitleKeyStroke = (e) => {
  if (e.keyCode === 13) {
   e.preventDefault()
  }
 }

 const handleTitleChange = (e) => {
  let input = e.target
  input.style.height = null
  input.style.height = input.scrollHeight + "px"
  setBlog({ ...blog, title: input.value })
 }

 const handlePublishEvent = (e) => {
  e.preventDefault()
  if (!banner.length) {
   return toast.error("Upload a banner to publish")
  }
  if (!title.length) {
   return toast.error("Enter a title to publish")
  }
  if (textEditor.isReady) {
   textEditor.save().then(data => {
    if (data.blocks.length) {
     setBlog({ ...blog, content: data })
     setEditorState("publish")
    } else {
     return toast.error("Write something to publish")
    }
   }).catch((err) => {
    console.log(err)
   })
  }
 }

 const handleSaveDraft = (e) => {
  e.preventDefault()
  if (!title.length) {
   return toast.error("Enter a title to save draft")
  }
  let loadingToast = toast.loading("Publishing...")
  e.target.classList.add("disable")
  if (textEditor.isReady) {
   textEditor.save().then(async data => {
    let content = data.blocks.length ? data : []
    let blogObj = { title, des, banner, tags, content, draft: true }
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", { ...blogObj, id: blog_id }, {
     headers: {
      "Authorization": `Bearer ${access_token}`
     }
    }).then(() => {
     e.target.classList.remove("disable")
     toast.dismiss(loadingToast)
     toast.success("Draft saved")
     resetEditor()
     setTimeout(() => {
      navigate(`/dashboard/blogs?tab=draft`)
     }, 500)
    }).catch(({ response }) => {
     e.target.classList.remove("disable")
     toast.dismiss(loadingToast)
     return toast.error(response.data.error)
    })
   })
  }
 }

 const handleBannerImageError = (e) => {
  e.target.src = blogBanner
 }

 const resetEditor = () => {
  setTextEditor({ isReady: false })
 }

 return (
  <>
   <nav className="navbar">
    <Link className="flex-none w-10" to="/">
     <img
      src={logo}
      alt="Logo"
     />
    </Link>
    <p className="max-md:hidden text-black line-clamp-1 w-full">{title.length ? title : "New Blog"}</p>
    <div className="flex gap-4 ml-auto">
     <button className="btn-dark py-2" onClick={handlePublishEvent}>Publish</button>
     <button className="btn-light py-2" onClick={handleSaveDraft}>Save Draft</button>
    </div>
   </nav>
   <Toaster />
   <PageAnimation>
    <section>
     <div className="mx-auto max-w-[900px] w-full">
      <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
       <label htmlFor="uploadBanner">
        <img
         src={banner}
         alt="Banner"
         ref={blogBannerRef}
         className="z-20"
         onError={handleBannerImageError}
        />
        <input
         type="file"
         id="uploadBanner"
         accept=".png, .jpg, .jpeg, .webp"
         hidden
         onChange={handleBannerUpload}
        />
       </label>
      </div>
      <textarea
       placeholder="Blog Title"
       defaultValue={title.length ? title : ""}
       onKeyDown={handleTitleKeyStroke}
       onChange={handleTitleChange}
       className="text-4xl font-medium placeholder:opacity-40 w-full h-20 outline-none resize-none mt-10 leading-tight"
      />
      <hr className="w-full opacity-10 my-5" />
      <div id="textEditor" className="font-gelasio" />
     </div>
    </section>
   </PageAnimation>
  </>
 )
}

export default BlogEditor