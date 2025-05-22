let scrollContainer, sections, dashboardSection;
let lastScrollTime = 0;            // Timestamp for last scroll event
const scrollCooldown = 500;        // Delay between allowed scrolls (ms)
let touchStartY = 0;               // Y-position of touchstart
let scrollDirection = 0;          // Scroll direction: +1 (down), -1 (up)

/**
 * Initializes scroll event handling for desktop and mobile.
 * Enables scroll-to-time-slider sync only when dashboard is in view.
 */
export function initScrollControl() {
  scrollContainer = document.querySelector('.scroll-snap-container');
  sections = document.querySelectorAll('section.content');
  dashboardSection = document.getElementById('dashboard');

  scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
  scrollContainer.addEventListener('touchstart', e => touchStartY = e.touches[0].clientY, { passive: true });
  scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
}

/**
 * Checks if the dashboard section is in the vertical center of the screen.
 * Used to determine if scroll events should affect the time slider.
 */
function isDashboardVisible() {
  const rect = dashboardSection.getBoundingClientRect();
  return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
}

/**
 * Handles scroll wheel events.
 * Triggers time slider update or scrolls to the next section.
 */
function handleWheel(e) {
  if (!isDashboardVisible()) return;

  const now = Date.now();
  if (now - lastScrollTime < scrollCooldown) {
    e.preventDefault(); // prevent rapid scrolls
    return;
  }

  lastScrollTime = now;
  scrollDirection = e.deltaY > 0 ? 1 : -1;
  e.preventDefault();
  updateTimeSlider();
}

/**
 * Handles mobile touch scroll events.
 * Determines swipe direction and triggers time slider change.
 */
function handleTouchMove(e) {
  if (!isDashboardVisible()) return;

  const now = Date.now();
  const deltaY = touchStartY - e.touches[0].clientY;

  if (Math.abs(deltaY) > 5 && now - lastScrollTime >= scrollCooldown) {
    scrollDirection = deltaY > 0 ? 1 : -1;
    lastScrollTime = now;
    e.preventDefault();
    updateTimeSlider();
  }

  touchStartY = e.touches[0].clientY;
}

/**
 * Updates the time slider by one step forward or back depending on scroll direction.
 * If already at the edge, scrolls to the next/previous section instead.
 */
function updateTimeSlider() {
  const slider = document.getElementById('time-slider');
  const current = parseInt(slider.value);
  const next = Math.max(0, Math.min(23, current + scrollDirection));

  if (next !== current) {
    slider.value = next;
    slider.dispatchEvent(new Event('input')); // trigger change handlers
  } else {
    scrollToNextSection(); // scrolls view instead
  }
}

/**
 * Scrolls to the next or previous section depending on scroll direction.
 * Leaves scroll snapping enabled for natural behavior.
 */
function scrollToNextSection() {
  const currentIndex = Array.from(sections).indexOf(dashboardSection);
  const target = sections[currentIndex + scrollDirection];

  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });

    // Optional: reinforce snap in case it was interrupted
    scrollContainer.style.scrollSnapType = 'y mandatory';
  }
}
