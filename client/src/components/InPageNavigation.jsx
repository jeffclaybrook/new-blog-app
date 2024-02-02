/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createRef, useEffect, useState } from "react"

export const activeTabLineRef = createRef()
export const activeTabRef = createRef()

const InPageNavigation = ({ className, routes, defaultHidden = [], defaultActiveIndex = 0, children }) => {
 let [inPageNavIndex, setInPageNavIndex] = useState(0)

 const changePageState = (e, i) => {
  let { offsetWidth, offsetLeft } = e
  activeTabLineRef.current.style.width = offsetWidth + "px"
  activeTabLineRef.current.style.left = offsetLeft + "px"
  setInPageNavIndex(i)
 }

 useEffect(() => {
  changePageState(activeTabRef.current, defaultActiveIndex)
 }, [defaultActiveIndex])

 return (
  <>
   <div className={"relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto " + className}>
    {routes.map((item, i) => (
     <button
      key={i}
      onClick={(e) => changePageState(e.target, i)}
      ref={i === defaultActiveIndex ? activeTabRef : null}
      className={"p-4 px-5 capitalize " + (defaultHidden.includes(item) ? " md:hidden " : "") + (inPageNavIndex === i ? "text-black" : "text-dark-grey")}
     >
      {item}
     </button>
    ))}
    <hr
     ref={activeTabLineRef}
     className="absolute bottom-0 duration-500"
    />
   </div>
   {Array.isArray(children) ? children[inPageNavIndex] : children}
  </>
 )
}

export default InPageNavigation