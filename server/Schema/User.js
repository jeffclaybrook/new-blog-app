import mongoose, { Schema } from "mongoose"

const profile_imgs_name_list = [
 "Garfield",
 "Tinkerbell",
 "Annie",
 "Loki",
 "Cleo",
 "Angel",
 "Bob",
 "Mia",
 "Coco",
 "Gracie",
 "Bear",
 "Bella",
 "Abby",
 "Harley",
 "Cali",
 "Leo",
 "Luna",
 "Jack",
 "Felix",
 "Kiki"
]

const profile_imgs_collections_list = [
 "notionists-neutral",
 "adventurer-neutral",
 "fun-emoji"
]

const userSchema = mongoose.Schema({
 personal_info: {
  fullname: {
   type: String,
   lowercase: true,
   required: true,
   minlength: [1, "Fullname must be at least 1 character long"]
  },
  email: {
   type: String,
   lowercase: true,
   required: true,
   unique: true
  },
  password: String,
  username: {
   type: String,
   unique: true,
   minlength: [3, "Username must be at least 3 characters long"]
  },
  bio: {
   type: String,
   default: "",
   maxlength: [200, "Bio must be 200 characters or less"]
  },
  profile_img: {
   type: String,
   default: () => {
    return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`
   }
  }
 },
 social_links: {
  youtube: {
   type: String,
   default: "https://www.youtube.com/"
  },
  instagram: {
   type: String,
   default: "https://www.instagram.com/"
  },
  facebook: {
   type: String,
   default: "https://www.facebook.com/"
  },
  twitter: {
   type: String,
   default: "https://www.twitter.com/"
  },
  github: {
   type: String,
   default: "https://www.github.com/"
  },
  website: {
   type: String,
   default: ""
  }
 },
 account_info: {
  total_posts: {
   type: Number,
   default: 0
  },
  total_reads: {
   type: Number,
   default: 0
  }
 },
 google_auth: {
  type: Boolean,
  default: false
 },
 blogs: {
  type: [Schema.Types.ObjectId],
  default: [],
  ref: "blogs"
 }
}, {
 timestamps: {
  createdAt: "joinedAt"
 }
})

export default mongoose.model("users", userSchema)