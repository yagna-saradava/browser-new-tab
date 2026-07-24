# Personalised AI Powered New Tab Page

A personalized browser new tab page built with vanilla HTML, CSS, and JavaScript. It combines a multi-engine web search experience with a locally hosted AI chat endpoint.

## Features

- Live clock, date, and time-based greeting
- Rotating wallpaper slideshow with previous/next controls
- Web search and direct URL navigation
- Google, DuckDuckGo, Bing, and Wikipedia search engine options
- Search suggestions while typing using Google's public JSONP suggestion endpoint
- AI chat mode with Markdown-formatted replies and copyable code blocks
- Google Workspace quick-links menu
- In-memory AI conversation history for the current page session

## Project structure

```text
browser-new-tab/
├─── backend/
│    ├─── index.js            -- Express API proxy for AI chat requests
│    ├─── package.json        -- Backend dependencies and metadata
│    └─── package-lock.json
│
├─── general.js               -- Greeting, live clock, date, and Apps menu
├─── index.html               -- Page markup
├─── parser.js                -- Lightweight Markdown-to-HTML renderer
├─── script.js                -- Search, suggestions, modes, and AI chat UI
├─── style.css                -- Page styling
└─── wallpaper.js             -- Wallpaper slideshow controls
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- An NVIDIA API key with access to the configured chat model

## Run locally

1. Clone the repository and install the backend dependencies:

   ```bash
   git clone git@github.com:yagna-saradava/browser-new-tab.git
   cd browser-new-tab/backend
   npm install
   ```

2. Start the backend API in one terminal:

   ```bash
   cd backend
   npm test
   ```

### How to Run the Application
You need to run frontend and backend servers simultaneously, Open **2 separate terminals in project root**:

3. Serve the frontend from the project root in another terminal:

   ```bash
   npx serve .
   ```

4. Open the URL shown by `serve` - normally [`http://localhost:3000`](http://localhost:3000) in your browser.

The frontend is configured to call `http://localhost:5000/api/chat`, and the backend permits requests from `http://localhost:3000`.

## Using the page

- **Web mode:** Choose a search engine, enter a query or URL, then press Enter or the arrow button.
- **AI mode:** Select **AI Mode**, enter a prompt, and press Enter. The current conversation remains available until the page is refreshed.
- **Wallpapers:** Use the chevrons at either side of the page to change images manually; the slideshow advances automatically every 10 seconds.

## Technology

| Area | Tools |
| --- | --- |
| Frontend | HTML5, Vanilla CSS, JavaScript modules |
| Backend | Node.js, Express, Morgan, CORS |
| AI integration | OpenAI JavaScript SDK configured for the NVIDIA API |

## Limitations

- The backend is designed for local development: it allows only the `http://localhost:3000` origin.
- Conversation history is stored only in browser memory and is cleared on refresh.
- There are no automated tests or production deployment configuration in this repository.
