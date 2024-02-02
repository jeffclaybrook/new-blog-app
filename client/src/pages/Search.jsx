import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Toaster, toast } from "react-hot-toast"
import { filterPaginationData } from "../common/filter-pagination-data"
import axios from "axios"
import BlogPost from "../components/BlogPost"
import Loader from "../components/Loader"
import LoadMore from "../components/LoadMore"
import InPageNavigation from "../components/InPageNavigation"
import NoData from "../components/NoData"
import UserCard from "../components/UserCard"
import PageAnimation from "../components/PageAnimation"

const Search = () => {
 let { query } = useParams()

 const [blogs, setBlogs] = useState(null)
 const [users, setUsers] = useState(null)

 const searchBlogs = ({ page = 1, create_new_arr = false }) => {
  axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
   query,
   page
  }).then(async ({ data }) => {
   let formattedData = await filterPaginationData({
    arr: blogs,
    data: data.blogs,
    page,
    create_new_arr,
    countRoute: "/search-blogs-count",
    data_to_send: { query }
   })
   setBlogs(formattedData)
  }).catch((err) => {
   console.log(err)
   toast.error("Unable to search blogs at this time")
  })
 }

 useEffect(() => {
  resetPage()
  searchBlogs({ create_new_arr: true })
  axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", {
   query
  }).then(({ data: { users } }) => {
   setUsers(users)
  }).catch((err) => {
   console.log(err)
   toast.error("Unable to search users at this time")
  })
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [query])

 const resetPage = () => {
  setBlogs(null)
  setUsers(null)
 }

 const UserCardsWrapper = () => (
  <>
   {users === null ? (
    <Loader />
   ) : users.length ? (
    users.map((user, i) => (
     <PageAnimation key={i} transition={{ delay: i * 0.08 }}>
      <UserCard user={user} />
     </PageAnimation>
    ))
   ) : (
    <NoData message="No users found" />
   )}
  </>
 )

 return (
  <section className="h-cover flex justify-center gap-10">
   <Toaster />
   <div className="w-full">
    <InPageNavigation
     routes={[`Search results for ${query}`, "Accounts Matched"]}
     defaultHidden={["Accounts Matched"]}
    >
     <>
      {blogs === null ? (
       <Loader />
      ) : blogs.results.length ? (
       blogs.results.map((blog, i) => (
        <PageAnimation key={i} transition={{ delay: i * 0.08 }}>
         <BlogPost
          content={blog}
          author={blog.author.personal_info}
         />
        </PageAnimation>
       ))
      ) : (
       <NoData message="No blogs published" />
      )}
      <LoadMore
       dataArr={blogs}
       fetchDataFunc={searchBlogs}
      />
     </>
     <UserCardsWrapper />
    </InPageNavigation>
   </div>
   <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
    <h1 className="font-medium text-xl mb-8">
     Users related to search <i className="fi fi-rr-user ml-2 mt-1" />
    </h1>
    <UserCardsWrapper />
   </div>
  </section>
 )
}

export default Search