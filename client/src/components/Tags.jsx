/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useContext } from "react"
import { EditorContext } from "../pages/Editor"

const Tags = ({ tag }) => {
 let {
  blog,
  blog: {
   tags
  },
  setBlog
 } = useContext(EditorContext)

 const handleTagDelete = (e) => {
  let currentTag = e.target.getAttribute("tagdata")
  tags = Array(tags)[0].filter(tag => tag !== currentTag)
  setBlog({ ...blog, tags })
 }

 const addEditable = (e) => {
  e.target.setAttribute("contenteditable", true)
  e.target.focus()
 }

 const handleTagEdit = (e) => {
  if (e.keyCode === 13 || e.keyCode === 188) {
   e.preventDefault()
   let tagIndex = e.target.getAttribute("tagindex")
   let currentTag = e.target.innerText
   tags[tagIndex] = currentTag
   tags = Array(tags)[0].filter((tag, i) => {
    return tags.indexOf(tag) === i
   })
   setBlog({ ...blog, tags })
   e.target.setAttribute("contenteditable", false)
  }
 }

 return (
  <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-8">
   <p
    tagindex={tags.indexOf(tag)}
    onClick={addEditable}
    onKeyDown={handleTagEdit}
    suppressContentEditableWarning={true}
    className="outline-none"
   >
    {tag}
   </p>
   <button
    tagdata={tag}
    onClick={handleTagDelete}
    className="mt-[2px] rounded-full absolute right-2 top-1/2 -translate-y-1/2"
   >
    <i className="fi fi-rr-cross-small text-xl pointer-events-none" />
   </button>
  </div>
 )
}

export default Tags