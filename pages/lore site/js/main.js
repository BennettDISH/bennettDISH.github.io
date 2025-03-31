let currentMap = "main-map";
let mapHistory = [];
let data = {};

// Ensure all DOM elements are declared at the top
const mapContainer = document.getElementById('map-container');
const documentDisplay = document.getElementById('document-display');
const tooltip = document.getElementById('tooltip');
const timelineContainer = document.getElementById('timeline-container');
const timelineTrack = document.getElementById('timeline-track');
const timelineThumb = document.getElementById('timeline-thumb');
const timelineMarkers = document.getElementById('timeline-markers');

let isDragging = false;
let timelineMin = 0;
let timelineMax = 100;
let timelineValue = timelineMin;

function loadData() {
    fetch('./data/maps.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            loadMap("main-map"); // Load the initial map after data is loaded
        })
        .catch(error => console.error('Error loading JSON data:', error));
}

function updateBreadcrumbs() {
    const breadcrumbs = document.getElementById('breadcrumbs');
    breadcrumbs.innerHTML = ''; // Clear existing breadcrumbs

    // Add a home link or text
    const homeLink = document.createElement('span');
    homeLink.textContent = 'Home';
    homeLink.className = 'breadcrumb';
    homeLink.addEventListener('click', () => loadMap('main-map'));
    breadcrumbs.appendChild(homeLink);

    // Iterate through map history to create the breadcrumb trail
    mapHistory.forEach((mapKey, index) => {
        const separator = document.createElement('span');
        separator.textContent = ' > ';
        breadcrumbs.appendChild(separator);

        const breadcrumbLink = document.createElement('span');
        breadcrumbLink.textContent = data[mapKey].title || mapKey; // Use a title if available
        breadcrumbLink.className = 'breadcrumb';
        breadcrumbLink.addEventListener('click', () => loadMap(mapKey));
        breadcrumbs.appendChild(breadcrumbLink);
    });

    // Add the current map as the last breadcrumb (non-clickable)
    const separator = document.createElement('span');
    separator.textContent = ' > ';
    breadcrumbs.appendChild(separator);

    const currentBreadcrumb = document.createElement('span');
    currentBreadcrumb.textContent = data[currentMap].title || currentMap;
    currentBreadcrumb.className = 'breadcrumb-current';
    breadcrumbs.appendChild(currentBreadcrumb);
}

function updateSidebar(dotDataArray) {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = ''; // Clear previous content

    // Sort dots by start time
    dotDataArray.sort((a, b) => a.time - b.time);

    dotDataArray.forEach(dotData => {
        const dotElement = document.createElement('div');
        dotElement.className = 'dot-list-item';
        dotElement.innerHTML = `<strong>${dotData.tooltip || 'Event'}</strong> (Time: ${dotData.time} - ${dotData.end})`;
        dotElement.addEventListener('click', () => {
            // Scroll to the dot on the map when clicked in the sidebar
            const dot = mapContainer.querySelector(`.dot[data-dot-id='${dotData.id}']`);
            if (dot) {
                dot.scrollIntoView({ behavior: 'smooth', block: 'center' });
                dot.click(); // Simulate a click on the dot to open its content
            }
        });
        sidebar.appendChild(dotElement);
    });
}

function loadMap(mapKey) {
    if (currentMap !== mapKey) {
        mapHistory.push(currentMap);
    }
    currentMap = mapKey;
    const mapData = data[currentMap];
    const map = document.getElementById('map');

    map.src = mapData.mapSrc;

    map.onload = function() {
        // Clear existing dots and markers before loading new ones
        mapContainer.querySelectorAll('.dot').forEach(dot => dot.remove());
        timelineMarkers.innerHTML = '';

        // Load dot data from individual files
        const eventPromises = mapData.events.map(event => 
            fetch(event.dotFile).then(response => response.json())
        );

        Promise.all(eventPromises)
            .then(dotsData => {
                dotsData.forEach(dotData => {
                    console.log('Placing dot:', dotData); // Debugging
                    placeDot(dotData);
                    addTimelineMarker(dotData);
                });
                placeDots(); // Ensure dots are placed based on current timeline value
                updateSidebar(dotsData); // Update the sidebar with dots in chronological order
            })
            .catch(error => console.error('Error loading dot data:', error));

        // Update breadcrumbs
        updateBreadcrumbs();

        // Display the map information in the document display area
        displayMapInfo(mapData.info);

        // Hide the tooltip when a new map is loaded
        tooltip.style.display = 'none';
    };
}

function displayMapInfo(info) {
    if (info) {
        documentDisplay.innerHTML = `<h2>${info.title}</h2><p>${info.description}</p>`;
    } else {
        documentDisplay.innerHTML = ''; // Clear if no info is available
    }
}

function goBack() {
    if (mapHistory.length > 0) {
        mapHistory.pop(); // Remove the current map from the history
        if (mapHistory.length > 0) {
            const previousMap = mapHistory.pop(); // Get the previous map
            loadMap(previousMap);
        } else {
            loadMap("main-map"); // Default back to the main map if history is empty
        }
    }
}

// Function to move the thumb and update value
function moveThumb(newLeft) {
    const containerRect = timelineContainer.getBoundingClientRect();
    newLeft = Math.max(0, Math.min(newLeft, containerRect.width));
    timelineThumb.style.left = `${newLeft}px`;
    timelineValue = Math.round((newLeft / containerRect.width) * (timelineMax - timelineMin)) + timelineMin;
    placeDots(); // Update dots based on the new timeline value
}

// Handle dragging the thumb
timelineThumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault(); // Prevent text selection or dragging effects
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const containerRect = timelineContainer.getBoundingClientRect();
        moveThumb(e.clientX - containerRect.left);
    }
});

// Handle clicking on the track
timelineContainer.addEventListener('click', (e) => {
    if (!isDragging) {
        const containerRect = timelineContainer.getBoundingClientRect();
        moveThumb(e.clientX - containerRect.left);
        placeDots(); // Update dots based on the new timeline value
    }
});

function updateTimelineMarkers() {
    timelineMarkers.innerHTML = ''; // Clear existing markers

    const mapData = data[currentMap];
    const containerWidth = timelineContainer.clientWidth;

    mapData.events.forEach(event => {
        const marker = document.createElement('div');
        marker.className = 'marker';

        // Calculate the midpoint of the event's time range
        const eventMidpoint = (event.time + event.end) / 2;
        const markerPosition = ((eventMidpoint - timelineMin) / (timelineMax - timelineMin)) * containerWidth;

        // Position the marker within the timeline
        marker.style.left = `${markerPosition}px`;

        timelineMarkers.appendChild(marker);
    });
}

function displayMapDocument(dotData) {
    const mapInfo = data[dotData.mapLink].info;
    const documentContent = `
        <h2>${mapInfo.title}</h2>
        <p>${mapInfo.description}</p>
        <button onclick="loadMap('${dotData.mapLink}')">View Location</button>
    `;
    documentDisplay.innerHTML = documentContent;
}

function placeDot(dotData) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.setAttribute('data-dot-id', dotData.id);
    dot.setAttribute('data-dot', JSON.stringify(dotData));

    if (dotData.image) {
        dot.style.backgroundImage = `url(${dotData.image})`;
        dot.style.backgroundSize = 'cover';
        dot.style.backgroundPosition = 'center';
        dot.style.backgroundRepeat = 'no-repeat';
    } else {
        if (dotData.mapLink) {
            dot.classList.add('dot-map-link');
        } else {
            dot.classList.add('dot-content');
        }
    }

    dot.style.left = `${dotData.x}%`; // Use percentage for left position
    dot.style.top = `${dotData.y}%`;  // Use percentage for top position

    dot.addEventListener('click', () => {
        if (dotData.mapLink) {
            displayMapDocument(dotData);
        } else {
            documentDisplay.innerHTML = dotData.content;
        }
    });

    dot.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
        tooltip.textContent = dotData.tooltip;
        tooltip.style.left = `${dotData.x}%`;
        tooltip.style.top = `calc(${dotData.y}% + 25px)`;
    });

    dot.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });

    mapContainer.appendChild(dot);

    updateDotVisibility(dot, dotData);
}

function placeDots() {
    mapContainer.querySelectorAll('.dot').forEach(dot => dot.remove());

    const mapData = data[currentMap];
    const eventPromises = mapData.events.map(event =>
        fetch(event.dotFile).then(response => response.json())
    );

    Promise.all(eventPromises)
        .then(dotsData => {
            dotsData.forEach(dotData => {
                placeDot(dotData);
            });
        })
        .catch(error => console.error('Error loading dot data:', error));
}

// Ensure dots are repositioned when the window is resized
window.addEventListener('resize', placeDots);

// Call placeDots initially after the map is loaded
map.onload = placeDots;

function updateDotVisibility(dot, dotData) {
    if (timelineValue >= dotData.time && timelineValue <= dotData.end) {
        dot.style.display = 'block';
    } else {
        dot.style.display = 'none';
    }
}

function addTimelineMarker(dotData) {
    const marker = document.createElement('div');
    marker.className = 'marker';

    const eventMidpoint = (dotData.time + dotData.end) / 2;
    const markerPosition = ((eventMidpoint - timelineMin) / (timelineMax - timelineMin)) * timelineContainer.clientWidth;

    marker.style.left = `${markerPosition}px`;

    timelineMarkers.appendChild(marker);
}

// Call loadData on page load
loadData();
