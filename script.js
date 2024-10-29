// Dropdown Selection Logic
document.querySelectorAll(".select-menu").forEach(selectMenu => {
    const selectBtn = selectMenu.querySelector(".select-btn");
    const options = selectMenu.querySelector(".options");
  
    selectBtn.addEventListener("click", () => {
      selectMenu.classList.toggle("open");
    });
  
    selectMenu.querySelectorAll(".option").forEach(option => {
      option.addEventListener("click", () => {
        // Remove 'selected' class from all options
        selectMenu.querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
  
        // Add 'selected' class to the clicked option
        option.classList.add("selected");
  
        // Update the button text
        const selectedText = option.querySelector(".option-text").innerText;
        selectBtn.querySelector(".sBtn-text").innerText = selectedText;
  
        selectMenu.classList.remove("open");
      });
    });
  });
  
  // Function to reverse languages
  function reverseLanguages() {
    const sourceLangSelectBtn = document.querySelector("#sourceLangOptions").previousElementSibling;
    const targetLangSelectBtn = document.querySelector("#targetLangOptions").previousElementSibling;

    const sourceLang = document.querySelector("#sourceLangOptions .option.selected");
    const targetLang = document.querySelector("#targetLangOptions .option.selected");

    if (sourceLang && targetLang) {
        // Swap the button text
        const tempText = sourceLangSelectBtn.querySelector(".sBtn-text").innerText;
        sourceLangSelectBtn.querySelector(".sBtn-text").innerText = targetLangSelectBtn.querySelector(".sBtn-text").innerText;
        targetLangSelectBtn.querySelector(".sBtn-text").innerText = tempText;

        // Swap the selected values and classes
        const tempValue = sourceLang.dataset.value;
        sourceLang.classList.remove("selected");
        targetLang.classList.remove("selected");

        // After removing the selected classes, find the new options and reapply the selected classes
        const newSourceLang = document.querySelector(`#sourceLangOptions .option[data-value="${targetLang.dataset.value}"]`);
        const newTargetLang = document.querySelector(`#targetLangOptions .option[data-value="${sourceLang.dataset.value}"]`);

        newSourceLang.classList.add("selected");
        newTargetLang.classList.add("selected");
    }
}

  
  document.getElementById("reverseBtn").addEventListener("click", reverseLanguages);
  
  // Audio Recording Logic
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
      document.getElementById("voice-detection").style.display = "block"; // Show voice detection animation
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
      document.getElementById("voice-detection").style.display = "none"; // Hide voice detection animation
    }
  }
  
  async function sendAudioToBackend(audioBlob) {
    const formData = new FormData();
    formData.append('file', new Blob([audioBlob], { type: 'audio/wav' }), 'audio.wav');
    formData.append('source_language', document.querySelector("#sourceLangOptions .option.selected").dataset.value);
    formData.append('target_language', document.querySelector("#targetLangOptions .option.selected").dataset.value);
  
    // Show the loading animation while waiting for the translation
    const loadingAnimation = document.getElementById('loading-animation');
    loadingAnimation.style.display = 'block'; // Show loading animation
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
      
      // Only play the audio, without showing the original and translated text
      const audioPlayer = document.createElement('audio');
      audioPlayer.src = `/play_audio/${audioFilePath}`;
      audioPlayer.autoplay = true;
      document.body.appendChild(audioPlayer);
    } catch (error) {
      console.error('Error during fetch:', error);
      alert(`Error: ${error.message}`);
    } finally {
      // Hide the loading animation after the translation is complete
      loadingAnimation.style.display = 'none';
    }
  }
  
  document.getElementById("startBtn").addEventListener("click", startRecording);
  document.getElementById("stopBtn").addEventListener("click", stopRecording);
  