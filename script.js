const activities = [
  {
    "type": "content-heading",
    "heading": "Why Reggienold Cooliani the Turtle is So Hip",
    "content": [
      "Reggienold Cooliani is not your average turtle.",
      "He has a unique style that sets him apart from the rest.",
      "Reggienold's shell is adorned with colorful patterns and designs that catch the eye.",
      "He also has a passion for music and can often be found grooving to the beat of his own drum.",
      "In short, Reggienold is a hip turtle that marches to the beat of his own drum."
    ]
  },
  {
    "type": "text-grid",
    "heading": "Reggienold's Accomplishments",
    "content": [
      "Reggienold has won numerous awards for his unique style and contributions to the music industry.",
      "He has collaborated with several famous musicians, including Snoop Dogg and Lady Gaga.",
      "Reggienold has also been featured in several music videos and has made appearances on popular TV shows.",
      "In addition to his musical talents, Reggienold is also an accomplished painter and sculptor.",
      "He has exhibited his artwork in galleries around the world."
    ]
  },
  {
    "type": "text-block",
    "heading": "Reggienold's Inspiration",
    "content": [
      "Reggienold was inspired to pursue his passion for music and art by his travels around the world.",
      "He has visited many different countries and has been inspired by the local music and art scenes.",
      "Reggienold believes that art and music have the power to bring people together and break down barriers.",
      "He hopes to use his talents to promote peace and unity around the world."
    ]
  },
  {
    "type": "content-heading",
    "heading": "Reggienold's Message to the World",
    "content": [
      "Reggienold believes that everyone has something unique to offer the world.",
      "He encourages everyone to embrace their individuality and to pursue their passions.",
      "Reggienold believes that by doing what you love, you can make a positive impact on the world.",
      "He hopes that his music and art will inspire others to follow their dreams and make a difference in their own way."
    ]
  },
  {
    "type": "text-grid",
    "heading": "Reggienold's Fan Base",
    "content": [
      "Reggienold has a large and dedicated fan base that spans the globe.",
      "His fans admire his unique style, his passion for music and art, and his positive message.",
      "Many of Reggienold's fans are young people who look up to him as a role model.",
      "Reggienold takes his responsibility as a role model very seriously and strives to be a positive influence on his fans."
    ]
  }
];


const container = document.querySelector('.container');

activities.forEach(activity => {
  switch(activity.type) {
    case "text-block":
      const textBlock = document.createElement('div');
      textBlock.classList.add('text-block');
      if (activity.heading) {
        const h2 = document.createElement('h2');
        h2.textContent = activity.heading;
        container.appendChild(h2);
      }
      activity.content.forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        textBlock.appendChild(p);
      });
      container.appendChild(textBlock);
      break;
    case "text-grid":
      const textGrid = document.createElement('div');
      textGrid.classList.add('text-grid');
      if (activity.heading) {
        const h2 = document.createElement('h2');
        h2.textContent = activity.heading;
        container.appendChild(h2);
      }
      activity.content.forEach(text => {
        const div = document.createElement('div');
        div.classList.add('text-grid-item');
        div.textContent = text;
        textGrid.appendChild(div);
      });
      container.appendChild(textGrid);
      break;
    case "content-heading":
      const contentHeading = document.createElement('div');
      contentHeading.classList.add('content-heading');
      contentHeading.textContent = activity.content[0];
      container.appendChild(contentHeading);
      break;
    default:
      console.log(`Unknown activity type: ${activity.type}`);
  }
});
