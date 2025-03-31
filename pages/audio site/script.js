// Check if the browser supports the Speech Synthesis API
if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    const paragraphs = document.querySelectorAll('.paragraph');
    const readButton = document.getElementById('readButton');
    const highlight = document.getElementById('highlight');
    const progressBar = document.getElementById('progress-bar');
    let currentParagraphIndex = 0;
  
    // Function to scroll to the next paragraph and read it
    function readNextParagraph() {
      if (currentParagraphIndex < paragraphs.length) {
        const paragraph = paragraphs[currentParagraphIndex];
        paragraph.scrollIntoView({ behavior: 'smooth' });
        const textToRead = new SpeechSynthesisUtterance(paragraph.textContent);
  
        // Apply background color to the currently read paragraph
        paragraph.style.backgroundColor = 'lightblue';
  
        // Highlight the currently read paragraph
        highlight.style.top = paragraph.offsetTop + 'px';
        highlight.style.height = paragraph.clientHeight + 'px';
  
        synth.speak(textToRead);
  
        // Update the progress bar width based on the progress of speech synthesis
        textToRead.onboundary = function(event) {
          if (event.name === 'word') {
            const totalDuration = textToRead.duration * 1000; // Convert to milliseconds
            const currentTime = event.elapsedTime * 1000; // Convert to milliseconds
            progressBar.style.width = (currentTime / totalDuration) * 100 + '%';
          }
        };
  
        // Restore the background color and reset the progress bar after reading
        textToRead.onend = function() {
          paragraph.style.backgroundColor = '#f9f9f9';
          highlight.style.height = '0';
          progressBar.style.width = '0';
          currentParagraphIndex++;
  
          // Read the next paragraph if available
          if (currentParagraphIndex < paragraphs.length) {
            readNextParagraph();
          }
        };
      }
    }
  
    readButton.addEventListener('click', readNextParagraph);
  } else {
    alert('Speech synthesis is not supported in this browser.');
  }
  