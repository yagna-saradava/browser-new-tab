# Personalised AI Powered New Tab Page

An AI powered New Tab homepage, built with vanilla HTML, CSS and JavaScript frontend and Node.JS backend.

## Project Structure

```
browser/
├── backend/
│   ├── index.js    # backend app for handling API requests to AI
│   ├── package.json
│   └── package-lock.json
├── general.js      # Dropdown Apps menu, Live Clock and Date, and Greeting
├── index.html      # Main HTML structure
├── parser.js       # Parses and Converts markdown(Md) code to html code
├── README.md
├── script.js       # Handles search suggestions, search redirect and AI prompt/replies API requests
├── style.css       # Styling and layout
└── wallpaper.js    # Manages background slideshow and manual prev/next background
```

## Features

The project has the following major features:

- Background Slideshow (Including Manual image change prev/next options)
- Different Web Mode and AI Mode
- Different Search Engine Options in Web Mode
- Web Mode with live suggestions of searched text
- AI Mode powered by Nvidia AI
- Session Persistant AI Chat history (History remains intact until page refresh/hard refresh)
- Gmail, Images and Apps buttons on top right corner just like Google Chrome New Tab Page
- Live clock and greeting (Morning/Afternoon/Evening based on time) and date

## Getting Started

Following are the steps to setup and run the application locally.

### Prerequisites

You will need **Node.js** which includes `npm` and `npx` installed on your system. Below are the steps to install:

* **Linux (Debian/Ubuntu):**
  ```bash
  sudo apt update
  sudo apt install nodejs npm
  ```
* **MacOS:**
  Using HomeBrew:
  ```bash
  brew install node
  ```
* **Windows:**
  Download and run the official installer from [nodejs.org](https://nodejs.org).

---

### Installation and Setup

1. **Clone or navigate** to the project root.
2. Open `index.html` in any modern web browser.

> **Note:** An internet connection is needed to load the Poppins font from Google Fonts and for the header/footer links to work.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and layout |
| CSS3 | Styling, flexbox layout, hover transitions |
| JavaScript (ES6) | Live character counting, button state management |
| Google Fonts (Poppins) | Logo and button typography |

## Known Limitations

- The 50-character limit on the search bar is a soft limit — it highlights in red but does **not** block submission.
- The "Settings" link in the footer is not yet wired up.

## References

- [Google Homepage](https://www.google.co.in/) — Original design reference
- [Google Fonts — Poppins](https://fonts.google.com/specimen/Poppins) — Font used for the logo and buttons
- [Google Doodles](https://doodles.google/) — Target of the "I'm Feeling Lucky" button
- [Google Search Documentation](https://developers.google.com/custom-search/docs/element) — How the `action="https://www.google.com/search"` form submission works
- [MDN — HTML Forms](https://developer.mozilla.org/en-US/docs/Learn/Forms) — Reference for form, input, and button elements
- [MDN — Flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox) — Layout technique used throughout the page
- [MDN — addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) — Used for the live character counter in `script.js`
- [MDN — HTMLButtonElement.disabled](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement/disabled) — Used to toggle the submit button state
- [Google Brand Colors](https://brandpalettes.com/google-color-codes/) — Hex codes `#4285F4`, `#EA4335`, `#FBBC05` used in the logo
- [Google Policies — Privacy](https://policies.google.com/privacy) — Linked in the footer
- [Google Policies — Terms](https://policies.google.com/terms) — Linked in the footer# browser-new-tab
