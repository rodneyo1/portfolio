
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
      
      // Usage example:
      const element = document.querySelector('.section-heading');
      if (element) {
        typeText(element, element.innerText, 100);
      }


   
    //   function addSlideTransition() {
    //     const links = document.querySelectorAll("a");
    
    //     links.forEach(link => {
    //         link.addEventListener("click", function(event) {
    //             if (link.hostname === window.location.hostname && link.pathname !== window.location.pathname) {
    //                 event.preventDefault();
                    
    //                 // Choose left or right based on preference
    //                 document.body.classList.add("slide-out-left");
    
    //                 setTimeout(() => {
    //                     window.location = link.href;
    //                 }, 500);
    //             }
    //         });
    //     });
    // }
    
    // addSlideTransition();
    
