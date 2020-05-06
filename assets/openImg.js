document.addEventListener("DOMContentLoaded", () => {
    const imgs = document.querySelectorAll("img");
    imgs.forEach((img) => {
        img.addEventListener("click", () => {
            window.location = img.src;
        });
    });
});
