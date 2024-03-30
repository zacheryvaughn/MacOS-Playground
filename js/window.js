document.addEventListener('DOMContentLoaded', () => {
    var dragItem = document.querySelector(".overview-top-bar");
    var window = document.querySelector(".overview-window");

    var active = false;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;

    window.addEventListener("mousedown", dragStart, false);
    document.addEventListener("mouseup", dragEnd, false);
    document.addEventListener("mousemove", drag, false);

    function dragStart(e) {
        if (e.target === dragItem) {
            active = true;
            initialX = e.clientX;
            initialY = e.clientY;
        }
    }

    function dragEnd(e) {
        active = false;
    }

    function drag(e) {
        if (active) {
            e.preventDefault();

            // Calculate displacement since the drag started
            var dx = e.clientX - initialX;
            var dy = e.clientY - initialY;

            // Update the initial positions for the next calculation
            initialX = e.clientX;
            initialY = e.clientY;

            // Calculate potential new offsets
            var potentialXOffset = xOffset + dx;
            var potentialYOffset = yOffset + dy;

            // Adjust potentialYOffset to prevent window from moving above 25px from the viewport top
            var windowTop = window.getBoundingClientRect().top;
            if (windowTop + dy < 25 && yOffset + dy < 25) {
                potentialYOffset = Math.max(25 - windowTop + yOffset, potentialYOffset);
            }

            // Apply the adjusted offsets
            xOffset = potentialXOffset;
            yOffset = potentialYOffset;

            setTranslate(xOffset, yOffset, window);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }

    // Function to show the overview window
    function showOverview() {
        document.querySelector('.overview-window').style.display = 'block'; // Or visibility: visible;
    }

    // Event listener for dock item click
    document.querySelectorAll('.dock-item').forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default behavior of anchor tags
            showOverview();
        });
    });

    // Event listener for red button click
    document.querySelector('.button-red').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default behavior of anchor tags
        document.querySelector('.overview-window').style.display = 'none'; // Or visibility: hidden;
    });

    // Event listener for yellow button click
    document.querySelector('.button-yellow').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default behavior of anchor tags
        document.querySelector('.overview-window').style.display = 'none'; // Or visibility: hidden;
    });

    // IMAGE VIEWER
    class ImageViewer {
        constructor(containerId, images) {
            this.container = document.getElementById(containerId);
            this.images = images;
            this.currentIndex = 0;
    
            this.render();
            this.updateImage();
        }
    
        render() {
            // Create img element
            const img = document.createElement('img');
            img.src = this.images[this.currentIndex];
            img.alt = 'Image';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.objectFit = 'contain';
            img.style.display = 'block';
    
            // Add img to container
            this.container.appendChild(img);
    
            // Add event listeners for previous and next buttons
            const prevBtn = document.querySelector('.image-previous');
            const nextBtn = document.querySelector('.image-next');
            prevBtn.addEventListener('click', () => this.prevImage());
            nextBtn.addEventListener('click', () => this.nextImage());
    
            // Set initial image count
            const imageCounter = document.querySelector('.image-counter');
            imageCounter.textContent = `${this.currentIndex + 1}/${this.images.length}`;
        }
    
        updateImage() {
            const imageElement = this.container.querySelector('img');
            const imageCounter = document.querySelector('.image-counter');
            imageElement.src = this.images[this.currentIndex];
            imageCounter.textContent = `${this.currentIndex + 1}/${this.images.length}`;
        }
    
        prevImage() {
            this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
            this.updateImage();
        }
    
        nextImage() {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
            this.updateImage();
        }
    }
    
    // Create an instance of ImageViewer with your images
    const imageViewer1 = new ImageViewer('imageViewer1', ['images/lingomingle/lingomingle2.png', 'images/lingomingle/lingomingle1.png', 'images/lingomingle/lingomingle3.png', 'images/lingomingle/lingomingle4.png', 'images/lingomingle/lingomingle5.png', 'images/lingomingle/lingomingle6.png']);
    
});