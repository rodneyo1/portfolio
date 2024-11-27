
    window.addEventListener("scroll", function() {
        const header = document.querySelector(".header");
        if (window.scrollY > 0) {
            header.style.top = "0";
        } else {
            header.style.top = "1rem"; // Match the inset value from your CSS or adjust as needed
        }
    })

    // typed js
    function typeText(element, text, delay = 100) {
        let index = 0;
      
        function typeNextChar() {
          if (index < text.length) {
            element.innerHTML += text[index];
            index++;
            setTimeout(typeNextChar, delay);
          }
        }
      
        // Clear the element's content before starting the typing effect
        element.innerHTML = '';
        typeNextChar();
      }
      
      const element = document.querySelector('.section-heading');
      if (element) {
        typeText(element, element.innerText, 100);
      }


      //save scroll position
      document.addEventListener("DOMContentLoaded", () => {
        // Generate a unique key for the current page
        const pageKey = `scrollPosition_${window.location.pathname}`;
      
        // Save scroll position before navigating away
        window.addEventListener("beforeunload", () => {
          localStorage.setItem(pageKey, window.scrollY);
        });
      
        // Restore scroll position when the page is loaded
        const savedScrollPosition = localStorage.getItem(pageKey);
        if (savedScrollPosition !== null) {
          window.scrollTo(0, parseInt(savedScrollPosition, 10));
        }
      });
      