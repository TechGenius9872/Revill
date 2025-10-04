const import_quizlet_ele = document.querySelector("#import")
import_quizlet_ele.onclick = () => {window.open("../import/import.html","__blank")}

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
const add_pairs_btn = document.querySelector("#add")
const create_btn = document.querySelector("#complete")
const title_input_ele = document.querySelector("#title")
let number_of_rows = 2;

onAuthStateChanged(auth,async (user) => {
    if (!user || !user.emailVerified) {
        window.location.href = "../index/index.html";
    } else {
        document.body.style.visibility = "visible";
    }
})

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

function evenNumber(integer) {
    return (integer % 2 == 0)
}

function addRow() {
    const row = document.createElement("div")
    const parent_div = document.querySelector(".rows_parent")
    const HTML_content = `
        <div class="flashcard-term">
            <input type="text" placeholder="Enter Term" class="flashcard-input term_input">
        </div>
        <div class="flashcard-definition">
            <input type="text" placeholder="Enter Definition" class="flashcard-input definition_input">
        </div>`
    row.innerHTML = HTML_content;
    row.className = `flashcard-bar${evenNumber(number_of_rows) ? 1 : 2}`
    number_of_rows++;
    parent_div.appendChild(row)
}

function generate_flashcardJSON() {
    const key_ele_list = document.querySelectorAll(".term_input")
    const answer_ele_list = document.querySelectorAll(".definition_input")
    let key_list = [];
    let answer_list = [];
    key_ele_list.forEach((textbox) => {
        key_list.push(textbox.value)
    })
    answer_ele_list.forEach((textbox) => {
        answer_list.push(textbox.value)
    })
    let json = {};
    for (let i in key_list) {
        json[key_list[i]] = answer_list[i];
    }
    return json;
}

add_pairs_btn.addEventListener("click", () => {
    addRow();
    window.scrollTo(0, document.body.scrollHeight);
})

create_btn.addEventListener("click",() => {
    const json_flashcards = generate_flashcardJSON();
    const title = title_input_ele.value;
    createFlashcards(json_flashcards,title);
})

// ----------------------------- handle import from quizlet ------------------------------------------------

window.addEventListener("storage",(event) => {
    if (event.key === "imported_flashcard") {
        const imported_data = localStorage.getItem("imported_flashcard")
        fill_importedData(JSON.parse(imported_data))
    }
})

function fill_importedData(data) {
    localStorage.removeItem("imported_flashcard");
    const keys = Object.keys(data)
    const values = Object.values(data)
    for (let i = 0; i < keys.length-2; i++) {
        add_pairs_btn.click()
    }
    const keys_input_ele = Array.from(document.querySelectorAll(".term_input"))
    const values_input_ele = Array.from(document.querySelectorAll(".definition_input"))
    console.log(keys_input_ele)
    console.log(values_input_ele)
    
    for (let i in keys_input_ele) {
        keys_input_ele[i].value = keys[i]
    }
    for (let j in values_input_ele) {
        values_input_ele[j].value = values[j]
    }
}