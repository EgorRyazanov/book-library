import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyAP-CSIQHrCmaBvIPqosTmtBtswec1h6vE",
    authDomain: "book-collections-d4e1d.firebaseapp.com",
    projectId: "book-collections-d4e1d",
    storageBucket: "book-collections-d4e1d.appspot.com",
    messagingSenderId: "463323264814",
    appId: "1:463323264814:web:c633784c8d9a04ad516cbf",
};

const app = initializeApp(firebaseConfig);

export default getFirestore(app);
