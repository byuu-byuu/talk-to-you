const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static('public')); // .html, .css, .js ဖိုင်များ ထားရန်နေရာ

let waitingUser = null; // Pair တွဲဖို့ စောင့်နေသူကို သိမ်းထားရန် Variable

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User ရောက်လာပါက Queue ထဲထည့်ပြီး Matching ရှာခြင်း
    if (waitingUser) {
        // စောင့်နေသူရှိပါက ထိုသူနှင့် လက်ရှိ User ကို Pair လုပ်ပေးမည်
        const partnerSocket = waitingUser;
        waitingUser = null;

        // ၂ ယောက်လုံးထံ Match ဖြစ်သွားကြောင်း အကြောင်းကြားခြင်း
        socket.emit('matched', { partnerId: partnerSocket.id, createOffer: true });
        partnerSocket.emit('matched', { partnerId: socket.id, createOffer: false });
    } else {
        // စောင့်နေသူမရှိပါက ရောက်လာသူကို Waiting status တွင်ထားမည်
        waitingUser = socket;
    }

    // WebRTC Signaling Data များ (Offer, Answer, ICE Candidate) ကို လက်ခံပေးပို့ခြင်း
    socket.on('signal', (data) => {
        io.to(data.to).emit('signal', {
            from: socket.id,
            signal: data.signal
        });
    });

    // User ထွက်သွားပါက စာရင်းရှင်းခြင်း
    socket.on('disconnect', () => {
        if (waitingUser === socket) {
            waitingUser = null;
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const path = require('path');

// Static files များကို သုံးခွင့်ပေးရန်
app.use(express.static(__dirname));

// Home page (/) သို့ဝင်ပါက index.html ကို ပြပေးရန်
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});