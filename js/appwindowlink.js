let finderIcon = document.getElementById('finder-icon');
let finderWindow = document.getElementById('finder-window');

finderIcon.addEventListener('click', () => {
    finderWindow.classList.remove('exit');
    finderWindow.classList.add('open');
})