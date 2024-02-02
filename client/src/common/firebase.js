import { initializeApp } from "firebase/app"
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"

const firebaseConfig = {
 apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
 authDomain: "",
 projectId: "",
 storageBucket: "",
 messagingSenderId: "",
 appId: ""
}

export const app = initializeApp(firebaseConfig)

const provider = new GoogleAuthProvider()
const auth = getAuth()

export const authWithGoogle = async () => {
 let user = null

 await signInWithPopup(auth, provider)
  .then(result => {
   user = result.user
  })
  .catch(err => {
   console.log(err)
  })

 return user
}