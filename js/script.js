// NOTHING BUT TIME
function formatDateTime() {
    const now = new Date();

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const space = "\u00A0"

    const dayName = days[now.getDay()];
    const dayNum = now.getDate();
    const monthName = months[now.getMonth()];
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const hourFormatted = ((hours + 11) % 12 + 1);
    const period = hours >= 12 ? 'PM' : 'AM';
    const minuteFormatted = minutes < 10 ? '0' + minutes : minutes;

    const dateTimeString = `${dayName} ${dayNum} ${monthName} ${space} ${hourFormatted}:${minuteFormatted} ${period}`;

    document.getElementById('date-time-display').textContent = dateTimeString;
}

formatDateTime();
setInterval(formatDateTime, 60000);