import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js"
import { 
    getFirestore,
    getDoc,
    doc,
    collection
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
let loaded_alr = false;

onAuthStateChanged(auth,(user) => {
    if (!user || !user.emailVerified) {
        window.location.href = "../flashcard/flashcard.html"
    } else {
        if (!loaded_alr) {
            document.body.style.visibility = "visible";
            main()
        }
        loaded_alr = true;
    }
})

async function refresh_flashcardNumber() {
    const profile_ref = doc(db,"users",auth.currentUser.uid)
    const profile = await getData(profile_ref,{"flashcards_stored":0})
    const data = profile['flashcards_stored']
    localStorage.setItem("num_of_flashcards",data)
    return data;
}

async function refresh_accuracy() {
    const performance_ref = doc(db, "users",auth.currentUser.uid,"flashcards", "general_performance")
    const performance = await getData(performance_ref, {"correct_ans":0,"wrong_ans":0})
    const correct = performance["correct_ans"];
    const wrong = performance["wrong_ans"];
    const accuracy = `${(correct/(correct+wrong) || 0)*100}%`
    localStorage.setItem("accuracy",accuracy)
    return accuracy
}

async function main() {
    /*basic stats stuff*/
    const username_eles = Array.from(document.querySelectorAll(".username"))
    username_eles.forEach((ele) => { ele.innerText = auth.currentUser.displayName })
    const pfp_eles = Array.from(document.querySelectorAll(".user_image"))
    pfp_eles.forEach((ele) => { ele.src = auth.currentUser.photoURL })

    /*number of flashcards*/
    const num_of_flashcards_ele = document.querySelector("#num_of_flashcards")
    num_of_flashcards_ele.innerText = localStorage.getItem("num_of_flashcards") || await refresh_flashcardNumber()

    /*accuracy*/
    const accuracy_ele = document.querySelector("#accuracy")
    accuracy_ele.innerText = localStorage.getItem("accuracy") || await refresh_accuracy()
}

async function getData(ref, fallback) {
    const doc_snapshot = await getDoc(ref)
    if (doc_snapshot.exists()) {
        console.log("exists for",ref)
        return doc_snapshot.data()
    } else {
        if (fallback) {
            console.log(fallback,"\nfallback.")
            return fallback
        } else {
            throw new Error("Data not existing")
        }
    }
}