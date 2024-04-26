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
    if (currentIndex !== maxZIndex) { // Only adjust if not already the highest
        selectedWindow.style.zIndex = maxZIndex;
        windows.forEach(windowElement => {
            const zIndex = parseInt(windowElement.style.zIndex);
            if (windowElement !== selectedWindow && zIndex > currentIndex) {
                windowElement.style.zIndex = zIndex - 1;
            }
        });
    }
};

dragArea.addEventListener('mousedown', (e) => {
    const windowElement = e.target.closest('.window');
    if (!windowElement) return;

    updateZIndexes(windowElement); // Update z-index on interaction

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
                windowElement.style.width = `${Math.max(100, windowElement.offsetWidth + dx)}px`;
                resizeOriginX = e.clientX;
            }
            if (currentResizer.includes('bottom')) {
                windowElement.style.height = `${Math.max(100, windowElement.offsetHeight + dy)}px`;
                resizeOriginY = e.clientY;
            }
            if (currentResizer.includes('left')) {
                const newWidth = Math.max(100, windowElement.offsetWidth - dx);
                if (newWidth > 100) {
                    windowElement.style.left = `${windowElement.offsetLeft + dx}px`;
                    windowElement.style.width = `${newWidth}px`;
                    resizeOriginX = e.clientX;
                }
            }
            if (currentResizer.includes('top')) {
                const newHeight = Math.max(100, windowElement.offsetHeight - dy);
                if (newHeight > 100) {
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
