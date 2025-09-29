const import_quizlet_ele = document.querySelector("#import")
import_quizlet_ele.onclick = () => {location.href = "../import/import.html"}

// Use v10 for everything
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    setDoc,
    deleteDoc,
    writeBatch,
    getDocs
} from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js'; // ← SAME VERSION!
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

async function createFlashcards(flashcard_obj, title) {
    try {
        const uid = auth.currentUser.uid
        const flashcard_ref = doc(collection(db, 'public_flashcards'));
        const flashcard_id = flashcard_ref.id;
        
        // Construct main data
        const main_data = {
            "metadata": {
                "title": title,
                "total_cards": Object.keys(flashcard_obj).length,
                "user":uid
            }
        };
        
        await setDoc(flashcard_ref, main_data);
        
        const keys = Object.keys(flashcard_obj);
        for (let i = 0; i < keys.length; i++) {
            const card_ref = doc(db, 'public_flashcards', flashcard_id, 'cards', i.toString());
            const card_data = {
                "question": keys[i],
                "answer": flashcard_obj[keys[i]],
                "order": i
            };
            await setDoc(card_ref, card_data);
        }
        const user_data_ref = doc(db, "users", uid,"flashcards",flashcard_id)
        await setDoc(user_data_ref, {"title":title})
        console.log("Flashcards created successfully! ID:", flashcard_id);
        return flashcard_id;
    } catch (error) {
        console.error("Error creating flashcards:", error);
    }
}

async function deleteFlashcard(flashcard_id) {
    //delete documents in "cards" subcollection first:
    const batch = writeBatch(db)
    const snapshot = await getDocs(collection(db,"public_flashcards",flashcard_id,"cards"))
    snapshot.docs.forEach((item) => {
        batch.delete(item.ref)
    })
    batch.delete(doc(db,"public_flashcards",flashcard_id))
    batch.delete(doc(db,"users",auth.currentUser.uid,"flashcards",flashcard_id))
    await batch.commit()
}

onAuthStateChanged(auth,async (user) => {
    if (!user || !user.emailVerified) {
        window.location.href = "../index/index.html";
    } else {
        document.body.style.visibility = "visible";
    }
})