/* eslint-disable react-refresh/only-export-components */
import EditorJS from "@editorjs/editorjs"
import Embed from "@editorjs/embed"
import List from "@editorjs/list"
import Image from "@editorjs/image"
import Header from "@editorjs/header"
import Quote from "@editorjs/quote"
import Marker from "@editorjs/marker"
import InlineCode from "@editorjs/inline-code"
import { uploadImage } from "../common/aws"

const UploadImageByFile = async (e) => {
 const url = await uploadImage(e)
 if (url) {
  return {
   success: 1,
   file: {url}
  }
 }
}

const UploadImageByURL = async (e) => {
 let link = new Promise((resolve, reject) => {
  try {
   resolve(e)
  } catch (err) {
   reject(err)
  }
 })
 const url = await link
 return {
  success: 1,
  file: {url}
 }
}

export const tools = new EditorJS({
 holder: "editorjs",
 embed: Embed,
 tools: {
  list: {
   class: List,
   inlineToolbar: true
  },
  header: {
   class: Header,
   config: {
    placeholder: "Type heading...",
    levels: [2, 3],
    defaultLevel: 2
   }
  },
  image: {
   class: Image,
   config: {
    uploader: {
     uploadByFile: UploadImageByFile,
     uploadByUrl: UploadImageByURL
    }
   }
  },
  quote: {
   class: Quote,
   inlineToolbar: true
  },
  marker: Marker,
  inlineCode: InlineCode
 }
})