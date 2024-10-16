let mediaRecorder;
let audioChunks = [];

async function startRecording() {
    audioChunks = [];
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            await sendAudioToBackend(audioBlob);
        };

        mediaRecorder.start();
        document.getElementById("startBtn").disabled = true;
        document.getElementById("stopBtn").disabled = false;
        document.getElementById("voice-detection").style.display = "block"; // Show animation
    } catch (err) {
        console.error('Error accessing microphone:', err);
        alert('Could not access your microphone. Please ensure it is connected and you have given permission.');
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        document.getElementById("startBtn").disabled = false;
        document.getElementById("stopBtn").disabled = true;
        document.getElementById("voice-detection").style.display = "none"; // Hide animation
    }
}

async function sendAudioToBackend(audioBlob) {
    const formData = new FormData();
    formData.append('file', new Blob([audioBlob], { type: 'audio/wav' }), 'audio.wav');
    formData.append('source_language', document.getElementById('sourceLang').value);
    formData.append('target_language', document.getElementById('targetLang').value);

    try {
        const response = await fetch('/translate', {
            method: 'POST',
            body: formData
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const errorMessage = await response.text();
            throw new Error(`Server returned a non-JSON response: ${errorMessage}`);
        }

        const result = await response.json();
        if (!response.ok) {
            throw new Error(`Server error: ${result.error}`);
        }

        const audioFilePath = result.audio_file_path;
        document.getElementById('result').innerHTML = `
            <p><strong>Original:</strong> ${result.original_text}</p>
            <p><strong>Translated:</strong> ${result.translated_text}</p>
            <audio id="audioPlayer" src="/play_audio/${audioFilePath}" autoplay></audio>
        `;

        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.play();
    } catch (error) {
        console.error('Error during fetch:', error);
        document.getElementById('result').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

// Add event listeners to the buttons
document.getElementById("startBtn").addEventListener("click", startRecording);
document.getElementById("stopBtn").addEventListener("click", stopRecording);
