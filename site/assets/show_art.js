// Don't show emptry iframes if we can't show art
// since art requires JS this should be fine
document.addEventListener("DOMContentLoaded", () => {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((frame) => {
        frame.style.display = "inline-block";
    });
});

