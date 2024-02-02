/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useContext, createContext } from "react"
import { useParams, Navigate } from "react-router-dom"
import { UserContext } from "../App"
import axios from "axios"
import BlogEditor from "../components/BlogEditor"
import Loader from "../components/Loader"
import PublishForm from "../components/PublishForm"

export const blogStructure = {
 title: "",
 banner: "",
 content: [],
 tags: [],
 des: "",
 author: { personal_info: {} }
}

export const EditorContext = createContext({})

const Editor = () => {
 let { blog_id } = useParams()

 const [editorState, setEditorState] = useState("editor")
 const [loading, setLoading] = useState(true)
 const [blog, setBlog] = useState(blogStructure)
 const [textEditor, setTextEditor] = useState({ isReady: false })

 let {
  userAuth: {
   access_token
  }
 } = useContext(UserContext)

 useEffect(() => {
  if (!blog_id) {
   return setLoading(false)
  }
  axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", {
   blog_id,
   draft: true,
   mode: "edit"
  }).then(({ data: { blog } } ) => {
   setBlog(blog)
   setLoading(false)
  }).catch(() => {
   setBlog(null)
   setLoading(false)
  })
 }, [blog_id])

 return (
  <EditorContext.Provider value={{ editorState, setEditorState, blog, setBlog, textEditor, setTextEditor }}>
   {loading ? (
    <Loader />
   ) : blog === null ? (
    <Navigate to="/page-not-found" />
   ) : access_token === null ? (
    <Navigate to="/signin" />
   ) : editorState === "editor" ? (
    <BlogEditor />
   ) : (
    <PublishForm />
   )}
  </EditorContext.Provider>
 )
}

export default Editor