# Laura & Peter Wedding Website

Luxury bilingual wedding website (English and Hungarian) built with:

- HTML5
- Modern CSS (no framework)
- Vanilla JavaScript

The site includes:

- Language switch with stored preference
- Animated digital invitation opening on landing page
- Luxury hero and countdown
- Our Story editorial timeline
- Wedding day vertical timeline
- Venue and travel guidance cards
- Hotel recommendations
- Music request section (Google Form embed)
- RSVP pages (Google Form embed)
- Masonry gallery with lightbox
- FAQ accordion with keyboard support
- CSS architecture split into base styles and theme overrides
- Temporary local theme switcher with localStorage

## Project Structure

- index.html: language landing page and invitation opening animation
- en/index.html: English main wedding page
- hu/index.html: Hungarian main wedding page
- en/rsvp/index.html: English RSVP page
- hu/rsvp/index.html: Hungarian RSVP page
- css/style.css: compatibility entrypoint importing base + default theme
- css/base.css: layout, spacing, typography defaults, accessibility, reusable components
- css/themes/botanical.css: botanical ivory/sage/eucalyptus/brass/merlot theme
- css/themes/autumn-luxury.css: autumn luxury deep green/wine/cream/gold theme
- css/themes/editorial-minimal.css: luxury black/ivory editorial style
- css/themes/irish-estate.css: Northern Ireland countryside heritage palette
- js/main.js: all shared interaction logic
- images/: decorative SVG assets and gallery visuals

## Run Locally (Recommended)

Use a local HTTP server (instead of opening files directly) so routes like /en/, /hu/, and /rsvp/ behave correctly.

### Option A: VS Code Live Server

1. Install the Live Server extension in VS Code.
2. Open the project root folder.
3. Start Live Server from index.html.
4. Open the provided local URL in your browser.

### Option B: Python HTTP Server

From the project root folder, run one of these:

- Windows PowerShell:
	python -m http.server 5500
- macOS/Linux:
	python3 -m http.server 5500

Then open:

- http://localhost:5500/

## How To Test Locally

1. Landing page
- Confirm the invitation overlay appears.
- Click Open Invitation and verify opening animation and smooth reveal.

2. Language behavior
- Switch languages from the landing page.
- Confirm preference is remembered and automatic redirect works.

3. Navigation
- Verify floating nav transparency, solid-on-scroll transition, and active link highlight.
- Test mobile hamburger menu.

4. Content sections
- Check countdown updates in real time (days/hours/minutes/seconds).
- Verify timelines, venue cards, travel cards, hotel cards, music section, and FAQ animation.

5. Gallery
- Confirm masonry layout adapts to screen size.
- Click images to open lightbox.
- Test keyboard: Left/Right arrows and Escape.

6. RSVP and music forms
- Open English and Hungarian RSVP pages.
- Confirm embedded Google Forms render.
- Confirm music form embed renders on main pages.

7. Responsiveness
- Test at mobile, tablet, and desktop widths.

8. Theme preview
- Use the bottom-right temporary theme dropdown.
- Refresh and confirm the selected theme remains active (localStorage).

## How To Change Designs (Themes)

This project uses one shared base stylesheet for layout/components and separate theme files for visual style.

### Quick switch while developing

1. Run the site locally.
2. Use the bottom-right theme dropdown.
3. Pick one of the available themes:
- botanical
- autumn-luxury
- editorial-minimal
- irish-estate

Your choice is saved in localStorage under `wedding_theme_preference`.

### Set the default design for everyone

Edit `css/style.css` and change the second import to the theme you want as default.

Current example:

```css
@import url('./base.css');
@import url('./themes/botanical.css');
```

If you want autumn by default, change the second line to:

```css
@import url('./themes/autumn-luxury.css');
```

### Create a new design theme

1. Add a new file in `css/themes/` (for example `css/themes/my-theme.css`).
2. Only override CSS variables and decorative selectors in that file.
3. Keep layout, spacing system, typography defaults, and reusable components in `css/base.css`.
4. Add your new theme in `js/main.js` inside `AVAILABLE_THEMES` so it appears in the dropdown.

### Reset saved theme locally

If you changed defaults but your browser still shows an old theme, clear localStorage for this site or remove `wedding_theme_preference` in DevTools.

## Configure Google Form URLs

Replace placeholder embed URLs with your real form URLs in:

- en/rsvp/index.html
- hu/rsvp/index.html
- en/index.html (music section)
- hu/index.html (music section)

Search for:

- 1FAIpQLSfRSVPFORMPLACEHOLDER
- 1FAIpQLSfMUSICFORMPLACEHOLDER

## Deployment

The project is static and GitHub Pages compatible.

Deploy by publishing this folder as a Pages site (branch + root directory), then verify:

- Language route links
- Google Maps links
- Form embeds
- Gallery lightbox behavior