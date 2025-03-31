let resources = 100;
const resourceRate = 5; // Amount of resources generated per second.

function incrementResource() {
    resources += resourceRate;
    document.getElementById('resources').innerText = resources;
    setTimeout(incrementResource, 1000); // Update resource count every second.
}

function incrementCounter(id, interval) {
    setInterval(() => {
        let element = document.getElementById(id);
        let currentValue = parseInt(element.innerText, 10);
        element.innerText = currentValue + 1;
    }, interval);
}

function claimRegion(regionId, cost) {
    if (resources >= cost) {
        let region = document.getElementById(regionId);
        if (!region.classList.contains('owned')) {
            region.classList.add('owned');
            resources -= cost;
            document.getElementById('resources').innerText = resources;
            switch (regionId) {
                case 'region1':
                    incrementCounter("units1", 1000);
                    incrementCounter("vehicles1", 10000);
                    break;
                case 'region2':
                    incrementCounter("units2", 4000);
                    incrementCounter("vehicles2", 35000);
                    break;
                case 'region3':
                    incrementCounter("units3", 1500);
                    incrementCounter("vehicles3", 20000);
                    break;
                case 'region4':
                    incrementCounter("units4", 3000);
                    incrementCounter("vehicles4", 40000);
                    break;
                case 'region5':
                    incrementCounter("units5", 2500);
                    incrementCounter("vehicles5", 15000);
                    break;
            }
        }
    } else {
        alert('Not enough resources to claim this region.');
    }
}

incrementResource(); // Start the resource production process.
