fetch('trip-itinerary.json')
    .then(response => response.json())
    .then(data => {
        const itinerary = document.getElementById('itinerary');
        data.events.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            const dateDiv = document.createElement('div');
            dateDiv.className = 'time';
            dateDiv.textContent = event.date;
            eventDiv.appendChild(dateDiv);

            const detailsContainer = document.createElement('div');
            detailsContainer.className = 'details-container'; // Added for collapsibility

            event.details.forEach(detail => {
                const detailDiv = document.createElement('div');
                detailDiv.className = 'activity';
                detailDiv.innerHTML = `<span class="time">${detail.time}</span> ${detail.activity}`;
                detailsContainer.appendChild(detailDiv);
            });

            // Add notes if available
            if (event.notes) {
                const notesDiv = document.createElement('div');
                notesDiv.className = 'notes';
                notesDiv.textContent = `Notes: ${event.notes}`;
                detailsContainer.appendChild(notesDiv);
            }

            eventDiv.appendChild(detailsContainer);
            itinerary.appendChild(eventDiv);
        });

        // Add event listeners to toggle the collapse/expand behavior
        const timeElements = document.querySelectorAll('.time');
        timeElements.forEach(timeElement => {
            timeElement.addEventListener('click', () => {
                const detailsContainer = timeElement.nextElementSibling;
                detailsContainer.classList.toggle('expanded');
            });
        });
    })
    .catch(error => console.error(error));
