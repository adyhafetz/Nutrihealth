let container = document.getElementById('container');

function toggle() {
    container.classList.toggle('log-in');
    container.classList.toggle('sign-up');

    // Update the title based on the form mode
    const title = document.getElementById('page-title');
    if (container.classList.contains('sign-up')) {
        title.textContent = 'nutriHealth | Join Us';
    } else {
        title.textContent = 'nutriHealth | Welcome Back';
    }
}

// Initially set the log-in mode
setTimeout(() => {
    container.classList.add('log-in');
}, 200);

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("developerModal");
    const logInLogo = document.querySelector(".login-logo");
    const signUpLogo = document.querySelector(".signup-logo");
    const closeBtn = document.querySelector(".close-btn");
    const logo = document.querySelector(".logo");

    // Function to toggle modal display
    function toggleModal() {
        modal.style.display = modal.style.display === "block" ? "none" : "block";
    }

    // Event listeners for logo clicks to toggle modal
    logInLogo.addEventListener("click", toggleModal);
    signUpLogo.addEventListener("click", toggleModal);

    // Event listener for close button click to close modal
    closeBtn.addEventListener("click", toggleModal);

    // Close modal if clicked outside of it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
});
