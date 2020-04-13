const userOptions = document.querySelector("#usrOpt");
const settingsButton = document.querySelector(".settingsBtn")

const tl = new TimelineMax();

tl.fromTo(userOptions, 0.3, {y: "500"}, {y: "20"})
.fromTo(userOptions, 0.5, {x: "140"}, {x: "120"})
.fromTo(settingsButton, 0.1, {x: "650"}, {x: "80"});
const x = false;
function toggleBtn() {
    if (!new RegExp("/toggled/").test(settingsButton.className)) {
        tl.fromTo(userOptions, 0.5, {x: "140"}, {x: "-90"})
        settingsButton.className += "toggled";
    } else {
        tl.fromTo(userOptions, 0.5, {x: "-90"}, {x: "140"})
        settingsButton.className -= "toggled"
    }
}