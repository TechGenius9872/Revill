// this is the signup page, the API keys still can expose, won't restrict people to be in SPCC to sign up
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  sendEmailVerification,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDyJypcRWMxxuHlwH-zs4nG4SG_2TKzqTo", //API Key is ok to be visible, cuz it's referring to the project
  authDomain: "revill-1770e.firebaseapp.com",
  projectId: "revill-1770e",
  storageBucket: "revill-1770e.firebasestorage.app",
  messagingSenderId: "187396121099",
  appId: "1:187396121099:web:25b18bc210608a88e35d0e",
  measurementId: "G-XY876RR1NJ"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const error_message_dict = {
  // General Errors
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled. Contact support.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/invalid-credential': 'Incorrect password or email. Please try again.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',

  // Email/Password Sign-up
  'auth/email-already-in-use': 'This email is already registered. Please login instead.',
  'auth/weak-password': 'Password must include at least 6 characters.',
  'auth/operation-not-allowed': 'Email/password login is not enabled.',

  // Google/Federated Auth
  'auth/unauthorized-domain': 'Login with google is not allowed from this domain.',
  'auth/popup-blocked': 'Popup was blocked. Try a different browser or login with email and password.',
  'auth/popup-closed-by-user': 'Login cancelled by closing popup.',
  'auth/account-exists-with-different-credential': 
    'This email is already linked to another login method.',

  // Token/Session
  'auth/invalid-user-token': 'Session expired. Please login again.',
  'auth/user-token-expired': 'Session expired. Please login again.',
  'auth/null-user': 'No active user session.',

  // Configuration/Network
  'auth/api-key-not-valid': 'Configuration error. Contact support.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/internal-error': 'Server error. Please try again.',

  // Default fallback
  'default': 'Login failed. Please try again.',
  'Confirm-wrong':'The password you input and the confirmation one is different. Please try again.',
  'No-username':"Please enter your username.",
  '500':"There's something wrong with our server. If this problem continues, please contact us."
};

const email_ele = document.querySelector("#email_input")
const password_ele = document.querySelector("#password_input")
const confirm_ele = document.querySelector("#confirm_password")
const username_ele = document.querySelector("#username_input")
const submit_btn = document.querySelector("#submit_btn");
const error_div = document.querySelector(".error_div")
const error_ele = document.querySelector(".error_message")
const authorization_div = document.querySelector(".authorization_div");
const authorization_btn = document.querySelector(".authorization_btn")
let can_signin = false;

setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Now you can sign in
    can_signin = true;
  })
  .catch((error) => {
    console.log(error)
    sendError("500")
  });

function sendError(error_text) {
    const show_text = error_message_dict[error_text]!= undefined ? error_message_dict[error_text] : error_text
    error_ele.innerText = show_text;
    error_div.style.display = "block";
}

authorization_btn.addEventListener("click", () => {
  location.reload();
})

submit_btn.addEventListener("click",async () => {
    if (can_signin) {
        const signup_result = await sign_up()
        updateProfile(signup_result["user"],{"displayName":username_ele.value})
        if (signup_result["status"]) {
            await sendEmailVerification(auth.currentUser);
            console.log("sent email")
            authorization_div.style.display = "block";
        } else {
            sendError(signup_result["error"])
        }
    }
})

function long_enough() {
    const active = password_ele.value.length >= 6
    return active;
}

async function sign_up() {
    const email = email_ele.value
    const password = password_ele.value
    const confirming = confirm_ele.value
    try {
        if (confirming === password) {
            if (long_enough() && username_ele.value != "") {
                if (username_ele.value != "") {
                    const result = await createUserWithEmailAndPassword(auth, email, password)
                    return {"status":true,"user":result.user}
                } else {
                    return {'status':false,"error":"No-username"}
                }
            }
        } else {
            return {"status":false,"error":"Confirm-wrong"}
        }
    } catch (err) {
        return {"status":false,"error":err.code}
    }
}

onAuthStateChanged(auth, (user) => {
  if (user.emailVerified) {
    window.location.href = "../flashcard/flashcard.html";
  }
})