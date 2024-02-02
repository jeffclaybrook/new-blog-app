/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
import { getDay } from "../common/date"

const NoBannerBlogPost = ({ blog, index }) => {
 let {
  title,
  blog_id,
  author: {
   personal_info: {
    fullname,
    username: profile_username,
    profile_img
   }
  },
  publishedAt
 } = blog

 index++

 return (
  <Link to={`/blog/${blog_id}`} className="flex gap-5 mb-8">
   <h1 className="blog-index">{index < 10 ? "0" + index : index}</h1>
   <div>
    <div className="flex items-center gap-2 mb-4">
     <img
      src={profile_img}
      alt="Profile"
      className="w-6 h-6 rounded-full"
     />
     <p className="line-clamp-1">{fullname} @{profile_username}</p>
     <p className="min-w-fit">{getDay(publishedAt)}</p>
    </div>
    <h2 className="blog-title">{title}</h2>
   </div>
  </Link>
 )
}

export default NoBannerBlogPost