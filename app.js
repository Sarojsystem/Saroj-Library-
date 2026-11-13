// 1) Create a Firebase project, enable Authentication (Email/Password), Firestore and Storage.
// 2) Paste your Firebase web app config below.
// 3) Create your admin user in Firebase Authentication and put that user's UID in ADMIN_UID.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_PROJECT.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT.appspot.com",
  appId: "PASTE_APP_ID"
};
const ADMIN_UID = "PASTE_ADMIN_USER_UID";
const configured = !Object.values(firebaseConfig).some(v => String(v).startsWith("PASTE_")) && !ADMIN_UID.startsWith("PASTE_");
const $ = id => document.getElementById(id);
$("year").textContent = new Date().getFullYear();
let app, auth, db, storage, isAdmin = false, qaItems = [], pdfItems = [];
function status(msg){$("status").textContent=msg;$("status").style.display="block";setTimeout(()=>$("status").style.display="none",3500)}
if(!configured){status("Setup required: follow README to connect Firebase before publishing.");}
else {
 app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);storage=getStorage(app);
 onAuthStateChanged(auth,user=>{isAdmin=!!user&&user.uid===ADMIN_UID;$("adminPanel").hidden=!isAdmin;$("loginBtn").hidden=isAdmin;$("logoutBtn").hidden=!isAdmin;});
 onSnapshot(query(collection(db,"questions"),orderBy("createdAt","desc")),s=>{qaItems=s.docs.map(d=>({id:d.id,...d.data()}));render();});
 onSnapshot(query(collection(db,"pdfs"),orderBy("createdAt","desc")),s=>{pdfItems=s.docs.map(d=>({id:d.id,...d.data()}));render();});
}
$("loginBtn").onclick=async()=>{if(!configured)return status("Firebase setup is not complete.");const email=prompt("Admin email");if(!email)return;const password=prompt("Admin password");if(!password)return;try{await signInWithEmailAndPassword(auth,email,password)}catch(e){status(e.message)}};
$("logoutBtn").onclick=()=>signOut(auth);
$("qaForm").onsubmit=async e=>{e.preventDefault();if(!isAdmin)return;try{await addDoc(collection(db,"questions"),{question:$("question").value,answer:$("answer").value,createdAt:serverTimestamp()});e.target.reset();status("Question added.")}catch(err){status(err.message)}};
$("pdfForm").onsubmit=async e=>{e.preventDefault();if(!isAdmin)return;const f=$("pdfFile").files[0];if(!f||f.type!=="application/pdf")return status("Please choose a PDF file.");try{const path=`pdfs/${Date.now()}-${f.name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;const r=ref(storage,path);await uploadBytes(r,f);const url=await getDownloadURL(r);await addDoc(collection(db,"pdfs"),{title:$("pdfTitle").value,subject:$("pdfSubject").value,url,path,createdAt:serverTimestamp()});e.target.reset();status("PDF uploaded.")}catch(err){status(err.message)}};
function render(){const term=$("search").value.toLowerCase();$("qaList").innerHTML="";$("pdfList").innerHTML="";
 qaItems.filter(x=>(x.question+" "+x.answer).toLowerCase().includes(term)).forEach(x=>{const el=document.createElement("article");el.className="card";el.innerHTML=`<h3></h3><p></p>`;el.querySelector("h3").textContent=x.question;el.querySelector("p").textContent=x.answer;if(isAdmin){const b=document.createElement("button");b.className="delete";b.textContent="Delete";b.onclick=async()=>{if(confirm("Delete this Q&A?"))await deleteDoc(doc(db,"questions",x.id))};el.append(b)}$("qaList").append(el)});
 pdfItems.filter(x=>(x.title+" "+(x.subject||"")).toLowerCase().includes(term)).forEach(x=>{const el=document.createElement("article");el.className="card";const h=document.createElement("h3");h.textContent=x.title;const p=document.createElement("p");p.textContent=x.subject||"Study material";const a=document.createElement("a");a.href=x.url;a.target="_blank";a.rel="noopener";a.textContent="Open / Download PDF";a.style.color="#2563eb";el.append(h,p,a);if(isAdmin){const b=document.createElement("button");b.className="delete";b.textContent="Delete";b.onclick=async()=>{if(confirm("Delete this PDF?")){await deleteObject(ref(storage,x.path));await deleteDoc(doc(db,"pdfs",x.id))}};el.append(b)}$("pdfList").append(el)});
}
$("search").addEventListener("input",render);
