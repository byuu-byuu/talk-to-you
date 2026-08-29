// --- PANEL TOGGLE LOGIC ---
function toggleMessagePanel() {
  const msgPanel = document.getElementById("messagePanel");
  const glassPanel = document.getElementById("mainPanel");
  
  // အခြား Tab Panel ပွင့်နေပါက ပိတ်မည်
  if (glassPanel) glassPanel.classList.add("hidden");
  
  // Message Panel ကို Slide/Toggle ပြုလုပ်မည်
  if (msgPanel) {
    msgPanel.classList.toggle("hidden");
  }
}

function openPanel(tabId, btnElement) {
  const msgPanel = document.getElementById("messagePanel");
  if (msgPanel) msgPanel.classList.add("hidden");

  const panel = document.getElementById("mainPanel");
  const targetTab = document.getElementById(tabId);
  
  if (!panel.classList.contains("hidden") && !targetTab.classList.contains("hidden")) {
    panel.classList.add("hidden");
    btnElement.classList.remove("active");
    return;
  }
  
  panel.classList.remove("hidden");
  document.querySelectorAll(".tab-page").forEach(p => p.classList.add("hidden"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  targetTab.classList.remove("hidden");
  btnElement.classList.add("active");
}

function handlePanelChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("panelChatInput");
  const chatMessages = document.getElementById("chatMessages");
  const text = input.value.trim();
  
  if (text) {
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble sent";
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    input.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// --- VIDEO CHAT & WEBCAM LOGIC ---
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const messageInput = document.getElementById('messageInput');
const chatOverlay = document.getElementById('chatOverlay');
async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideo) localVideo.srcObject = stream;
  } catch (err) { console.error(err); }
}

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble sent';
  bubble.textContent = `You: ${text}`;
  chatOverlay.appendChild(bubble);
  messageInput.value = '';
  chatOverlay.scrollTop = chatOverlay.scrollHeight;
}

function handleChatSubmit(e) {
  e.preventDefault();
  sendMessage();
}

startWebcam();

// --- MATCHING LOGIC ---
let isMatching = false;
let matchTimer = null;
let seconds = 0;

/* function toggleStartStop() {
  const startStopBtn = document.getElementById("startStopBtn");
  const nextBtn = document.getElementById("nextBtn");
  const matchStatus = document.getElementById("matchStatus");
  const remoteLabel = document.getElementById("remoteLabel");

  if (!isMatching) {
    isMatching = true;
    startStopBtn.innerText = "Stop";
    startStopBtn.classList.add("stop-active");
    nextBtn.disabled = false;
    
    matchStatus.innerHTML = "Searching for partner...";
    if (remoteLabel) remoteLabel.textContent = "Connecting...";

    setTimeout(() => {
      if (isMatching) {
        matchStatus.innerHTML = `Live Match: <strong id="timer">00:00</strong>`;
        if (remoteLabel) remoteLabel.textContent = "Partner";
        startMatchTimer();
      }
    }, 2000);

  } else {
    isMatching = false;
    startStopBtn.innerText = "Start";
    startStopBtn.classList.remove("stop-active");
    nextBtn.disabled = true;
    
    matchStatus.innerHTML = "Press Start to Match";
    if (remoteLabel) remoteLabel.textContent = "Offline";
    stopMatchTimer();
  }
}

function nextMatch() {
  if (isMatching) {
    const matchStatus = document.getElementById("matchStatus");
    const remoteLabel = document.getElementById("remoteLabel");
    
    stopMatchTimer();
    matchStatus.innerHTML = "Searching for next partner...";
    if (remoteLabel) remoteLabel.textContent = "Connecting...";
  }}
 */
/*1.. MODIFICATION ToggleStartStop and NextStep */
// Random သုံးမည့် Nicknames များ
const randomNicknames = ["Alex", "Sophia", "Daniel", "Emma", "Michael", "Chloe", "Lucas", "Maya"];

function toggleStartStop() {
  const startStopBtn = document.getElementById("startStopBtn");
  const nextBtn = document.getElementById("nextBtn");
  const matchStatus = document.getElementById("matchStatus");
  const remoteLabel = document.getElementById("remoteLabel");

  if (!isMatching) {
    isMatching = true;
    startStopBtn.innerText = "Stop";
    startStopBtn.classList.add("stop-active");
    nextBtn.disabled = false;
    
    matchStatus.innerHTML = "Searching for partner...";
    if (remoteLabel) remoteLabel.textContent = "Connecting...";

    setTimeout(() => {
      if (isMatching) {
        matchStatus.innerHTML = `Live Match: <strong id="timer">00:00</strong>`;
        
        // Match ဖြစ်ပါက Nickname များကို Random ယူ၍ ဘယ်ဘက်အောက် Label တွင် ပြောင်းပေးခြင်း
        const randomName = randomNicknames[Math.floor(Math.random() * randomNicknames.length)];
        if (remoteLabel) remoteLabel.textContent = randomName;
        
        startMatchTimer();
      }
    }, 2000);

  } else {
    isMatching = false;
    startStopBtn.innerText = "Start";
    startStopBtn.classList.remove("stop-active");
    nextBtn.disabled = true;
    
    matchStatus.innerHTML = "Press Start to Match";
    // Stop လိုက်ပါက ဘယ်ဘက်အောက် Label ကို Offline သို့ ပြန်ပြောင်းခြင်း
    if (remoteLabel) remoteLabel.textContent = "Offline";
    stopMatchTimer();
  }
}

function nextMatch() {
  if (isMatching) {
    const matchStatus = document.getElementById("matchStatus");
    const remoteLabel = document.getElementById("remoteLabel");
    
    stopMatchTimer();
    matchStatus.innerHTML = "Searching for next partner...";
    if (remoteLabel) remoteLabel.textContent = "Connecting...";

    setTimeout(() => {
      if (isMatching) {
        matchStatus.innerHTML = `Live Match: <strong id="timer">00:00</strong>`;
        
        // Next Match တွင်လည်း Nickname အသစ် ပြောင်းပေးခြင်း
        const randomName = randomNicknames[Math.floor(Math.random() * randomNicknames.length)];
        if (remoteLabel) remoteLabel.textContent = randomName;
        
        startMatchTimer();
      }
    }, 1500);
  }
}

/* INSERTION OPEN MESSAGE PANEL/ CLOSE MESSAGE PANNEL */// Function to open panel on mouseover
function openMessagePanel() {
  const msgPanel = document.getElementById("messagePanel");
  const glassPanel = document.getElementById("mainPanel");
  
  if (glassPanel) glassPanel.classList.add("hidden");
  if (msgPanel) msgPanel.classList.remove("hidden");
}

function closeMessagePanel() {
  const msgPanel = document.getElementById("messagePanel");
  if (msgPanel) msgPanel.classList.add("hidden");
}

// Function to sync Partner's Nickname across label, chat header, and chat list
function updatePartnerNickname(name) {
  const remoteLabel = document.getElementById("remoteLabel");
  const chatRoomHeader = document.getElementById("chatRoomHeader");
  const chatListName = document.getElementById("chatListName");
  const chatListAvatar = document.getElementById("chatListAvatar");

  if (remoteLabel) remoteLabel.textContent = name;
  if (chatRoomHeader) chatRoomHeader.textContent = name;
  if (chatListName) chatListName.textContent = name;
  if (chatListAvatar && name.length > 0) {
    chatListAvatar.textContent = name.charAt(0).toUpperCase();
  }
}

// Update matching logic to reflect the partner nickname
function toggleStartStop() {
  const startStopBtn = document.getElementById("startStopBtn");
  const nextBtn = document.getElementById("nextBtn");
  const matchStatus = document.getElementById("matchStatus");

  if (!isMatching) {
    isMatching = true;
    startStopBtn.innerText = "Stop";
    startStopBtn.classList.add("stop-active");
    nextBtn.disabled = false;
    
    matchStatus.innerHTML = "Searching for partner...";
    updatePartnerNickname("Connecting...");

    setTimeout(() => {
      if (isMatching) {
        matchStatus.innerHTML = `Live Match: <strong id="timer">00:00</strong>`;
        
        // Retrieve nickname assigned by user profile or default
        const userSavedName = document.getElementById("profDisplayName")?.value.trim() 
                              || currentUser?.displayName 
                              || "Partner";

        updatePartnerNickname(userSavedName);
        startMatchTimer();
      }
    }, 2000);

  } else {
    isMatching = false;
    startStopBtn.innerText = "Start";
    startStopBtn.classList.remove("stop-active");
    nextBtn.disabled = true;
    
    matchStatus.innerHTML = "Press Start to Match";
    updatePartnerNickname("Offline");
    stopMatchTimer();
  }
}

function nextMatch() {
  if (isMatching) {
    const matchStatus = document.getElementById("matchStatus");
    
    stopMatchTimer();
    matchStatus.innerHTML = "Searching for next partner...";
    updatePartnerNickname("Connecting...");

    setTimeout(() => {
      if (isMatching) {
        matchStatus.innerHTML = `Live Match: <strong id="timer">00:00</strong>`;
        
        const userSavedName = document.getElementById("profDisplayName")?.value.trim() 
                              || currentUser?.displayName 
                              || "Partner";

        updatePartnerNickname(userSavedName);
        startMatchTimer();
      }
    }, 1500);
  }
}

/* f r o m h e r e  */
// Profile Form ကို ဖွင့်/ပိတ် ပြုလုပ်ရန်
function toggleProfileForm() {
  const form = document.getElementById("profileForm");
  if (form) {
    form.classList.toggle("hidden-form");
  }
}

// Image Preview & Upload/Edit Button Text ပြောင်းရန်
function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.getElementById("profilePreview");
      if (img) img.src = e.target.result;
      
      localStorage.setItem("profileImage", e.target.result);
      updateUploadBtnText(true);
    };
    reader.readAsDataURL(file);
  }
}

function updateUploadBtnText(hasImage) {
  const btnText = document.getElementById("uploadBtnText");
  if (btnText) {
    btnText.innerText = hasImage ? "Edit Picture" : "Upload Picture";
  }
}

// Profile Data များကို Save ရန်
function saveProfileData(event) {
  event.preventDefault();

  let usernameVal = document.getElementById("profUsername")?.value.trim() || "";
  const nicknameVal = document.getElementById("profNickname")?.value.trim() || "";
  const bioVal = document.getElementById("profBio")?.value.trim() || "";
  const dobVal = document.getElementById("profDob")?.value || "";

  // Username ရှေ့တွင် @ ထည့်ပေးရန်
  if (usernameVal && !usernameVal.startsWith("@")) {
    usernameVal = "@" + usernameVal;
  }

  // UI ပေါ်တွင် စာသားများ ချက်ချင်း အစားထိုးရန်
  const handleEl = document.getElementById("displayHandle");
  const nicknameEl = document.getElementById("displayNickname");
  const bioEl = document.getElementById("displayUserBio");

  if (handleEl) handleEl.innerText = usernameVal || "@username";
  if (nicknameEl) nicknameEl.innerText = nicknameVal || "Nickname";
  if (bioEl) bioEl.innerText = bioVal || "No bio added yet.";

  // LocalStorage ထဲ သိမ်းဆည်းရန်
  const profileData = { 
    username: usernameVal, 
    nickname: nicknameVal, 
    bio: bioVal, 
    dob: dobVal 
  };
  localStorage.setItem("userProfile", JSON.stringify(profileData));

  // Form ကို ပြန်ဖျောက်ရန်
  const form = document.getElementById("profileForm");
  if (form) form.classList.add("hidden-form");

  alert("Profile Saved Successfully!");
}

// Page Load သည့်အခါ သိမ်းထားသော Data များကို ပြန်ဖတ်ရန်
document.addEventListener("DOMContentLoaded", function() {
  const savedData = localStorage.getItem("userProfile");
  const form = document.getElementById("profileForm");
 /*  t h i s  */
 // DOMContentLoaded ထဲတွင် ထည့်ရန်
const bioInput = document.getElementById("profBio");
if (bioInput) {
  bioInput.addEventListener("input", updateBioCounter);
  updateBioCounter(); // Initial load
}
 /* t h i s */

  if (savedData) {
    const data = JSON.parse(savedData);
    
    if (document.getElementById("profUsername")) document.getElementById("profUsername").value = data.username ? data.username.replace("@", "") : "";
    if (document.getElementById("profNickname")) document.getElementById("profNickname").value = data.nickname || "";
    if (document.getElementById("profBio")) document.getElementById("profBio").value = data.bio || "";
    if (document.getElementById("profDob")) document.getElementById("profDob").value = data.dob || "";

    if (document.getElementById("displayHandle")) document.getElementById("displayHandle").innerText = data.username || "@username";
    if (document.getElementById("displayNickname")) document.getElementById("displayNickname").innerText = data.nickname || "Nickname";
    if (document.getElementById("displayUserBio")) document.getElementById("displayUserBio").innerText = data.bio || "No bio added yet.";

    if (form) form.classList.add("hidden-form");
  }

  // Profile ပုံ ရှိမရှိ စစ်ဆေးပြီး Upload/Edit Text ပြောင်းရန်
  const savedImg = localStorage.getItem("profileImage");
  if (savedImg && document.getElementById("profilePreview")) {
    document.getElementById("profilePreview").src = savedImg;
    updateUploadBtnText(true);
  } else {
    updateUploadBtnText(false);
  }
});
/* t o h e r e */

// Bio စာလုံးရေ ၂၅ လုံး ရေတွက်ပြသည့် Function
function updateBioCounter() {
  const bioInput = document.getElementById("profBio");
  const charCount = document.getElementById("bioCharCount");
  if (bioInput && charCount) {
    charCount.innerText = bioInput.value.length;
  }
}

// saveProfileData() function ထဲတွင်လည်း bioVal ကို ၂၅ လုံးအထိပဲ ယူရန် slice ထည့်ပေးပါ -
// const bioVal = document.getElementById("profBio")?.value.trim().slice(0, 25) || "";

/* t o h e r e */


