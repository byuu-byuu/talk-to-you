/* const socket = io(); */
let localStream;
let peerConnection;

const config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // STUN Server
};

// 1. Camera & Microphone ယူခြင်း
async function startVideo() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById('localVideo').srcObject = localStream;
}
startVideo();

// 2. Server မှ Match ဖြစ်ကြောင်း အကြောင်းကြားပါက WebRTC Connection စတင်ခြင်း
socket.on('matched', async ({ partnerId, createOffer }) => {
    peerConnection = new RTCPeerConnection(config);

    // Local stream ကို Peer တွင် ထည့်ခြင်း
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // တစ်ဖက်မှ Video ရရှိပါက Remote Video Tag တွင် ပြသခြင်း
    peerConnection.ontrack = (event) => {
        document.getElementById('remoteVideo').srcObject = event.streams[0];
    };

    // ICE Candidate ပို့ပေးခြင်း
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('signal', { to: partnerId, signal: { candidate: event.candidate } });
        }
    };

    // Offer ဖန်တီးသူဖြစ်ပါက (First Peer)
    if (createOffer) {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('signal', { to: partnerId, signal: { sdp: offer } });
    }
});

// 3. Signaling Message များ ပေးပို့ လက်ခံခြင်း
socket.on('signal', async ({ from, signal }) => {
    if (!peerConnection) return;

    if (signal.sdp) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        if (signal.sdp.type === 'offer') {
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.emit('signal', { to: from, signal: { sdp: answer } });
        }
    } else if (signal.candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(signal.candidate));
    }
});