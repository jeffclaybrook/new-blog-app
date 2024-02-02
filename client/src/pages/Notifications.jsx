import { useState, useEffect, useContext } from "react"
import { UserContext } from "../App"
import { filterPaginationData } from "../common/filter-pagination-data"
import axios from "axios"
import Loader from "../components/Loader"
import LoadMore from "../components/LoadMore"
import NoData from "../components/NoData"
import NotificationCard from "../components/NotificationCard"
import PageAnimation from "../components/PageAnimation"

const Notifications = () => {
 const [filter, setFilter] = useState("all")
 const [notifications, setNotifications] = useState(null)

 let {
  userAuth,
  userAuth: {
   access_token,
   new_notifications_available
  },
  setUserAuth
 } = useContext(UserContext)

 let filters = ["all", "like", "comment", "reply"]

 const fetchNotifications = ({ page, deletedDocCount = 0 }) => {
  axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/notifcations", {
   page, filter, deletedDocCount
  }, {
   headers: {
    Authorization: `Bearer ${access_token}`
   }
  }).then(async ({ data: { notifications: data } }) => {
   if (new_notifications_available) {
    setUserAuth({ ...userAuth, new_notifications_available: false })
   }
   let formattedData = await filterPaginationData({
    arr: notifications,
    data,
    page,
    countRoute: "/all-notification-count",
    data_to_send: { filter },
    user: access_token
   })
   setNotifications(formattedData)
  }).catch((err) => {
   console.log(err)
  })
 }

 useEffect(() => {
  if (access_token) {
   fetchNotifications({ page: 1 })
  }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [access_token, filter])

 const handleFilter = (e) => {
  let btn = e.target
  setFilter(btn.innerHTML)
  setNotifications(null)
 }

 return (
  <div>
   <h1 className="max-md:hidden">Recent Notifications</h1>
   <div className="flex gap-6 my-8">
    {filters.map((filtername, i) => (
     <button
      key={i}
      onClick={handleFilter}
      className={"py-2 " + (filter === filtername ? "btn-dark" : "btn-light")}
     >
      {filtername}
     </button>
    ))}
   </div>
   {notifications === null ? (
    <Loader />
   ) : (
    <>
     {notifications.results.length ? (
      notifications.results.map((notifcation, i) => (
       <PageAnimation key={i} transition={{ delay: i * 0.08 }}>
        <NotificationCard
         data={notifcation}
         index={i}
         notificationData={{ notifications, setNotifications }}
        />
       </PageAnimation>
      ))
     ) : (
      <NoData message="Nothing available" />
     )}
     <LoadMore
      dataArr={notifications}
      fetchDataFunc={fetchNotifications}
      additionalParams={{
       deletedDocCount: notifications.deletedDocCount
      }}
     />
    </>
   )}
  </div>
 )
}

export default Notifications