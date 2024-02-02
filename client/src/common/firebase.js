import { initializeApp } from "firebase/app"
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"

const firebaseConfig = {
 apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
 authDomain: "blog-app-5145e.firebaseapp.com",
 projectId: "blog-app-5145e",
 storageBucket: "blog-app-5145e.appspot.com",
 messagingSenderId: "431072341399",
 appId: "1:431072341399:web:211b71e0a62ce4dd10e8d2"
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