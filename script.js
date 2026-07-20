import { MdParser } from "./parser.js";

// ============================================
// SEARCH ENGINE AND REROUTING LOGIC (WEB MODE)
// ============================================
const webSearchEngines = {
    "Google": "https://www.google.com/search?q=",
    "DuckDuckGo": "https://duckduckgo.com/?q=",
    "Bing": "https://www.bing.com/search?q=",
    "WikiPedia(EN)": "https://en.wikipedia.org/wiki/"
};

const selectedEngine = document.getElementById('selected-engine');
const searchInput = document.getElementById('search-input');
const engineSelect = document.getElementById('menu');
const engines = document.querySelectorAll('#menu li');
const submitQueryBtn = document.getElementById('search-submit-btn');

engines.forEach(child => {
    child.addEventListener('click', () => {
        selectedEngine.innerText = child.innerText;
        engineSelect.classList.toggle('hidden');
    });
});

function processIntent() {
    const inputPayload = searchInput.value.split(',');
    if (!inputPayload) return;

    const cleanTerm = Array.isArray(inputPayload) ? inputPayload[0] : (typeof inputPayload === 'object' ? inputPayload.string : inputPayload);

    // Matches standard URLs cleanly (e.g. apple.com, google.org, https://something.net)
    
    const urlCheckPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;

    if (urlCheckPattern.test(cleanTerm)) {
        const structuralRedirect = cleanTerm.match(/^https?:\/\//i) ? cleanTerm : `https://${cleanTerm}`;
        window.location.href = structuralRedirect;
    } else {
        const selectedEngineKey = selectedEngine.innerText;
        window.location.href = webSearchEngines[selectedEngineKey] + encodeURIComponent(cleanTerm);
    }
}

// Event Bindings
submitQueryBtn.addEventListener('click', processIntent);
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        processIntent();
    }
});



// ============================
// SEARCH SUGGESTIONS & AI MODE
// ============================
let currentSystemMode = 'web'; // Modes available: 'web' or 'ai'

const suggestionsBox = document.getElementById('suggestions-box');
const actionIcon = document.getElementById('search-submit-btn');
const webModeBtn = document.getElementById('mode-search-btn');
const aiModeBtn = document.getElementById('mode-ai-btn');
const power = document.getElementById('power');
power.style.display = "None";
let suggestionsTimeout;

// since we have stopPropagation() in this event document.onClick listner will not recieve this click so we have to add logic to hide suggestionBox onclick of selectEngine here inside selectEngine's eventListner
selectedEngine.addEventListener('click', (e) => {
    e.stopPropagation();
    engineSelect.classList.toggle('hidden');
    suggestionsBox.classList.add('hidden');
});

// --------------------------------------------------------------------
// --- 1. Real-Time Search Suggestions Logic (JSONP Implementation) ---
// --------------------------------------------------------------------
searchInput.addEventListener('input', () => {
    // If in AI mode, don't show normal web search suggestions
    if (currentSystemMode === 'ai') {
        suggestionsBox.classList.add('hidden');
        actionIcon.style.display = "None";
        return;
    }
    else actionIcon.style.display = "Block";

    clearTimeout(suggestionsTimeout);

    const arr = searchInput.value.split(',');
    if (arr.length === 0) {
        suggestionsBox.classList.add('hidden');
        return;
    }
    const query = arr[0];

    // Debounce calls to avoid hitting API rate limits on every keystroke
    suggestionsTimeout = setTimeout(() => {
        const oldScript = document.getElementById('jsonp-suggest-script');
        if(oldScript) oldScript.remove();

        window.handleSuggestionsResponse = (data) => {
            const list = data[1] || [];
            if (list.length === 0) {
                suggestionsBox.classList.add('hidden');
                return;
            }

            suggestionsBox.innerHTML = '';
            list.forEach(term => {
                const cleanTerm = Array.isArray(term) ? term[0] : (typeof term === 'object' ? term.string : term);
                if (!cleanTerm) return;

                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = cleanTerm;

                div.addEventListener('click', () => {
                    searchInput.value = cleanTerm;
                    suggestionsBox.classList.add('hidden');
                    processIntent(); // Instantly selectedEngine search go
                });
                suggestionsBox.appendChild(div);
            });

            suggestionsBox.classList.remove('hidden');
        };

        // Use Google Suggest API via script Injection to cleanly bypass CORS walls
        const script = document.createElement('script');
        script.id = 'jsonp-suggest-script';
        script.src = `https://suggestqueries.google.com/complete/search?client=youtube&q=${encodeURIComponent(query)}&callback=handleSuggestionsResponse`;
        document.body.appendChild(script);
    }, 200);
});

// Close suggestions window instantly if user loses focus on the box area or user clicks engineSelect button
document.addEventListener('click', (e) => {
    if (!suggestionsBox.contains(e.target) && e.target !== searchInput) {
        suggestionsBox.classList.add('hidden');
    }
    const clickedInsideEngine = Array.from(engines).some(engine => engine.contains(e.target));
    if (!engineSelect.contains(e.target) && !clickedInsideEngine) {
        engineSelect.classList.add('hidden');
    }
});


// ---------------------------------------------
// --- 2. AI Mode Architecture Routing Logic ---
// ---------------------------------------------
function switchInterfaceMode(targetMode) {
    currentSystemMode = targetMode;

    if (targetMode === 'ai') {
        document.body.classList.add('ai-activated');
        searchInput.placeholder = 'Ask AI anything (e.g., Write a python script...)';
        actionIcon.style.display = "None";
        
        webModeBtn.classList.remove('active-mode');
        aiModeBtn.classList.add('active-mode');
        suggestionsBox.classList.add('hidden');

        selectedEngine.style.display = "None";
        power.style.display = "Block";
    } else {
        document.body.classList.remove('ai-activated');
        searchInput.placeholder = 'Search the web or paste link...';
        actionIcon.style.display = "Block";
        
        aiModeBtn.classList.remove('active-mode');
        webModeBtn.classList.add('active-mode');

        selectedEngine.style.display = "Block";
        power.style.display = "None";
    }
    searchInput.focus();
}

// Bind Mode Click Actions
webModeBtn.addEventListener('click', () => switchInterfaceMode('web'));
aiModeBtn.addEventListener('click', () => switchInterfaceMode('ai'));

// ---------------------------------------
// --- 3. Local API Integration Engine ---
// ---------------------------------------
let messages = [];
async function askNvidiaAi(userPrompt) {
    messages.push({"role": "user", "content": userPrompt});
    try {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "model": "minimaxai/minimax-m3",
                "messages": messages,
                "temperature": 0.8,
                "max_tokens": 8192,
            })
        });

        const data = await response.json();
        if(data.reply) return data.reply;
        else return null;
    } catch(error) {
        console.error("Frontend Error: ", error);
    }
}

const aiChatResults = document.getElementById('ai-chat-results');

// We intercept and rewrite the primary intent execution function 
const originalProcessIntent = processIntent; 

processIntent = async function() {
    const inputPayload = searchInput.value.split(',')[0];
    if(!inputPayload) return;

    if(currentSystemMode === 'ai') {
        // executeLocalAIChat(inputPayload);
        aiChatResults.classList.remove('hidden');
        appendChatMessage('user', inputPayload);
        searchInput.value = '';

        const loadingBubble = appendChatMessage('ai loading', 'Processing query...');
        aiChatResults.scrollTop = aiChatResults.scrollHeight; // Auto-scroll to view line

        try {
            const rawData = await askNvidiaAi(inputPayload);
            if(rawData !== null) {
                const data = MdParser.toHtml(rawData);
                loadingBubble.remove();

                if(data) {
                    messages.push({"role": "system", "content": data});
                    appendChatMessage('ai', data);
                }
                else appendChatMessage('ai', 'Error: Received empty response from AI');
            }
        } catch(error) {
            console.error('AI Communication Error: ', error);
            loadingBubble.remove();
            appendChatMessage('ai', error);
        }

        aiChatResults.scrollTop = aiChatResults.scrollHeight;
    }
    else originalProcessIntent();
};

function appendChatMessage(senderClass, text) {
    const bubble = document.createElement('div');
    bubble.className = `chat-msg ${senderClass}`;
    bubble.innerHTML = text;
    aiChatResults.appendChild(bubble);
    return bubble;
}

// Modify Mode Switcher to clean window views when toggling back to standard Web Search
const originalSwitchInterfaceMode = switchInterfaceMode;
switchInterfaceMode = function(targetMode) {
    originalSwitchInterfaceMode(targetMode);
    if (targetMode === 'web') {
        aiChatResults.classList.add('hidden');
    } else if (aiChatResults.children.length > 0) {
        // If switching into AI mode and history exists, unhide it
        aiChatResults.classList.remove('hidden');
    }
};