const dragArea = document.querySelector('#drag-area');
const windows = dragArea.querySelectorAll('.window');
let isDragging = false;
let isResizing = false;
let offsetX, offsetY;
let resizeOriginX, resizeOriginY;
let currentZIndex = 10; // Start from the minimum z-index
let maxZIndex = 10; // Keep track of the maximum assigned z-index

// Assign initial z-index to each window
windows.forEach((windowElement, index) => {
    windowElement.style.zIndex = currentZIndex + index;
    maxZIndex = currentZIndex + index;
});

const getDragAreaBounds = () => {
    const style = window.getComputedStyle(dragArea);
    const border = {
        left: parseInt(style.borderLeftWidth, 10),
        top: parseInt(style.borderTopWidth, 10),
        right: parseInt(style.borderRightWidth, 10),
        bottom: parseInt(style.borderBottomWidth, 10)
    };

    return {
        left: dragArea.offsetLeft + border.left,
        top: dragArea.offsetTop + border.top,
        right: dragArea.offsetLeft + dragArea.clientWidth + border.right,
        bottom: dragArea.offsetTop + dragArea.clientHeight + border.bottom
    };
};

const updateZIndexes = (selectedWindow) => {
    const currentIndex = parseInt(selectedWindow.style.zIndex);
    if (currentIndex !== maxZIndex) {
        selectedWindow.style.zIndex = ++maxZIndex;
        selectedWindow.classList.add('front');
        windows.forEach(windowElement => {
            if (windowElement !== selectedWindow) {
                windowElement.classList.remove('front');
            }
        });
    }
};

dragArea.addEventListener('mousedown', (e) => {
    const windowElement = e.target.closest('.window');
    if (!windowElement) return;

    updateZIndexes(windowElement); // Update z-index and manage .front class

    const titleBar = e.target.closest('.title-bar');
    const resizer = e.target.closest('.resizer');

    if (titleBar) {
        isDragging = true;
        offsetX = e.clientX - windowElement.offsetLeft;
        offsetY = e.clientY - windowElement.offsetTop;
    } else if (resizer) {
        isResizing = true;
        currentResizer = resizer.dataset.type;
        resizeOriginX = e.clientX;
        resizeOriginY = e.clientY;
    }

    e.preventDefault();

    const onMouseMove = (e) => {
        if (isDragging) {
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            const bounds = getDragAreaBounds();

            newX = Math.max(bounds.left, Math.min(newX, bounds.right - windowElement.offsetWidth));
            newY = Math.max(bounds.top, Math.min(newY, bounds.bottom - windowElement.offsetHeight));

            windowElement.style.left = `${newX}px`;
            windowElement.style.top = `${newY}px`;
        } else if (isResizing) {
            const dx = e.clientX - resizeOriginX;
            const dy = e.clientY - resizeOriginY;

            if (currentResizer.includes('right')) {
                windowElement.style.width = `${Math.max(280, windowElement.offsetWidth + dx)}px`;
                resizeOriginX = e.clientX;
            }
            if (currentResizer.includes('bottom')) {
                windowElement.style.height = `${Math.max(180, windowElement.offsetHeight + dy)}px`;
                resizeOriginY = e.clientY;
            }
            if (currentResizer.includes('left')) {
                const newWidth = Math.max(280, windowElement.offsetWidth - dx);
                if (newWidth > 280) {
                    windowElement.style.left = `${windowElement.offsetLeft + dx}px`;
                    windowElement.style.width = `${newWidth}px`;
                    resizeOriginX = e.clientX;
                }
            }
            if (currentResizer.includes('top')) {
                const newHeight = Math.max(180, windowElement.offsetHeight - dy);
                if (newHeight > 180) {
                    windowElement.style.top = `${windowElement.offsetTop + dy}px`;
                    windowElement.style.height = `${newHeight}px`;
                    resizeOriginY = e.clientY;
                }
            }
        }
    };

    const onMouseUp = () => {
        if (isDragging) {
            isDragging = false;
        }
        if (isResizing) {
            isResizing = false;
            currentResizer = null;
        }
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

const exitButtons = document.querySelectorAll('.window-exit');
const minimizeButtons = document.querySelectorAll('.window-minimize');
const expandButtons = document.querySelectorAll('.window-expand');

exitButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const windowElement = e.target.closest('.window');
        windowElement.classList.toggle('exit');
    });
});

minimizeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const windowElement = e.target.closest('.window');
        windowElement.classList.toggle('minimize');
    });
});

expandButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const windowElement = e.target.closest('.window');
        // Apply transition only during expand/collapse
        windowElement.style.transition = 'width 0.2s, height 0.2s, top 0.2s, left 0.2s';

        if (windowElement.classList.contains('expand')) {
            // If expanded, restore original dimensions
            windowElement.style.width = windowElement.dataset.originalWidth;
            windowElement.style.height = windowElement.dataset.originalHeight;
            windowElement.style.top = windowElement.dataset.originalTop;
            windowElement.style.left = windowElement.dataset.originalLeft;
            windowElement.classList.remove('expand');
        } else {
            // If not expanded, save current dimensions and expand
            windowElement.dataset.originalWidth = windowElement.style.width;
            windowElement.dataset.originalHeight = windowElement.style.height;
            windowElement.dataset.originalTop = windowElement.style.top;
            windowElement.dataset.originalLeft = windowElement.style.left;
            windowElement.style.width = '100vw';
            windowElement.style.height = '100vh';
            windowElement.style.top = '0';
            windowElement.style.left = '0';
            windowElement.classList.add('expand');
        }

        // Remove the transition after it's done to not affect dragging/resizing
        setTimeout(() => {
            windowElement.style.transition = '';
        }, 200); // 200ms matches the duration of the transition
    });
});