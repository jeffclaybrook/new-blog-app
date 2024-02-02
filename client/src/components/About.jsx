/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
import { getFullDay } from "../common/date"

const About = ({ className, bio, social_links, joinedAt }) => (
 <div className={"md:w-[90%] md:mt-7 " + className}>
  <p className="text-xl leading-7">{bio.length ? bio : "Nothing to read here"}</p>
  <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
   {Object.keys(social_links).map((key) => {
    let link = social_links[key]
    return link && (
     <Link
      to={link}
      key={key}
      target="_blank"
      rel="noreferrer"
     >
      <i className={"fi text-2xl hover:text-black " + (key != "website" ? "fi-brands-" + key : "fi-br-link-alt")} />
     </Link>
    )
   })}
  </div>
  <p className="text-xl leading-7 text-dark-grey">Joined on {getFullDay(joinedAt)}</p>
 </div>
)

export default About