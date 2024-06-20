let synthesizer;
let SpeechSDK =null;
function initializeSpeechSDK() {
    if (typeof SpeechSDK === 'undefined') {
        console.error('SpeechSDK is not defined');
        return;
    }

    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(process.env.TTS_API_KET, process.env.TTS_LOCATION);
    speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);
    console.log("Speech SDK Initialized");
}

// Function to handle speech synthesis
export function speakText(text) {
    if (!synthesizer) {
        console.error('Speech SDK not initialized');
        return;
    }

    synthesizer.speakTextAsync(
        text,
        result => {
            if (SpeechSDK && result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                console.log("Synthesis finished.");
            } else {
                console.error("Speech synthesis canceled: " + result.errorDetails);
            }
        },
        error => {
            console.error(error);
        }
    );
}
