// ============================================================================
// Premium Nature Visuals Database (25 Ultra-Minimalist & Cinematic Landscapes)
// ============================================================================
const backgroundPhotos = [
    // --- Mountains & Peaks ---
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920", // Majestic triple mountain peaks
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1920", // Snowy high-altitude mountain range
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1920", // Moody green valley beneath jagged peaks
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920", // Yosemite Valley mist and granite cliffs
    
    // --- Forests & Woodlands ---
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920", // Sunbeams breaking through a lush green forest
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1920", // Minimalist wooden footbridge deep in the woods
    "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1920", // Misty pine trees disappearing into dense fog
    "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1920", // Autumn forest transition with warm golden tones
    
    // --- Oceans, Coasts & Lakes ---
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920", // Pristine sunset over a tropical sandy beach
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1920", // Fog rolling over a mirror-like alpine lake at dawn
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1920", // Deep moody ocean waves crashing in slow motion
    
    // --- Deserts & Canyons ---
    "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?q=80&w=1920", // Abstract close-up of smooth, winding canyon walls
    
    // --- Cinematic Skies & Horizons ---
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1920", // Endless rolling green hills meeting the clouds
    "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1920", // Dramatic storm clouds illuminated by a setting sun
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1920", // Vast aerial landscape of green fields and rivers
    "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=1920", // Vibrant sun bursting directly over the ocean horizon
];

// =================================================
// Change Wallpaper Logic (Manual + Auto Slide Show)
// =================================================
let currentBgIndex = 0;
let slideshowTimer; // Variable to hold the active interval state

const bgBase = document.getElementById('bg-base');
const bgOverlay = document.getElementById('bg-overlay');
const nextBgBtn = document.getElementById('next-bg-btn');
const prevBgBtn = document.getElementById('prev-bg-btn');

function transitionWallpaper(targetIndex) {
    const nextImageUrl = backgroundPhotos[targetIndex];

    bgOverlay.style.backgroundImage = `url('${nextImageUrl}')`;
    bgOverlay.style.opacity = '1';

    setTimeout(() => {
        bgBase.style.backgroundImage = `url('${nextImageUrl}')`; // Commit image to bottom base layer
        bgOverlay.style.opacity = '0'; // Silently hide top overlay layer back to transparent
        currentBgIndex = targetIndex;  // Formally advance global tracking index
    }, 800); 
}
function changeNextWallpaper() {
    const nextIdx = (currentBgIndex + 1) % backgroundPhotos.length;
    transitionWallpaper(nextIdx);
}
function changePrevWallpaper() {
    const prevIdx = (currentBgIndex - 1 + backgroundPhotos.length) % backgroundPhotos.length;
    transitionWallpaper(prevIdx);
}

// Master controller to manage the active slideshow timing loops
function startSlideshowCycle() {
    // Clear any active timer before initiating a new one to prevent timing overlapping bugs
    if (slideshowTimer) clearInterval(slideshowTimer);
    
    // Set fixed interval loop (10000ms = 10secs)
    slideshowTimer = setInterval(changeNextWallpaper, 10000);
}

// Manual user trigger handling implementation
nextBgBtn.addEventListener('click', () => {
    changeNextWallpaper();       // Advance image instantly on event action
    startSlideshowCycle();   // Reset the timer loop back to zero
});
prevBgBtn.addEventListener('click', () => {
    changePrevWallpaper();
    startSlideshowCycle();
});

bgBase.style.backgroundImage = `url('${backgroundPhotos[currentBgIndex]}')`;
startSlideshowCycle();