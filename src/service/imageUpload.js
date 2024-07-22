// imageUpload.js
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { imageDB } from '~/firebase/firebaseConfig'

export const uploadImage = async (imageFile) => {
  const imageRef = ref(imageDB, `images/${uuidv4()}`)
  const snapshot = await uploadBytes(imageRef, imageFile)
  return await getDownloadURL(snapshot.ref)
}
