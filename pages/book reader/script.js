document.addEventListener('DOMContentLoaded', function () {
  const textInput = document.getElementById('text-input');
  const readButton = document.getElementById('read-button');

  // Check if the Speech Synthesis API is available
  if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;

      readButton.addEventListener('click', function () {
          const text = textInput.value;

          if (text !== '') {
              // Create a new speech synthesis utterance
              const utterance = new SpeechSynthesisUtterance(text);

              // Speak the text
              synth.speak(utterance);
          }
      });
  } else {
      alert('Text-to-Speech API is not supported in your browser.');
  }
});
