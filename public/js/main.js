document
  .getElementById("hamburger-menu")
  .addEventListener("click", function () {
    const navLinks = document.getElementById("nav-links");
    navLinks.classList.toggle("active");
  });


  function copyright() {
    const date = document.getElementById("date");
    const year = new Date();

    if (date) {
      date.innerHTML = year.getFullYear();
    }
  }

  window.onload = () => {
    copyright();
  };