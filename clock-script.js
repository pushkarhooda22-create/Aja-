// Default time zones
const defaultClocks = [
    { city: 'New York', offset: '-5:00' },
    { city: 'London', offset: '+0:00' },
    { city: 'India (IST)', offset: '+5:30' },
    { city: 'Tokyo', offset: '+9:00' },
    { city: 'Sydney', offset: '+10:00' },
    { city: 'Dubai', offset: '+4:00' }
];

let clocks = [];

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    loadClocks();
    displayClocks();
    updateClocks();
    setInterval(updateClocks, 1000);
});

// Load clocks from localStorage
function loadClocks() {
    const saved = localStorage.getItem('worldClocks');
    clocks = saved ? JSON.parse(saved) : defaultClocks;
}

// Save clocks to localStorage
function saveClocks() {
    localStorage.setItem('worldClocks', JSON.stringify(clocks));
}

// Display all clocks
function displayClocks() {
    const grid = document.getElementById('clocksGrid');
    grid.innerHTML = '';

    if (clocks.length === 0) {
        grid.innerHTML = '<div class="no-clocks">No clocks added. Click "+ Add Time Zone" to add one!</div>';
        return;
    }

    clocks.forEach((clock, index) => {
        const card = createClockCard(clock, index);
        grid.appendChild(card);
    });
}

// Create a clock card element
function createClockCard(clock, index) {
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.id = `clock-${index}`;

    card.innerHTML = `
        <div class="clock-city">${clock.city}</div>
        <div class="clock-timezone">UTC ${clock.offset}</div>
        <div class="clock-display" id="time-${index}">--:--:--</div>
        <div class="clock-date" id="date-${index}"></div>
        <button class="remove-clock-btn" onclick="removeClock(${index})">Remove</button>
    `;

    return card;
}

// Update all clock displays
function updateClocks() {
    clocks.forEach((clock, index) => {
        const time = getTimeInTimezone(clock.offset);
        const timeElement = document.getElementById(`time-${index}`);
        const dateElement = document.getElementById(`date-${index}`);

        if (timeElement) {
            timeElement.textContent = formatTime(time);
        }

        if (dateElement) {
            dateElement.textContent = formatDate(time);
        }
    });
}

// Get time in a specific timezone
function getTimeInTimezone(offset) {
    // Parse the offset (e.g., "+5:30" or "-8:00")
    const sign = offset[0] === '+' ? 1 : -1;
    const parts = offset.slice(1).split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]) || 0;
    const offsetMinutes = sign * (hours * 60 + minutes);

    // Get current time and adjust
    const now = new Date();
    const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const localTime = new Date(utcTime.getTime() + offsetMinutes * 60000);

    return localTime;
}

// Format time as HH:MM:SS
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// Format date
function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Add new clock
function addNewClock(event) {
    event.preventDefault();

    const cityName = document.getElementById('cityName').value.trim();
    const timezoneOffset = document.getElementById('timezoneOffset').value.trim();

    // Validate offset format
    if (!/^[+-]\d{1,2}(:\d{2})?$/.test(timezoneOffset)) {
        alert('Invalid timezone offset. Use format like +5:30, -8, or +0');
        return;
    }

    // Format offset
    let formattedOffset = timezoneOffset;
    if (!timezoneOffset.includes(':')) {
        formattedOffset += ':00';
    }

    clocks.push({
        city: cityName,
        offset: formattedOffset
    });

    saveClocks();
    displayClocks();
    closeAddClockModal();
    document.getElementById('cityName').value = '';
    document.getElementById('timezoneOffset').value = '';
}

// Remove clock
function removeClock(index) {
    clocks.splice(index, 1);
    saveClocks();
    displayClocks();
}

// Reset to default clocks
function resetToDefault() {
    if (confirm('Are you sure you want to reset to default clocks?')) {
        clocks = JSON.parse(JSON.stringify(defaultClocks));
        saveClocks();
        displayClocks();
    }
}

// Modal functions
function openAddClockModal() {
    document.getElementById('addClockModal').style.display = 'block';
}

function closeAddClockModal() {
    document.getElementById('addClockModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('addClockModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAddClockModal();
    }
});