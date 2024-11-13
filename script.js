
    window.addEventListener("scroll", function() {
        const header = document.querySelector(".header");
        if (window.scrollY > 0) {
            header.style.top = "0";
        } else {
            header.style.top = "1rem"; // Match the inset value from your CSS or adjust as needed
        }
    })
