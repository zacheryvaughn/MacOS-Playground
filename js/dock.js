// Global variable for maxSize, uniquely named for this feature
let magCurrentMaxSize = 90; // Starting value for magnification slider

document.addEventListener('DOMContentLoaded', () => {
    const magDock = document.getElementById('dock'); // Assuming the dock ID does not conflict

    magDock.addEventListener('mousemove', (e) => {
        const magDockItems = magDock.querySelectorAll('.dock-item');
        magDockItems.forEach((item) => {
            const itemRect = item.getBoundingClientRect();
            const withinBounds = e.clientX >= itemRect.left && e.clientX <= itemRect.right;
            const magMaxDistance = 200;
            const magMinSize = 63;
            // Use magCurrentMaxSize which is updated by the slider
            let newSize;
            if (withinBounds) {
                newSize = magCurrentMaxSize;
            } else {
                const distanceToLeftEdge = Math.abs(e.clientX - itemRect.left);
                const distanceToRightEdge = Math.abs(e.clientX - itemRect.right);
                const closestEdgeDistance = Math.min(distanceToLeftEdge, distanceToRightEdge);
                newSize = magMinSize + (magCurrentMaxSize - magMinSize) * Math.max(0, (magMaxDistance - closestEdgeDistance) / magMaxDistance);
            }

            item.style.width = `${newSize}px`;
            item.style.height = `${newSize}px`;
        });
    });

    magDock.addEventListener('mouseleave', () => {
        const magDockItems = magDock.querySelectorAll('.dock-item');
        magDockItems.forEach((item) => {
            item.style.width = '63px'; // Reset to original size
            item.style.height = '63px'; // Reset to original size
        });
    });
});

// MAGNIFICATION ADJUSTMENT SLIDER
const magTrack = document.getElementById('magnification-track');
const magProgress = document.getElementById('magnification-progress');
const magThumb = document.getElementById('magnification-thumb');

let magIsDragging = false;

// Update slider position and dynamically adjust magCurrentMaxSize for dock magnification
const magUpdateSlider = (e) => {
  const rect = magTrack.getBoundingClientRect();
  const x = e.pageX - rect.left;
  const width = rect.width;
  const percentage = Math.max(0, Math.min(1, x / width));

  const progressWidth = percentage * width;
  const thumbOffset = magThumb.offsetWidth / 2;

  magProgress.style.width = `${Math.min(progressWidth, width - thumbOffset)}px`;
  magThumb.style.left = `${Math.min(Math.max(0, x - thumbOffset), width - magThumb.offsetWidth)}px`;

  // Dynamically update magCurrentMaxSize based on the slider percentage
  magCurrentMaxSize = 63 + (120 - 63) * percentage; // Linearly interpolate between 63 and 120
};

magThumb.addEventListener('mousedown', (e) => {
  e.preventDefault();
  magIsDragging = true;
  magUpdateSlider(e);
});

document.addEventListener('mousemove', (e) => {
  if (magIsDragging) {
    magUpdateSlider(e);
  }
});

document.addEventListener('mouseup', () => {
  if (magIsDragging) {
    magIsDragging = false;
  }
});

// Function to set the slider to reflect the initial magCurrentMaxSize of 90
const magSetSliderToReflectInitialSize = () => {
    const initialPercentage = (magCurrentMaxSize - 63) / (120 - 63);
    const trackWidth = magTrack.offsetWidth;
    const thumbWidth = magThumb.offsetWidth;
    const thumbOffset = thumbWidth / 2; // Half the thumb's width in pixels

    magProgress.style.width = `${initialPercentage * 100}%`;
    // Position the thumb center at the correct percentage of the track width
    magThumb.style.left = `calc(${initialPercentage * trackWidth}px - ${thumbOffset}px)`;
};

magSetSliderToReflectInitialSize();
