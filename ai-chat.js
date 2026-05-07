const style = document.createElement("style");

style.innerHTML = `

/* =========================
   🤖 WTC AI CHAT PRO
========================= */

.ai-chat-button {
  position: fixed;
  left: 20px;
  bottom: 20px;
  background: linear-gradient(135deg, #111, #333);
  color: white;
  padding: 14px 20px;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0,0,0,0.25);
  z-index: 9999;
  animation: aiGlow 2.5s infinite;
  font-weight: bold;
  font-size: 14px;
  user-select: none;
}

@keyframes aiGlow {

  0% {
    box-shadow: 0 0 0 rgba(0,255,255,0);
  }

  50% {
    box-shadow:
      0 0 15px rgba(0,255,255,0.7),
      0 0 35px rgba(0,255,255,0.5);
  }

  100% {
    box-shadow: 0 0 0 rgba(0,255,255,0);
  }

}

.ai-chat-box {

  position: fixed;

  left: 50%;
  transform: translateX(-50%);

  bottom: 90px;

  width: 95%;
  max-width: 400px;

  height: 72vh;

  background: white;

  border-radius: 24px;

  overflow: hidden;

  display: none;

  box-shadow: 0 20px 60px rgba(0,0,0,0.3);

  z-index: 9999;

  animation: chatPop 0.25s ease;

  flex-direction: column;
}

@keyframes chatPop {

  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.9);
  }

  to {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }

}

.ai-header {

  background: linear-gradient(135deg, #111, #222);

  color: white;

  padding: 18px;

  font-weight: bold;

  font-size: 18px;

  text-align: center;
}

.ai-body {

  flex: 1;

  overflow-y: auto;

  padding: 15px;

  background: #fafafa;

  text-align: left;
}

.ai-message {

  background: #f2f2f2;

  padding: 12px 15px;

  border-radius: 16px;

  margin-bottom: 12px;

  line-height: 1.6;

  font-size: 14px;
}

.user-message {

  background: #dff7ff;
}

.ai-input-area {

  display: flex;

  align-items: center;

  gap: 10px;

  padding: 12px;

  background: white;

  border-top: 1px solid #eee;
}

.ai-input-area input {

  flex: 1;

  border: none;

  background: #f2f2f2;

  border-radius: 30px;

  padding: 12px 16px;

  margin: 0;

  font-size: 15px;
}

.ai-input-area input:focus {

  outline: none;

  box-shadow: none;
}

.ai-input-area button {

  border: none;

  background: #111;

  color: white;

  border-radius: 50%;

  width: 48px;

  height: 48px;

  font-size: 18px;

  cursor: pointer;

  flex-shrink: 0;
}

`;

document.head.appendChild(style);

/* =========================
   HTML
========================= */

document.body.insertAdjacentHTML("beforeend", `

<div class="ai-chat-button" onclick="toggleChat()">
💬 AI Help
</div>

<div class="ai-chat-box" id="chatBox">

<div class="ai-header">
WTC AI Assistant
</div>

<div class="ai-body" id="chatBody">

<div class="ai-message">
Hello 👋<br>
Welcome to World Tele Communication.<br><br>

您好 👋<br>
欢迎来到 World Tele Communication。<br><br>

Halo 👋<br>
Selamat datang ke World Tele Communication.
</div>

</div>

<div class="ai-input-area">

<input
type="text"
id="userInput"
placeholder="Ask something..."
>

<button onclick="sendMessage()">
➤
</button>

</div>

</div>

`);

/* =========================
   TOGGLE CHAT
========================= */

function toggleChat() {

const box = document.getElementById("chatBox");

if(box.style.display === "flex") {

  box.style.display = "none";

} else {

  box.style.display = "flex";

}

}

/* =========================
   SEND MESSAGE
========================= */

function sendMessage() {

const input = document.getElementById("userInput");

const body = document.getElementById("chatBody");

const text = input.value.trim();

if(text === "") return;

/* USER MESSAGE */

const userMsg = document.createElement("div");

userMsg.className = "ai-message user-message";

userMsg.textContent = text;

body.appendChild(userMsg);

const lower = text.toLowerCase();

let lang = "en";

/* LANGUAGE DETECT */

if(
lower.includes("你好") ||
lower.includes("谢谢") ||
lower.includes("维修") ||
lower.includes("电话") ||
lower.includes("地址")
){
lang = "cn";
}

else if(
lower.includes("halo") ||
lower.includes("terima kasih") ||
lower.includes("alamat") ||
lower.includes("telefon")
){
lang = "bm";
}

/* DEFAULT REPLY */

let reply = "";

/* =========================
   POS
========================= */

if(
lower.includes("pos") ||
lower.includes("cashier") ||
lower.includes("system")
){

if(lang === "cn") {

reply = `
我们提供完整 POS 系统，包括：<br><br>

• POS 收银机<br>
• QR Payment<br>
• POS Software<br>
• Receipt Printer<br>
• Cashless Payment<br>
• Business Setup<br><br>

请联络我们获取报价：<br>
📞 +60163456287
`;

}

else if(lang === "bm") {

reply = `
Kami menyediakan sistem POS lengkap termasuk:<br><br>

• Mesin POS<br>
• QR Payment<br>
• POS Software<br>
• Receipt Printer<br>
• Cashless Payment<br><br>

Hubungi kami untuk quotation:<br>
📞 +60163456287
`;

}

else {

reply = `
We provide complete POS Solutions including:<br><br>

• POS Machine<br>
• QR Payment<br>
• POS Software<br>
• Receipt Printer<br>
• Cashless Payment<br>
• Business Support<br><br>

Please contact us for quotation:<br>
📞 +60163456287
`;

}

}

/* =========================
   REPAIR
========================= */

else if(
lower.includes("repair") ||
lower.includes("screen") ||
lower.includes("battery") ||
lower.includes("维修")
){

if(lang === "cn") {

reply = `
我们提供专业手机维修服务，包括：<br><br>

• 换屏幕<br>
• 换电池<br>
• 手机检测<br>
• 软件问题<br>
• 充电问题<br><br>

📞 请联络：+60163456287
`;

}

else if(lang === "bm") {

reply = `
Kami menyediakan servis repair telefon profesional termasuk:<br><br>

• Tukar Skrin<br>
• Tukar Bateri<br>
• Software Problem<br>
• Charging Problem<br><br>

📞 Hubungi kami: +60163456287
`;

}

else {

reply = `
We provide professional mobile phone repair services including:<br><br>

• Screen Replacement<br>
• Battery Replacement<br>
• Software Troubleshooting<br>
• Charging Repair<br><br>

📞 Contact us: +60163456287
`;

}

}

/* =========================
   CONTACT
========================= */

else if(
lower.includes("contact") ||
lower.includes("phone") ||
lower.includes("call") ||
lower.includes("电话")
){

reply = `
📞 Phone: +60163456287<br>
📧 Email: Wtc063369841@gmail.com<br><br>

Facebook:<br>
https://facebook.com/Worldtelecommunication.my
`;

}

/* =========================
   LOCATION
========================= */

else if(
lower.includes("location") ||
lower.includes("address") ||
lower.includes("shop") ||
lower.includes("地址")
){

reply = `
📍 World Tele Communication<br><br>

No11-1, Jalan PPM 10,<br>
Plaza Pandan Malim,<br>
75250 Melaka,<br>
Malaysia
`;

}

/* =========================
   PAYMENT
========================= */

else if(
lower.includes("payment") ||
lower.includes("qr") ||
lower.includes("cashless")
){

reply = `
We support:<br><br>

• QR Payment<br>
• DuitNow QR<br>
• Cashless Payment<br>
• POS Integrated Payment<br><br>

Suitable for restaurants, retail shops and businesses.
`;

}

/* =========================
   WARRANTY
========================= */

else if(
lower.includes("warranty") ||
lower.includes("guarantee")
){

reply = `
Warranty depends on the product or repair service.<br><br>

Please contact our support team for detailed warranty information.
`;

}

/* =========================
   OPENING HOURS
========================= */

else if(
lower.includes("open") ||
lower.includes("hour") ||
lower.includes("time")
){

reply = `
🕒 Please contact us directly for latest business operating hours.<br><br>

📞 +60163456287
`;

}

/* =========================
   FACEBOOK
========================= */

else if(
lower.includes("facebook")
){

reply = `
📘 Follow our Facebook Page:<br><br>

https://facebook.com/Worldtelecommunication.my
`;

}

/* =========================
   SHOPEE
========================= */

else if(
lower.includes("shopee")
){

reply = `
🛒 Visit our Shopee Store:<br><br>

https://my.shp.ee/6BSSa5j4
`;

}

/* =========================
   TIKTOK
========================= */

else if(
lower.includes("tiktok")
){

reply = `
🎵 Visit our TikTok Shop:<br><br>

https://vt.tiktok.com/ZS9FF6wFBgqS9-IwFY0/
`;

}

/* =========================
   THANK YOU
========================= */

else if(
lower.includes("thank") ||
lower.includes("谢谢") ||
lower.includes("terima kasih")
){

if(lang === "cn") {

reply = "不客气 😊";

}

else if(lang === "bm") {

reply = "Sama-sama 😊";

}

else {

reply = "You're welcome 😊";

}

}

/* =========================
   HELLO
========================= */

else if(
lower.includes("hello") ||
lower.includes("hi") ||
lower.includes("你好") ||
lower.includes("halo")
){

if(lang === "cn") {

reply = "你好 👋 欢迎来到 World Tele Communication。";

}

else if(lang === "bm") {

reply = "Halo 👋 Selamat datang ke World Tele Communication.";

}

else {

reply = "Hello 👋 Welcome to World Tele Communication.";

}

}

/* =========================
   DEFAULT
========================= */

else {

if(lang === "cn") {

reply = `
抱歉，目前 AI 无法回答该问题。<br><br>

请联络我们的客服获取更多帮助：<br>
📞 +60163456287
`;

}

else if(lang === "bm") {

reply = `
Maaf, AI belum dapat menjawab soalan tersebut.<br><br>

Sila hubungi support kami:<br>
📞 +60163456287
`;

}

else {

reply = `
Sorry, our AI assistant cannot answer that yet.<br><br>

Please contact our support team:<br>
📞 +60163456287
`;

}

}

/* =========================
   AI MESSAGE
========================= */

const aiMsg = document.createElement("div");

aiMsg.className = "ai-message";

aiMsg.innerHTML = reply;

body.appendChild(aiMsg);

input.value = "";

body.scrollTo({
  top: body.scrollHeight,
  behavior: "smooth"
});

}

/* =========================
   ENTER KEY
========================= */

document.addEventListener("keypress", function(event) {

if(event.key === "Enter") {

const input = document.getElementById("userInput");

if(document.activeElement === input) {

  sendMessage();

}

}

});