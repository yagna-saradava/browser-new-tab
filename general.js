// ============================
// Brand Logo Name and Greeting
// ============================
const currentTime = new Date();
const name = document.querySelector('.brand-logo #text');
const hours = currentTime.getHours();
if(hours>=0 && hours<12) name.innerText = "Good Morning, Yagna!";
else if(hours>=12 && hours<18) name.innerText= "Good Afternoon, Yagna!";
else if(hours>=18 && hours<=23) name.innerText = "Good Evening, Yagna!";

// ================================
// Clean Live Clock Update Function
// ================================
function processTimeMetrics() {
    const timeDisplay = document.getElementById('digital-clock');
    const dateDisplay = document.getElementById('date-string');
    const currentTime = new Date();
    
    // Time formatted cleanly as HH:MM
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    
    // Formatted Elegant Date String
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    dateDisplay.textContent = currentTime.toLocaleDateString('en-US', dateOptions).toUpperCase();
}

setInterval(processTimeMetrics, 1000);
processTimeMetrics();

// ====================================
// Dropdown Apps Menu Toggle Controller
// ====================================
const menuTrigger = document.getElementById('apps-menu-btn');
const appsOverlayWindow = document.getElementById('apps-dropdown');

menuTrigger.addEventListener('click', (event) => {
    event.stopPropagation();
    appsOverlayWindow.classList.toggle('hidden');
});

document.addEventListener('click', (event) => {
    if (!appsOverlayWindow.contains(event.target) && event.target !== menuTrigger) {
        appsOverlayWindow.classList.add('hidden');
    }
});