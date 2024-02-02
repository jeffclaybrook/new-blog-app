/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import { UserContext } from "../App"
import { filterPaginationData } from "../common/filter-pagination-data"
import axios from "axios"
import NotFound from "./NotFound"
import About from "../components/About"
import BlogPost from "../components/BlogPost"
import Loader from "../components/Loader"
import LoadMore from "../components/LoadMore"
import InPageNavigation from "../components/InPageNavigation"
import NoData from "../components/NoData"
import PageAnimation from "../components/PageAnimation"

export const profileDataStructure = {
 personal_info: {
  fullname: "",
  username: "",
  profile_img: "",
  bio: ""
 },
 account_info: {
  total_posts: 0,
  total_reads: 0
 },
 social_links: {},
 joinedAt: ""
}

const Profile = () => {
 const [blogs, setBlogs] = useState(null)
 const [loading, setLoading] = useState(true)
 const [profileLoaded, setProfileLoaded] = useState()
 const [profile, setProfile] = useState(profileDataStructure)

 let { id: profileID } = useParams()

 let {
  userAuth: {
   username
  }
 } = useContext(UserContext)

 let {
  personal_info: {
   fullname,
   username: profile_username,
   profile_img,
   bio
  },
  account_info: {
   total_posts,
   total_reads
  },
  social_links,
  joinedAt
 } = profile

 const getBlogs = ({ page = 1, user_id }) => {
  user_id = user_id === undefined ? blogs.user_id : user_id
  axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
   author: user_id,
   page
  }).then(async ({ data }) => {
   let formattedData = await filterPaginationData({
    arr: blogs,
    data: data.blogs,
    page,
    countRoute: "/search-blogs-count",
    data_to_send: { author: user_id }
   })
   formattedData.user_id = user_id
   setBlogs(formattedData)
  })
 }

 useEffect(() => {
  if (profileID !== profileLoaded) {
   setBlogs(null)
  }
  if (blogs === null) {
   resetPage()
   axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
    username: profileID
   }).then(({ data: user }) => {
    setProfile(user)
    setProfileLoaded(profileID)
    getBlogs({ user_id: user._id })
    setLoading(false)
   }).catch((axios) => {
    console.log(axios)
    setLoading(false)
   })
  }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [profileID, blogs])

 const resetPage = () => {
  setProfileLoaded("")
  setLoading(true)
  setProfile(profileDataStructure)
 }

 return (
  <PageAnimation>
   {loading ? (
    <Loader />
   ) : profile_username.length ? (
    <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
     <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
      <img
       src={profile_img}
       alt="Profile image"
       className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
      />
      <h1 className="text-2xl font-medium">@{profile_username}</h1>
      <p className="text-xl capitalize h-6">{fullname}</p>
      <p>
       {total_posts.toLocaleString()} Blogs -{" "}
       {total_reads.toLocaleString()} Reads
      </p>
      <div className="flex gap-4 mt-2">
       {profileID === username && (
        <Link
         to="/settings/edit-profile"
         className="btn-light rounded-md"
        >
         Edit Profile
        </Link>
       )}
      </div>
      <About
       bio={bio}
       social_links={social_links}
       joinedAt={joinedAt}
       className="max-md:hidden"
      />
     </div>
     <div className="max-md:mt-12 w-full">
      <InPageNavigation
       routes={["Blogs Published", "About"]}
       defaultHidden={["About"]}
      >
       <>
        {blogs === null ? (
         <Loader />
        ) : blogs.results.length ? (
         blogs.results.map((blog, i) => (
          <PageAnimation key={i} transition={{ delay: i * 0.08 }}>
           <BlogPost
            content={blog}
            author={{ profile_username, fullname, profile_img }}
           />
          </PageAnimation>
         ))
        ) : (
         <NoData message="No blogs published yet" />
        )}
        <LoadMore
         dataArr={blogs}
         fetchDataFunc={getBlogs}
        />
       </>
       <About
        bio={bio}
        social_links={social_links}
        joinedAt={joinedAt}
        className="md:hidden"
       />
      </InPageNavigation>
     </div>
    </section>
   ) : (
    <NotFound />
   )}
  </PageAnimation>
 )
}

export default Profile