/* eslint-disable react/prop-types */
import { useState, useContext } from "react"
import { Toaster, toast } from "react-hot-toast"
import { UserContext } from "../App"
import { BlogPageContext } from "../pages/Blog"
import axios from "axios"

const CommentField = ({
 action,
 index = undefined,
 replyingTo = undefined,
 setIsReplying
}) => {
 const [comment, setComment] = useState("")

 let {
  userAuth: {
   access_token,
   username,
   profile_img,
   fullname
  }
 } = useContext(UserContext)

 let {
  blog,
  blog: {
   _id,
   comments,
   comments: {
    results: commentsArr
   },
   author: {
    _id: blog_author
   },
   activity,
   activity: {
    total_comments,
    total_parent_comments
   }
  },
  setBlog,
  setTotalParentCommentsLoaded
 } = useContext(BlogPageContext)

 const handleComment = () => {
  if (!access_token) {
   return toast.error("Login to leave a comment")
  }
  if (!comment.length) {
   return toast.error("Write something to leave a comment")
  }
  axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/add-comment", {
   _id,
   blog_author,
   comment,
   replying_to: replyingTo
  }, {
   headers: {
    "Authorization": `Bearer ${access_token}`
   }
  }).then(({ data }) => {
   setComment("")
   data.commented_by = {
    personal_info: {
     username,
     profile_img,
     fullname
    },
    _id: data.user_id
   }
   setIsReplying ? setIsReplying(false) : ""
   let newCommentArr
   if (replyingTo) {
    commentsArr[index].children.push(data._id)
    data.childrenLevel = commentsArr[index].childrenLevel + 1
    data.parentIndex = index
    commentsArr[index].isRepliesLoaded = true
    commentsArr.splice(index + 1, 0, data)
    newCommentArr = commentsArr
   } else {
    data.childrenLevel = 0
    newCommentArr = [data, ...commentsArr]
   }
   setBlog({
    ...blog,
    comments: {
     ...comments,
     results: newCommentArr
    },
    activity: {
     ...activity,
     total_comments: total_comments + 1,
     total_parent_comments: total_parent_comments + 1
    }
   })
   setTotalParentCommentsLoaded(preVal => preVal + 1)
  }).catch(({ data }) => {
   try {
    if (data.response.status === 403) {
     return toast.error(data.response.data.error)
    }
   } catch (err) {
    console.log(err)
   }
   console.log(data)
  })
 }

 return (
  <>
   <Toaster />
   <textarea
    placeholder="Leave a comment..."
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
   />
   <button
    onClick={handleComment}
    className="btn-dark mt-5 px-10"
   >
    {action}
   </button>
  </>
 )
}

export default CommentField