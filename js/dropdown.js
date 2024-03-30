// OPEN CONTROL CENTER DROP DOWN
const controlCenterButton = document.getElementById('control-center-button');
const controlCenterDropdown = document.getElementById('control-center-dropdown');

controlCenterButton.addEventListener('click', (e) => {
  e.preventDefault(); // Prevent default anchor behavior
  controlCenterDropdown.classList.toggle('active'); // Toggle 'active' class on dropdown
  controlCenterButton.classList.toggle('active'); // Also toggle 'active' class on button for visual indication
});

// Listen for clicks on the entire document
document.addEventListener('mousedown', (e) => {
  // Check if the click is outside of controlCenterDropdown and controlCenterButton
  if (!controlCenterDropdown.contains(e.target) && !controlCenterButton.contains(e.target)) {
    // Check if controlCenterDropdown is currently active
    if (controlCenterDropdown.classList.contains('active')) {
      // If so, remove the 'active' class to close it
      controlCenterDropdown.classList.remove('active');
      controlCenterButton.classList.remove('active'); // Also update the button's 'active' class
    }
  }
});


// THEME SELECTION ///////////////
var lightTheme = document.getElementById('light-theme');
var darkTheme = document.getElementById('dark-theme');

// Listen for click event on light theme option
lightTheme.addEventListener('click', function() {
    // Add the 'light-theme-applied' class to the body
    document.body.classList.add('light-theme-applied');
});

// Listen for click event on dark theme option
darkTheme.addEventListener('click', function() {
    // Remove the 'light-theme-applied' class from the body
    document.body.classList.remove('light-theme-applied');
});

// BRIGHTNESS SLIDER /////////////
const track = document.getElementById('brightness-track');
const progress = document.getElementById('brightness-progress');
const thumb = document.getElementById('brightness-thumb');
const overlay = document.querySelector('#overlay'); // Get the overlay element

let isDragging = false;

// Update slider position, progress, and overlay opacity
const updateSlider = (e) => {
  const rect = track.getBoundingClientRect();
  const x = e.pageX - rect.left; // get mouse position within the track
  const width = rect.width;
  const percentage = Math.max(0, Math.min(1, x / width));
  const progressWidth = percentage * width;
  const thumbOffset = thumb.offsetWidth / 2; // Center the thumb on edges
  const flippedValue = 1 - percentage;

  // Adjusting progress and thumb position to not overflow
  progress.style.width = `${Math.min(progressWidth, width - thumbOffset)}px`;
  thumb.style.left = `${Math.min(Math.max(0, x - thumbOffset), width - thumb.offsetWidth)}px`;

  // Update the overlay opacity based on the slider percentage
  overlay.style.opacity = flippedValue.toString();
};

thumb.addEventListener('mousedown', (e) => {
  e.preventDefault(); // Prevents unwanted text selection during drag
  isDragging = true;
  updateSlider(e);
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    updateSlider(e);
  }
});

document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
  }
});

// Function to set the slider to its maximum position initially and adjust overlay opacity
const setSliderToMaxPosition = () => {
    const width = track.offsetWidth;
  
    // Set progress to full width and thumb to the far right, adjusted for its own width
    progress.style.width = `${width}px`; // Full width for max position
    thumb.style.left = `${width - thumb.offsetWidth}px`; // Align thumb to the right

    // Set overlay to fully opaque
    overlay.style.opacity = '0';
};
  
// Initialize the slider to the maximum position when the page loads
setSliderToMaxPosition();

// DOCK MAGNIFICATION SLIDER IS IN DOCK.JS FILE