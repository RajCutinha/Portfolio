const burger = document.querySelector('.burger');
const mobileNav = document.querySelector('.mobile-nav');
const navLinks = mobileNav.querySelectorAll('a');

burger.addEventListener('click', () => {
  burger.classList.toggle('clicked');
  mobileNav.classList.toggle('clicked');
});

navLinks.forEach(links => {
  links.addEventListener('click', () => {
    burger.classList.toggle('clicked');
    mobileNav.classList.toggle('clicked');
  });
});