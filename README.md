# Sawti 🎙️

Sawti is a voice translation web application that allows users to record their speech in one language and receive real-time translations in another language. The app includes automatic playback of the translated audio, making it ideal for conversations with people who speak different languages.

## Features

- **Live Audio Translation**: Record your voice and receive a translated audio file in the selected target language.
- **Real-Time Transcription**: Displays both the original transcription and its translation.
- **Voice Detection Animation**: A pulsing animation shows when the app is recording.
- **Multi-Language Support**: Translate between multiple languages including English, French, Spanish, German, Chinese, and many more.
- **Intuitive Interface**: User-friendly design with a sidebar navigation for easy access.

## Installation

To get started with Sawti on your local machine, follow these steps:

### Prerequisites

- **Python 3.7+**
- **Node.js** (optional, for front-end package management)
- **FFmpeg**: Required for audio processing.






# Sawti Discord Bot

Sawti is a multilingual translation and language assistance bot built to facilitate seamless communication and learning experiences on Discord. With Sawti, you can translate text, transcribe voice messages, and even fetch jokes in different languages!

## Features

- **Text Translation**: Translate text between multiple languages.
- **Conversation Mode**: Enable real-time message translations in a designated channel.
- **File Translation**: Translate the content of `.txt` and `.docx` files.
- **Voice Message Translation**: Transcribe and translate audio files into text or generate translated audio.
- **Jokes in Different Languages**: Fetch random jokes and translate them into the desired language for a bit of fun!

## Commands

| Command               | Description                                                                                                    |
|-----------------------|----------------------------------------------------------------------------------------------------------------|
| `/translate`          | Translates text from one language to another.                                                                 |
| `/start_conversation` | Starts conversation mode to auto-translate messages in a channel between two languages.                        |
| `/stop_conversation`  | Stops the active conversation mode in a channel.                                                              |
| `/translate_file`     | Translates the content of an uploaded `.txt` or `.docx` file.                                                  |
| `/translate_voice`    | Translates the text from an uploaded audio file (.wav, .mp3, .ogg) and generates audio output if needed.       |
| `/joke`               | Fetches a random joke and translates it into the selected language for some fun.                              |
| `/github`             | Provides a link to the GitHub repository for this bot.                                                        |

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/lurantys/Sawti.git
   cd Sawti
  Install Dependencies: Install the necessary Python packages:

     ```bash
      pip install discord.py googletrans==4.0.0-rc1 SpeechRecognition gTTS pydub python-docx requests


2. **Set Up FFmpeg: For audio processing (for voice message translation), install FFmpeg:**

    Windows: Download from FFmpeg.org and add it to your system's PATH.
    Linux/MacOS: Install via the package manager:

     ```bash

    sudo apt install ffmpeg

Configure the Bot:

    Replace the bot token in the code with your Discord bot’s token.
    Optional: Update any specific settings in the code if you want to customize language options or other features.

Run the Bot: Start the bot:

bash

    python your_bot_file.py

Usage

Once the bot is running, you can invite it to your Discord server and use the commands listed above. Type / in any text channel to see the list of available commands.
