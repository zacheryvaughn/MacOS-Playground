const dock = document.getElementById('dock');
const dockItems = dock.querySelectorAll('.dock-item');

const style = getComputedStyle(dockItems[0]);
const [magnifyMinSize, magnifyMaxSize, magnifyDistance] = ['--base-size', '--max-size', '--magnify-distance'].map(prop => 
  parseFloat(style.getPropertyValue(prop) || style[prop])
);

function adjustItemSize(e, reset = false) {
  const fullSizeThreshold = 20;
  dockItems.forEach(item => {
    if (reset) {
      item.style.width = item.style.height = `${magnifyMinSize}px`;
      return;
    }
    const rect = item.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const distX = Math.abs(centerX - e.clientX);
    let newSize = magnifyMinSize;
    if (distX < magnifyDistance) {
      const effectiveDistance = Math.max(0, distX - fullSizeThreshold);
      newSize = magnifyMinSize + (magnifyMaxSize - magnifyMinSize) * (1 - (effectiveDistance / (magnifyDistance - fullSizeThreshold)));
    }
    newSize = Math.min(newSize, magnifyMaxSize);
    item.style.width = item.style.height = `${newSize}px`;
  });
}

dock.addEventListener('mousemove', (e) => adjustItemSize(e));
dock.addEventListener('mouseleave', () => adjustItemSize(null, true));