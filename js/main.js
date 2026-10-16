/* =========================================
   CASIO COLLECTION
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   WATCH DATA
========================================= */

const watches = {

    gshock: {
        title: "G-Shock",
        description:
            "Built to survive the toughest conditions, the G-Shock collection has become the benchmark for rugged watches. Combining shock resistance with modern styling, it is trusted by military personnel, athletes and outdoor enthusiasts around the world.",
        images: [
            "images/gshock3.webp",
            "images/gshock22.webp"
        ],
        specs: [
            "Shock Resistant",
            "200M Water Resistant",
            "World Time",
            "LED Backlight",
            "Stopwatch & Countdown Timer",
            "Carbon Core Guard Structure"
        ]
    },

    babyg: {
        title: "Baby-G",
        description:
            "Baby-G blends the legendary toughness of G-Shock with a slimmer, more fashionable design. Bright colours and dependable durability make it perfect for everyday wear.",
        images: [
            "images/babyg.webp",
            "images/babyg2.webp"
        ],
        specs: [
            "Shock Resistant",
            "100M Water Resistant",
            "LED Light",
            "World Time",
            "Daily Alarm",
            "Stopwatch"
        ]
    },

    protrek: {
        title: "Pro Trek",
        description:
            "Engineered for outdoor adventures, Pro Trek watches are equipped with advanced sensors that help hikers, campers and explorers navigate with confidence.",
        images: [
            "images/ptrtrek.webp",
            "images/prootrek.webp"
        ],
        specs: [
            "Triple Sensor",
            "Altimeter",
            "Compass",
            "Barometer",
            "Solar Charging",
            "200M Water Resistance"
        ]
    },

    edifice: {
        title: "Edifice",
        description:
            "Inspired by motorsport engineering, the Edifice collection combines premium materials, Bluetooth connectivity and sophisticated styling.",
        images: [
            "images/edifice.webp",
            "images/edi1.webp"
        ],
        specs: [
            "Bluetooth",
            "Solar Powered",
            "Chronograph",
            "World Time",
            "Sapphire Crystal",
            "100M Water Resistant"
        ]
    },

    classic: {
        title: "Casio Classic",
        description:
            "An icon that has stood the test of time. Lightweight, affordable and incredibly reliable, the F-91W remains one of the world's most recognised digital watches.",
        images: [
            "images/classics.webp",
            "images/classic.webp"
        ],
        specs: [
            "Daily Alarm",
            "LED Light",
            "Stopwatch",
            "7-Year Battery",
            "Lightweight Design",
            "Water Resistant"
        ]
    },

    sports: {
        title: "Sports",
        description:
            "Designed for active lifestyles with accurate timing functions and dependable durability for training and everyday fitness.",
        images: [
            "images/sport1.webp",
            "images/sportt.webp"
        ],
        specs: [
            "100M Water Resistance",
            "Dual Time",
            "Stopwatch",
            "Lap Memory",
            "Countdown Timer",
            "LED Light"
        ]
    },

    vintage: {
        title: "Vintage",
        description:
            "Retro styling meets modern reliability. Vintage Casio watches continue to be fashion icons across generations.",
        images: [
            "images/vintage1.webp",
            "images/vintage.webp"
        ],
        specs: [
            "Electro Luminescent Display",
            "Alarm",
            "Stopwatch",
            "Adjustable Clasp",
            "Classic Digital Display",
            "Long Battery Life"
        ]
    },

    smart: {
        title: "Smart Outdoor",
        description:
            "Combining rugged durability with smart functionality, the Smart Outdoor range delivers GPS navigation, maps and activity tracking for adventurers.",
        images: [
            "images/smart2.webp",
            "images/smart1.webp"
        ],
        specs: [
            "GPS Navigation",
            "Offline Maps",
            "Activity Tracking",
            "Compass",
            "Water Resistant",
            "Military Standard Durability"
        ]
    }

};


/* =========================================
   DOM ELEMENTS
========================================= */

const cards = document.querySelectorAll(".watch-card");

const modal = document.getElementById("watchModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalModel = document.getElementById("modalModel");
const modalDescription = document.getElementById("modalDescription");
const modalSpecs = document.getElementById("modalSpecs");
const closeModal = document.getElementById("closeModal");
const nextImage = document.getElementById("nextImage");
const prevImage = document.getElementById("prevImage");

const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

const navbar = document.getElementById("navbar");
const progressBar = document.getElementById("progressBar");
const topBtn = document.getElementById("topBtn");
const hero = document.querySelector(".hero");


/* =========================================
   IMAGE PRELOADING
   Modal images load when a card is hovered
   or focused, and the rest load quietly once
   the page has finished loading.
========================================= */

const preloaded = new Set();

function preloadWatch(key) {

    const watch = watches[key];

    if (!watch) return;

    watch.images.forEach(src => {

        if (preloaded.has(src)) return;

        preloaded.add(src);

        const image = new Image();
        image.decoding = "async";
        image.src = src;

    });

}

window.addEventListener("load", () => {

    const preloadAll = () =>
        Object.keys(watches).forEach(preloadWatch);

    if ("requestIdleCallback" in window) {
        requestIdleCallback(preloadAll, { timeout: 4000 });
    } else {
        setTimeout(preloadAll, 1500);
    }

});


/* =========================================
   MODAL
========================================= */

let currentWatch = null;
let currentImage = 0;
let autoSlide = null;
let lastFocused = null;
let swapTimer = null;

function loadWatch(key) {

    currentWatch = watches[key];
    currentImage = 0;

    modalTitle.textContent = currentWatch.title;
    modalModel.textContent = currentWatch.model || "";
    modalDescription.textContent = currentWatch.description;

    modalImage.classList.remove("fading");
    modalImage.src = currentWatch.images[0];
    modalImage.alt = currentWatch.title;

    modalSpecs.replaceChildren(
        ...currentWatch.specs.map(spec => {
            const li = document.createElement("li");
            li.textContent = spec;
            return li;
        })
    );

}

/* fade out, swap the image once it's decoded, fade back in */
function showImage(index) {

    const images = currentWatch.images;

    currentImage = (index + images.length) % images.length;

    const src = images[currentImage];

    modalImage.classList.add("fading");

    clearTimeout(swapTimer);

    swapTimer = setTimeout(() => {

        const next = new Image();
        next.src = src;

        const reveal = () => {
            modalImage.src = src;
            modalImage.classList.remove("fading");
        };

        if (next.decode) {
            next.decode().then(reveal, reveal);
        } else {
            reveal();
        }

    }, 180);

}

function nextSlide() {
    showImage(currentImage + 1);
}

function previousSlide() {
    showImage(currentImage - 1);
}

function startCarousel() {
    stopCarousel();
    autoSlide = setInterval(nextSlide, 5000);
}

function stopCarousel() {
    clearInterval(autoSlide);
}

/* manual navigation restarts the 5s auto-slide timer */
nextImage.addEventListener("click", () => {
    nextSlide();
    startCarousel();
});

prevImage.addEventListener("click", () => {
    previousSlide();
    startCarousel();
});

function openModal(key) {

    if (!watches[key]) return;

    lastFocused = document.activeElement;

    preloadWatch(key);
    loadWatch(key);

    modal.classList.add("show");
    document.body.classList.add("no-scroll");

    closeModal.focus();

    startCarousel();

}

function hideModal() {

    modal.classList.remove("show");
    document.body.classList.remove("no-scroll");

    stopCarousel();
    clearTimeout(swapTimer);

    if (lastFocused) lastFocused.focus();

}

cards.forEach(card => {

    const key = card.dataset.watch;

    card.addEventListener("click", () => openModal(key));

    card.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal(key);
        }
    });

    card.addEventListener("pointerenter", () => preloadWatch(key), { once: true });
    card.addEventListener("focus", () => preloadWatch(key), { once: true });

});

closeModal.addEventListener("click", hideModal);

/* click outside the box closes it */
modal.addEventListener("click", e => {
    if (e.target === modal) hideModal();
});

/* keyboard: Esc closes, arrows change image, Tab stays inside */
document.addEventListener("keydown", e => {

    if (!modal.classList.contains("show")) return;

    switch (e.key) {

        case "Escape":
            hideModal();
            break;

        case "ArrowRight":
            nextSlide();
            startCarousel();
            break;

        case "ArrowLeft":
            previousSlide();
            startCarousel();
            break;

        case "Tab": {
            const focusable = modal.querySelectorAll("button");
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
            break;
        }

    }

});

/* touch swipe */
let touchStartX = 0;

modalImage.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

modalImage.addEventListener("touchend", e => {

    const distance = touchStartX - e.changedTouches[0].screenX;

    if (Math.abs(distance) < 50) return;

    if (distance > 0) {
        nextSlide();
    } else {
        previousSlide();
    }

    startCarousel();

}, { passive: true });


/* =========================================
   SEARCH
========================================= */

/* card text never changes, so read it once */
const searchIndex = Array.from(cards, card => ({
    card,
    text: [
        card.querySelector("h3")?.textContent,
        card.querySelector(".watch-tag")?.textContent,
        card.querySelector("p")?.textContent
    ].join(" ").toLowerCase()
}));

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const search = searchInput.value.trim().toLowerCase();

        let visible = 0;

        searchIndex.forEach(({ card, text }) => {

            const match = text.includes(search);

            card.hidden = !match;

            if (match) visible++;

        });

        noResults.classList.toggle("visible", visible === 0);

    });

}


/* =========================================
   MOBILE MENU
========================================= */

function setMenu(open) {

    navLinks.classList.toggle("active", open);

    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");

}

menuBtn.addEventListener("click", () => {
    setMenu(!navLinks.classList.contains("active"));
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
        setMenu(false);
        menuBtn.focus();
    }
});


/* =========================================
   SCROLL EFFECTS
   Navbar, progress bar and back-to-top button
   share one passive listener that runs at
   most once per frame.
========================================= */

let maxScroll = 0;
let ticking = false;
let navScrolled = null;
let topVisible = null;

function measure() {
    maxScroll =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
}

function onScroll() {

    ticking = false;

    const y = window.scrollY;

    const scrolled = y > 80;

    if (scrolled !== navScrolled) {
        navbar.classList.toggle("scrolled", scrolled);
        navScrolled = scrolled;
    }

    const showTop = y > 500;

    if (showTop !== topVisible) {
        topBtn.classList.toggle("visible", showTop);
        topVisible = showTop;
    }

    const progress = maxScroll > 0 ? Math.min(y / maxScroll, 1) : 0;

    progressBar.style.transform = `scaleX(${progress})`;

}

function requestScroll() {
    if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
    }
}

window.addEventListener("scroll", requestScroll, { passive: true });

window.addEventListener("resize", () => {
    measure();
    requestScroll();
}, { passive: true });

window.addEventListener("load", () => {
    measure();
    requestScroll();
});

measure();
onScroll();

topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


/* =========================================
   REVEAL ANIMATIONS
========================================= */

const revealObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
        }

    });

}, { threshold: .15 });

document.querySelectorAll(".reveal").forEach(element => {
    revealObserver.observe(element);
});


/* =========================================
   PAUSE HERO ANIMATIONS OFF-SCREEN
========================================= */

if (hero) {

    new IntersectionObserver(([entry]) => {
        hero.classList.toggle("is-offscreen", !entry.isIntersecting);
    }).observe(hero);

}


/* =========================================
   CONSOLE SIGNATURE
========================================= */

console.log(
    "%cCasio Collection\nBuilt with HTML, CSS & JavaScript",
    "color:#d4af37;font-size:14px;font-weight:bold;"
);
