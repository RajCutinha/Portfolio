const burger = document.querySelector(".burger");
const mobileNav = document.querySelector("nav .container ul");
const navLinks = mobileNav.querySelectorAll("nav .container ul li a");
const body = document.body;

burger.addEventListener("click", () => {
	burger.classList.toggle("clicked");
	mobileNav.classList.toggle("clicked");
	body.classList.toggle("clicked");
});

navLinks.forEach((links) => {
	links.addEventListener("click", () => {
		burger.classList.toggle("clicked");
		mobileNav.classList.toggle("clicked");
		body.classList.toggle("clicked");
	});
});
