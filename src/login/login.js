// This is the frontend login code, but firebase can be here. Originally I thought people can steal data here, but apparently i just need to set the security rules on firebase.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  /*setPersistence,
  browserSessionPersistence,*/
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

// defines the object for different errors so that it can show readable texts
const error_message_dict = {
  // General Errors
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled. Contact support.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/invalid-credential': 'Incorrect password or email. Please try again.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',

  // Email/Password Sign-up
  'auth/email-already-in-use': 'This email is already registered.',
  'auth/weak-password': 'Password must be at least 6 characters.',
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
  'default': 'Login failed. Please try again.'
};

const firebaseConfig = {
  apiKey: "AIzaSyDyJypcRWMxxuHlwH-zs4nG4SG_2TKzqTo", //API Key is ok to be visible, cuz it's referring to the project
  authDomain: "revill-1770e.firebaseapp.com",
  projectId: "revill-1770e",
  storageBucket: "revill-1770e.firebasestorage.app",
  messagingSenderId: "187396121099",
  appId: "1:187396121099:web:25b18bc210608a88e35d0e",
  measurementId: "G-XY876RR1NJ"
};
const username_ele = document.querySelector("#username_input")
const password_ele = document.querySelector("#password_input")
const verify_ele = document.querySelector(".verify_btn")
const errormsg_ele = document.querySelector(".error_message")
const error_div_ele = document.querySelector(".error_div")
const submit_ele = document.querySelector("#submit_btn")
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function sendError(error_text,authorizeEmail=false) {
    const show_text = error_message_dict[error_text]!= null ? error_message_dict[error_text] : error_text
    errormsg_ele.innerText = show_text;
    error_div_ele.style.display = "block";
    if(!authorizeEmail) {
      verify_ele.classList.add("hide")
    } else {
      verify_ele.classList.remove("hide")
    }
}

submit_ele.addEventListener("click",async () => {
    const login_result = await sign_in();
    if (login_result['status']) {
        error_div.style.display = "none";
        if (login_result.user.emailVerified) {
          check_recaptcha();
        } else {
          sendError("Your email address is not authorized. Try to login again after authorizing it.",true)
        }
    } else {
        sendError(login_result.error,false)
    }
})

async function sign_in() {
    const email = username_ele.value;
    const password = password_ele.value;
    try {
        const result = await signInWithEmailAndPassword(auth, email, password)
        return {"status":true,"user":result.user}
    } catch (error) {
        return {"status":false,"error":error.code}
    }
}

verify_ele.addEventListener("click", async () => {
  await sendEmailVerification(auth.currentUser)
  alert("We've sent an authorization email to your mailbox, please check it to authorize your email")
})