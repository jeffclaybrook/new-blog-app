import mongoose, { Schema } from "mongoose"

const blogSchema = mongoose.Schema({
 blog_id: {
  type: String,
  required: true,
  unique: true
 },
 title: {
  type: String,
  require: true
 },
 banner: {
  type: String
 },
 content: {
  type: []
 },
 tags: {
  type: [String]
 },
 author: {
  type: Schema.Types.ObjectId,
  require: true,
  ref: "users"
 },
 activity: {
  total_likes: {
   type: Number,
   default: 0
  },
  total_comments: {
   type: Number,
   default: 0
  },
  total_reads: {
   type: Number,
   default: 0
  },
  total_parent_comments: {
   type: Number,
   default: 0
  }
 },
 comments: {
  type: [Schema.Types.ObjectId],
  ref: "comments"
 },
 draft: {
  type: Boolean,
  default: false
 }
}, {
 timestamps: {
  createdAt: "publishedAt"
 }
})

export default mongoose.model("blogs", blogSchema)