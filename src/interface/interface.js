import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js"
import { 
    getFirestore
} from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';
import { 
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDyJypcRWMxxuHlwH-zs4nG4SG_2TKzqTo",
  authDomain: "revill-1770e.firebaseapp.com",
  projectId: "revill-1770e",
  storageBucket: "revill-1770e.firebasestorage.app",
  messagingSenderId: "187396121099",
  appId: "1:187396121099:web:25b18bc210608a88e35d0e",
  measurementId: "G-XY876RR1NJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
let authenticated = false;

onAuthStateChanged(auth,(user) => {
    if (!user || !user.emailVerified) {
        window.location.href = "../flashcard/flashcard.html"
    } else {
        authenticated = true;
    }
})
