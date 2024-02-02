/* eslint-disable no-undef */
import { useState, useEffect } from "react"
import { filterPaginationData } from "../common/filter-pagination-data"
import axios from "axios"
import BlogPost from "../components/BlogPost"
import Loader from "../components/Loader"
import LoadMore from "../components/LoadMore"
import NoBannerBlogPost from "../components/NoBannerBlogPost"
import NoData from "../components/NoData"
import InPageNavigation, { activeTabRef } from "../components/InPageNavigation"
import PageAnimation from "../components/PageAnimation"

const Home = () => {
 const [blogs, setBlogs] = useState(null)
 const [trendingBlogs, setTrendingBlogs] = useState(null)
 const [pageState, setPageState] = useState("home")

 let categories = [
  "programming",
  "hollywood",
  "film making",
  "social media",
  "cooking",
  "technology",
  "finances",
  "travel"
 ]

 const fetchLatestBlogs = ({ page = 1 }) => {
  axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", {
   page
  }).then(async ({ data }) => {
   let formattedData = await filterPaginationData({
    arr: blogs,
    data: data.blogs,
    page,
    countRoute: "/all-latest-blogs-count"
   })
   setBlogs(formattedData)
  }).catch((err) => {
   console.log(err)
  })
 }

 const fetchBlogsByCategory = ({ page = 1 }) => {
  axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
   tag: pageState,
   page
  }).then(async ({ data }) => {
   let formattedData = await filterPaginationData({
    arr: blogs,
    data: data.blogs,
    page,
    countRoute: "/search-blogs-count",
    data_to_send: { tag: pageState }
   })
   setBlogs(formattedData)
  }).catch((err) => {
   console.log(err)
  })
 }

 const fetchTrendingBlogs = () => {
  axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
  .then(({ data }) => {
   setTrendingBlogs(data.blogs)
  })
  .catch((err) => {
   console.log(err)
  })
 }

 useEffect(() => {
  activeTabRef.current.click()
  if (pageState !== "home") {
   fetchBlogsByCategory(pageState)
   return
  }
  fetchLatestBlogs({ page: 1 })
  if (!trendingBlogs) {
   fetchTrendingBlogs()
  }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [pageState])

 const TrendingBlogsWrapper = () => {
  return trendingBlogs === null ? (
   <Loader />
  ) : trendingBlogs.length ? (
   trendingBlogs.map((blog, i) => (
    <PageAnimation key={i}>
     <NoBannerBlogPost blog={blog} index={i} />
    </PageAnimation>
   ))
  ) : (
   <NoData message="No trending blogs found" />
  )
 }

 const loadBlogByCategory = (e) => {
  let category = e.target.innerText.toLowerCase()
  setBlogs(null)
  if (pageState === category) {
   setPageState("home")
   return
  }
  setPageState(category)
 }

 return (
  <PageAnimation>
   <section className="h-cover flex justify-center gap-10">
    <div className="w-full">
     <InPageNavigation
      routes={[pageState, "Trending Blogs"]}
      defaultHidden={["Trending Blogs"]}
     >
      <>
       {blogs == null ? (
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
        fetchDataFunc={pageState === "home" ? fetchLatestBlogs : fetchBlogsByCategory}
       />
      </>
      <TrendingBlogsWrapper />
     </InPageNavigation>
    </div>
    <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
     <div className="flex flex-col gap-10">
      <div>
       <h1 className="font-medium text-xl mb-8">Stories from all interests</h1>
       <div className="flex flex-wrap gap-3">
        {categories.map((category, i) => (
         <button
          key={i}
          onClick={loadBlogByCategory}
          className={"tag " + (pageState === category ? "bg-black text-white" : "")}
         >
          {category}
         </button>
        ))}
       </div>
      </div>
      <div>
       <h1 className="font-medium text-xl mb-8">
        Trending <i className="fi fi-rr-arrow-trend-up" />
       </h1>
       {trendingBlogs === null ? (
        <Loader />
       ) : trendingBlogs.length ? (
        trendingBlogs.map((blog, i) => (
         <PageAnimation key={i}>
          <NoBannerBlogPost blog={blog} index={i} />
         </PageAnimation>
        ))
       ) : (
        <NoData message="No trending blogs found" />
       )}
      </div>
     </div>
    </div>
   </section>
  </PageAnimation>
 )
}

export default Home