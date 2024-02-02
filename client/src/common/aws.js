import axios from "axios"

export const uploadImage = async (image) => {
 let imageUrl = null

 await axios
  .get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url")
  .then(async ({
   data: { uploadURL }
  }) => {
   await axios({
    method: "PUT",
    url: uploadURL,
    headers: { "Content-Type": "multipart/form-data" },
    data: image
   })
   .then(() => {
    imageUrl = uploadURL.split("?")[0]
   })
  })
  .catch(err => {
   console.log(err)
  })

  return imageUrl
}