const revealElements = document.querySelectorAll('[data-reveal]');
const LANGUAGE_STORAGE_KEY = 'wedding_lang_preference';
const THEME_STORAGE_KEY = 'wedding_theme_preference';
const AVAILABLE_THEMES = [
	{ value: 'botanical', labelEn: 'Botanical', labelHu: 'Botanikus' },
	{ value: 'autumn-luxury', labelEn: 'Autumn Luxury', labelHu: 'Őszi luxus' },
	{ value: 'editorial-minimal', labelEn: 'Editorial Minimal', labelHu: 'Editorial Minimal' },
	{ value: 'irish-estate', labelEn: 'Irish Estate', labelHu: 'Ír birtok' }
];

function getThemeFromStorage() {
	const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
	const isValidTheme = AVAILABLE_THEMES.some((theme) => theme.value === storedTheme);
	return isValidTheme ? storedTheme : 'botanical';
}

function buildThemeStylesheetUrl(themeName) {
	const basePath = getBasePath(window.location.pathname);
	return `${window.location.origin}${basePath}css/themes/${themeName}.css`;
}

function ensureThemeStylesheetLink() {
	let themeLink = document.getElementById('theme-stylesheet');
	if (themeLink instanceof HTMLLinkElement) {
		return themeLink;
	}

	themeLink = document.createElement('link');
	themeLink.id = 'theme-stylesheet';
	themeLink.rel = 'stylesheet';
	document.head.append(themeLink);
	return themeLink;
}

function applyTheme(themeName) {
	const selectedTheme = AVAILABLE_THEMES.some((theme) => theme.value === themeName)
		? themeName
		: 'botanical';
	const themeLink = ensureThemeStylesheetLink();
	themeLink.href = buildThemeStylesheetUrl(selectedTheme);
	window.localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);
}

function initThemeSwitcher() {
	const selectedTheme = getThemeFromStorage();
	applyTheme(selectedTheme);

	if (document.querySelector('[data-theme-switcher]')) {
		return;
	}

	const language = document.documentElement.lang || 'en';
	const isHungarian = language.toLowerCase().startsWith('hu');
	const labelText = isHungarian ? 'Ideiglenes téma választó' : 'Temporary theme preview';

	const wrapper = document.createElement('aside');
	wrapper.className = 'theme-switcher';
	wrapper.dataset.themeSwitcher = 'true';

	const label = document.createElement('label');
	label.setAttribute('for', 'theme-picker');
	label.textContent = labelText;

	const select = document.createElement('select');
	select.id = 'theme-picker';
	select.name = 'theme-picker';

	AVAILABLE_THEMES.forEach((theme) => {
		const option = document.createElement('option');
		option.value = theme.value;
		option.textContent = isHungarian ? theme.labelHu : theme.labelEn;
		if (theme.value === selectedTheme) {
			option.selected = true;
		}
		select.append(option);
	});

	select.addEventListener('change', () => {
		applyTheme(select.value);
	});

	wrapper.append(label, select);
	document.body.append(wrapper);
}

function initInvitationOpening() {
	const overlay = document.querySelector('[data-invitation-overlay]');
	const button = document.querySelector('[data-open-invitation]');
	if (!overlay || !button) return;

	document.body.classList.add('invitation-pending');

	button.addEventListener('click', () => {
		button.disabled = true;
		document.body.classList.add('invitation-opening');

		window.setTimeout(() => {
			document.body.classList.remove('invitation-pending', 'invitation-opening');
			document.body.classList.add('invitation-opened');
		}, 950);
	});
}

initInvitationOpening();

function getLanguageFromPath(pathname) {
	const match = pathname.match(/\/(en|hu)(?:\/|$)/);
	return match ? match[1] : null;
}

function getBasePath(pathname) {
	const segments = pathname.split('/').filter(Boolean);
	if (segments[segments.length - 1] === 'index.html') {
		segments.pop();
	}

	if (segments[segments.length - 1] === 'en' || segments[segments.length - 1] === 'hu') {
		segments.pop();
	}

	return segments.length > 0 ? `/${segments.join('/')}/` : '/';
}

function buildLanguageUrl(language) {
	const basePath = getBasePath(window.location.pathname);
	return `${window.location.origin}${basePath}${language}/`;
}

function setLanguagePreference(language) {
	if (language !== 'en' && language !== 'hu') return;
	window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

initThemeSwitcher();

function applyLanguageRedirect() {
	const preferredLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
	if (preferredLanguage !== 'en' && preferredLanguage !== 'hu') return;

	const currentLanguage = getLanguageFromPath(window.location.pathname);

	if (!currentLanguage || currentLanguage !== preferredLanguage) {
		const targetUrl = buildLanguageUrl(preferredLanguage);
		if (targetUrl !== window.location.href) {
			window.location.replace(targetUrl);
		}
	}
}

function bindLanguageSwitches() {
	const languageLinks = document.querySelectorAll('a.lang-switch, a.lang-link');
	if (languageLinks.length === 0) return;

	languageLinks.forEach((link) => {
		link.addEventListener('click', (event) => {
			const href = link.getAttribute('href') || '';
			const languageRegex = /\/(en|hu)\/?$/;
			const languageMatch = languageRegex.exec(href);
			const language = languageMatch ? languageMatch[1] : null;
			if (!language) return;

			setLanguagePreference(language);
			event.preventDefault();
			document.body.classList.add('is-language-switching');

			window.setTimeout(() => {
				window.location.assign(link.href);
			}, 220);
		});
	});
}

applyLanguageRedirect();
bindLanguageSwitches();

const siteHeader = document.querySelector('[data-header]');
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const sectionLinks = document.querySelectorAll('.main-nav a[href^="#"]');

if (siteHeader) {
	const updateHeaderState = () => {
		if (window.scrollY > 12) {
			siteHeader.classList.add('is-scrolled');
		} else {
			siteHeader.classList.remove('is-scrolled');
		}
	};

	updateHeaderState();
	window.addEventListener('scroll', updateHeaderState, { passive: true });
}

if (siteHeader && navToggle && mainNav) {
	navToggle.addEventListener('click', () => {
		const isOpen = siteHeader.classList.toggle('menu-open');
		navToggle.setAttribute('aria-expanded', String(isOpen));
	});

	mainNav.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', () => {
			siteHeader.classList.remove('menu-open');
			navToggle.setAttribute('aria-expanded', 'false');
		});
	});
}

if (sectionLinks.length > 0) {
	const sectionMap = new Map();
	sectionLinks.forEach((link) => {
		const targetId = link.getAttribute('href')?.slice(1);
		if (!targetId) return;
		const section = document.getElementById(targetId);
		if (section) sectionMap.set(section, link);
	});

	const sectionObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				sectionLinks.forEach((link) => link.classList.remove('active'));
				const activeLink = sectionMap.get(entry.target);
				if (activeLink) activeLink.classList.add('active');
			});
		},
		{
			rootMargin: '-35% 0px -50% 0px',
			threshold: 0.1
		}
	);

	sectionMap.forEach((_, section) => sectionObserver.observe(section));
}

document.querySelectorAll('[data-accordion]').forEach((accordion) => {
	const triggers = Array.from(accordion.querySelectorAll('.faq-trigger'));

	const toggle = (button) => {
		const expanded = button.getAttribute('aria-expanded') === 'true';
		button.setAttribute('aria-expanded', String(!expanded));
	};

	triggers.forEach((button, index) => {
		button.addEventListener('click', () => toggle(button));

		button.addEventListener('keydown', (event) => {
			if (event.key === 'ArrowDown') {
				event.preventDefault();
				const next = triggers[(index + 1) % triggers.length];
				next.focus();
			}

			if (event.key === 'ArrowUp') {
				event.preventDefault();
				const prev = triggers[(index - 1 + triggers.length) % triggers.length];
				prev.focus();
			}

			if (event.key === 'Home') {
				event.preventDefault();
				triggers[0].focus();
			}

			if (event.key === 'End') {
				event.preventDefault();
				triggers.at(-1)?.focus();
			}
		});
	});
});

document.querySelectorAll('.masonry-item img').forEach((image) => {
	if (image.complete) {
		image.classList.add('loaded');
	} else {
		image.addEventListener('load', () => image.classList.add('loaded'), { once: true });
	}
});

const lightboxLinks = Array.from(document.querySelectorAll('[data-lightbox="gallery"]'));

if (lightboxLinks.length > 0) {
	const lightbox = document.createElement('div');
	lightbox.className = 'lightbox';
	lightbox.innerHTML = `
		<div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Image preview">
			<img alt="" />
			<div class="lightbox-meta">
				<p class="lightbox-caption"></p>
				<button type="button" class="lightbox-close">Close</button>
			</div>
		</div>
	`;
	document.body.append(lightbox);

	const lightboxImage = lightbox.querySelector('img');
	const lightboxCaption = lightbox.querySelector('.lightbox-caption');
	const closeButton = lightbox.querySelector('.lightbox-close');
	let activeIndex = -1;

	const showImage = (index) => {
		const safeIndex = (index + lightboxLinks.length) % lightboxLinks.length;
		const link = lightboxLinks[safeIndex];
		if (!lightboxImage || !lightboxCaption) return;
		lightboxImage.src = link.href;
		lightboxImage.alt = link.querySelector('img')?.alt || '';
		lightboxCaption.textContent = link.dataset.caption || '';
		activeIndex = safeIndex;
	};

	const closeLightbox = () => {
		lightbox.classList.remove('is-open');
		document.body.style.overflow = '';
	};

	lightboxLinks.forEach((link, index) => {
		link.addEventListener('click', (event) => {
			event.preventDefault();
			showImage(index);
			lightbox.classList.add('is-open');
			document.body.style.overflow = 'hidden';
		});
	});

	closeButton?.addEventListener('click', closeLightbox);

	lightbox.addEventListener('click', (event) => {
		if (event.target === lightbox) {
			closeLightbox();
		}
	});

	document.addEventListener('keydown', (event) => {
		if (!lightbox.classList.contains('is-open')) return;

		if (event.key === 'Escape') {
			closeLightbox();
		}

		if (event.key === 'ArrowRight') {
			showImage(activeIndex + 1);
		}

		if (event.key === 'ArrowLeft') {
			showImage(activeIndex - 1);
		}
	});
}

if (revealElements.length > 0) {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.15 }
	);

	revealElements.forEach((element) => observer.observe(element));
}

document.querySelectorAll('[data-year]').forEach((element) => {
	element.textContent = String(new Date().getFullYear());
});

function startCountdown(container) {
	const targetRaw = container.dataset.countdown;
	if (!targetRaw) return;

	const targetTime = new Date(targetRaw).getTime();
	if (Number.isNaN(targetTime)) return;

	const dayElement = container.querySelector('[data-unit="days"]');
	const hourElement = container.querySelector('[data-unit="hours"]');
	const minuteElement = container.querySelector('[data-unit="minutes"]');
	const secondElement = container.querySelector('[data-unit="seconds"]');

	const update = () => {
		const remaining = targetTime - Date.now();
		const safeRemaining = Math.max(0, remaining);
		const days = Math.floor(safeRemaining / (1000 * 60 * 60 * 24));
		const hours = Math.floor((safeRemaining / (1000 * 60 * 60)) % 24);
		const minutes = Math.floor((safeRemaining / (1000 * 60)) % 60);
		const seconds = Math.floor((safeRemaining / 1000) % 60);

		if (dayElement) dayElement.textContent = String(days);
		if (hourElement) hourElement.textContent = String(hours).padStart(2, '0');
		if (minuteElement) minuteElement.textContent = String(minutes).padStart(2, '0');
		if (secondElement) secondElement.textContent = String(seconds).padStart(2, '0');
	};

	update();
	window.setInterval(update, 1000);
}

document.querySelectorAll('[data-countdown]').forEach((container) => {
	startCountdown(container);
});

document.querySelectorAll('[data-rsvp-form]').forEach((form) => {
	form.addEventListener('submit', (event) => {
		event.preventDefault();

		const language = document.documentElement.lang || 'en';
		const feedback = form.querySelector('[data-form-feedback]');
		if (!feedback) return;

		if (language.startsWith('hu')) {
			feedback.textContent = 'Köszönjük! A visszajelzésed rögzítettük.';
		} else {
			feedback.textContent = 'Thank you. Your RSVP has been recorded.';
		}

		form.reset();
	});
});
