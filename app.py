from flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS
from googletrans import Translator
from gtts import gTTS
import speech_recognition as sr
import os
import subprocess
import time
import glob

app = Flask(__name__)
CORS(app)

translator = Translator()
recognizer = sr.Recognizer()

# Path to ffmpeg
FFMPEG_PATH = 'C:\\ffmpeg\\bin\\ffmpeg.exe'

# Extended list of languages
LANGUAGES = {
    "English": "en",
    "French": "fr",
    "Spanish": "es",
    "German": "de",
    "Chinese (Simplified)": "zh-cn",
    "Chinese (Traditional)": "zh-tw",
    "Japanese": "ja",
    "Korean": "ko",
    "Russian": "ru",
    "Italian": "it",
    "Portuguese": "pt",
    "Arabic": "ar",
    "Hindi": "hi",
    "Turkish": "tr",
    "Dutch": "nl",
    "Swedish": "sv",
    "Danish": "da",
    "Norwegian": "no",
    "Finnish": "fi",
    "Polish": "pl",
    "Greek": "el",
    "Czech": "cs",
    "Hebrew": "he",
    "Vietnamese": "vi",
    "Indonesian": "id"
}

@app.route('/')
def home():
    return render_template('index.html', languages=LANGUAGES.keys())

@app.route('/translate', methods=['POST'])
def translate():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400

        file = request.files['file']
        source_lang_name = request.form.get('source_language', 'English')
        target_lang_name = request.form.get('target_language', 'French')

        source_lang = LANGUAGES.get(source_lang_name, 'en')
        target_lang = LANGUAGES.get(target_lang_name, 'fr')

        input_audio_path = 'uploaded_audio.webm'
        converted_audio_path = 'converted_audio.wav'
        file.save(input_audio_path)
        print(f"Saved uploaded audio file to {input_audio_path}")

        # Convert to PCM WAV format using ffmpeg
        try:
            subprocess.run([
                FFMPEG_PATH, '-y', '-i', input_audio_path, '-acodec', 'pcm_s16le',
                '-ar', '16000', '-ac', '1', converted_audio_path
            ], check=True)
            print(f"Converted audio file to {converted_audio_path}")
        except subprocess.CalledProcessError as e:
            return jsonify({"error": f"Audio conversion error: {e}"}), 500

        # Transcribe the audio
        try:
            with sr.AudioFile(converted_audio_path) as source:
                audio_data = recognizer.record(source)
                text = recognizer.recognize_google(audio_data, language=source_lang)
            print(f"Transcribed audio to text: {text}")
        except sr.RequestError as e:
            return jsonify({"error": f"Speech recognition error: {e}"}), 500
        except sr.UnknownValueError:
            return jsonify({"error": "Speech not understood"}), 500

        # Cleanup old files
        for old_file in glob.glob('translated_*.mp3'):
            os.remove(old_file)

        # Generate a unique filename for the translation
        timestamp = int(time.time())
        translated_audio_file_path = f'translated_{timestamp}.mp3'

        # Translate text and generate speech
        try:
            translation = translator.translate(text, src=source_lang, dest=target_lang).text
            print(f"Translated text to: {translation}")
            tts = gTTS(text=translation, lang=target_lang)
            tts.save(translated_audio_file_path)
            print(f"Saved translated audio to {translated_audio_file_path}")
        except Exception as e:
            return jsonify({"error": f"Translation or TTS error: {e}"}), 500

        # Cleanup
        os.remove(input_audio_path)
        os.remove(converted_audio_path)

        return jsonify({
            "original_text": text,
            "translated_text": translation,
            "audio_file_path": translated_audio_file_path
        })

    except Exception as e:
        print(f"Unexpected server error: {e}")
        return jsonify({"error": f"Unexpected server error: {e}"}), 500

@app.route('/play_audio/<filename>', methods=['GET'])
def play_audio(filename):
    try:
        directory = '.'  # Current directory
        file_path = os.path.join(directory, filename)
        if os.path.exists(file_path):
            return send_file(file_path, mimetype='audio/mpeg')
        else:
            print(f"Audio file not found: {filename}")
            return jsonify({"error": "Audio file not found"}), 404
    except Exception as e:
        print(f"Error serving audio file: {e}")
        return jsonify({"error": f"Error serving audio file: {e}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5500)
