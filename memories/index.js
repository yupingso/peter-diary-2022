function showFloor() {
    $("body").css("overflow-y", "hidden");
}

function closeFloor() {
    $("body").css("overflow-y", "auto");
}

function showabout() {
    $("#about_container").css("display", "inherit");
    $("#about_container").addClass("animated slideInLeft");
    showFloor();
    setTimeout(function () {
        $("#about_container").removeClass("animated slideInLeft");
    }, 800);
}
function closeabout() {
    $("#about_container").addClass("animated slideOutLeft");
    closeFloor();
    setTimeout(function () {
        $("#about_container").removeClass("animated slideOutLeft");
        $("#about_container").css("display", "none");
    }, 800);
}
function showwork() {
    $("#work_container").css("display", "inherit");
    $("#work_container").addClass("animated slideInRight");
    showFloor();
    setTimeout(function () {
        $("#work_container").removeClass("animated slideInRight");
    }, 800);
}
function closework() {
    $("#work_container").addClass("animated slideOutRight");
    closeFloor();
    setTimeout(function () {
        $("#work_container").removeClass("animated slideOutRight");
        $("#work_container").css("display", "none");
    }, 800);
}
function showcontact() {
    $("#contact_container").css("display", "inherit");
    $("#contact_container").addClass("animated slideInUp");
    showFloor();
    setTimeout(function () {
        $("#contact_container").removeClass("animated slideInUp");
    }, 800);
}
function closecontact() {
    $("#contact_container").addClass("animated slideOutDown");
    closeFloor();
    setTimeout(function () {
        $("#contact_container").removeClass("animated slideOutDown");
        $("#contact_container").css("display", "none");
    }, 800);
}
setTimeout(function () {
    $("#loading").addClass("animated fadeOut");
    setTimeout(function () {
        $("#loading").removeClass("animated fadeOut");
        $("#loading").css("display", "none");
        $("#box").css("display", "none");
        $("#about").removeClass("animated fadeIn");
        $("#contact").removeClass("animated fadeIn");
        $("#work").removeClass("animated fadeIn");
    }, 1000);
}, 1500);

// Countdown timer

function formatTime(ms) {
    // https://www.w3schools.com/howto/howto_js_countdown.asp
    var hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return hours + "hr " + minutes + "m " + seconds + "s";
}

var endTimeLoaded = false;
var endHour;
var endMinute;

function reloadEndTime(callback) {
    const ts = new Date().getTime();
    const url = `https://opensheet.elk.sh/1BooGWE3g1zshKoVlAM_JjEI6VzbYtEYJyODVHDrQHWM/Sheet1?ts=${ts}`;
    const request = new XMLHttpRequest();
    request.ontimeout = () => {
        console.error(`The request for ${url} timed out`);
    };
    request.onerror = () => {
        console.error(`Request error for ${url}`);
    }
    request.onload = () => {
        try {
            const obj = JSON.parse(request.responseText);
            var newEndHour = parseInt(obj[0]["hh"]);
            var newEndMinute = parseInt(obj[0]["mm"]);
            if (isNaN(newEndHour) || isNaN(newEndMinute)) {
                console.error(`Invalid numbers: ${newEndHour} ${newEndMinute}`);
                console.info(`Response: ${request.responseText}`);
                return;
            }
            endHour = newEndHour;
            endMinute = newEndMinute;
        } catch (error) {
            console.error(error);
            console.info(`Response: ${request.responseText}`);
            return;
        }
        console.info(`Reloaded end time: ${endHour}:${endMinute}`);
        endTimeLoaded = true;
    }
    request.open("GET", url, true);
    request.timeout = 1000;
    request.send(null);
}

reloadEndTime();
setInterval(reloadEndTime, 5000);

var alarm = new Audio("../../audio/alarm.mp3");
var alarmPlaying = false;

function replayAlarm() {
    this.currentTime = 0;
    this.play();
}

function startAlarm() {
    if (alarmPlaying)
        return;
    alarm.addEventListener("ended", replayAlarm, false);
    alarm.play();
    alarmPlaying = true;
}

function stopAlarm() {
    if (!alarmPlaying)
        return;
    alarm.removeEventListener("ended", replayAlarm, false);
    alarm.pause();
    alarm.currentTime = 0;
    alarmPlaying = false;
}

function updateTimer(ms, started) {
    var timer = document.getElementById("timer-time");
    var timersection = document.getElementById("timer");
    // timersection visible if game started
    if (started) {
        timersection.style.visibility = "visible";
    } else {
        timersection.style.visibility = "hidden";
        stopAlarm();
        return;
    }
    // time up if past endtime
    if (ms > 0) {
        timer.innerHTML = formatTime(ms);
        timer.classList.remove("blink");
        stopAlarm();
    } else {
        timer.innerHTML = "Time's up !";
        timer.classList.add("blink");
        startAlarm();
    }
}

var timerInterval = setInterval(function () {
    var started = endTimeLoaded && (endHour >= 0);
    if (!started) {
        updateTimer(0, started);
        return;
    }

    const endSecond = 0;
    var now = new Date();
    var hours = endHour - ((now.getUTCHours() + 8) % 24);
    var minutes = endMinute - now.getUTCMinutes();
    var seconds = endSecond - now.getUTCSeconds();
    var ms = ((hours * 60 + minutes) * 60 + seconds) * 1000;
    updateTimer(ms, started);
}, 1000);


// Modal image
var modal = document.getElementById("myModal");

modal.onclick = function () {
    document.activeElement.blur();
}

modal.onclose = function () {
    $("body").css({ "overflow-y": "auto" });
}

var hiddenImgBtn = document.getElementById("hidden-image");
var middle = document.getElementById("middle");
hiddenImgBtn.onclick = function () {
    modal.showModal();
    $("body").css({ "overflow-y": "hidden" });
}

var closeModalBtn = document.getElementsByClassName("close")[0];
closeModalBtn.onclick = function () {
    modal.close();
}

// See swiperjs.com/swiper-api
const swiper = new Swiper(".swiper", {
    direction: "horizontal",
    centeredSlides: true,
    slidesPerView: 1,

    // Navigation arrows
    navigation: {
        prevEl: ".modal-nav-button-prev-icon",
        nextEl: ".modal-nav-button-next-icon",
    },

    // Keyboard navigation
    keyboard: {
        enabled: true,
    },
});