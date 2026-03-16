// DOM elements
const sourceLangSelect = document.getElementById('sourceLang');
const targetLangSelect = document.getElementById('targetLang');
const sourceText = document.getElementById('sourceText');
const targetTextDiv = document.getElementById('targetText');
const translateBtn = document.getElementById('translateBtn');
const swapBtn = document.getElementById('swapLang');
const speakSourceBtn = document.getElementById('speakSource');
const speakTargetBtn = document.getElementById('speakTarget');
const copySourceBtn = document.getElementById('copySource');
const copyTargetBtn = document.getElementById('copyTarget');
const charCountSpan = document.getElementById('charCount');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('errorMsg');
const darkModeToggle = document.getElementById('darkModeToggle');

// Default values on load
sourceText.value = "Hello, how are you";
sourceLangSelect.value = "en";
targetLangSelect.value = "fr";
updateCharCount();

// Abort controller for fetch requests
let currentController = null;

// Debounce timer
let debounceTimer;

// Initialize translation on page load
window.addEventListener('load', () => {
    translate();
});

// Event listeners
sourceText.addEventListener('input', () => {
    updateCharCount();
    debounce(translate, 500);   // real‑time with debounce
});
sourceLangSelect.addEventListener('change', () => debounce(translate, 300));
targetLangSelect.addEventListener('change', () => debounce(translate, 300));
translateBtn.addEventListener('click', () => {
    clearTimeout(debounceTimer);
    translate();
});
swapBtn.addEventListener('click', swapLanguages);

// Text‑to‑Speech
speakSourceBtn.addEventListener('click', () => {
    const text = sourceText.value.trim();
    if (text) speak(text, sourceLangSelect.value);
});
speakTargetBtn.addEventListener('click', () => {
    const text = targetTextDiv.innerText.trim();
    if (text) speak(text, targetLangSelect.value);
});

// Copy to clipboard
copySourceBtn.addEventListener('click', () => {
    copyText(sourceText.value);
});
copyTargetBtn.addEventListener('click', () => {
    copyText(targetTextDiv.innerText);
});

// Dark mode toggle
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const icon = darkModeToggle.querySelector('i');
    if (document.body.classList.contains('dark')) {
        icon.className = 'fas fa-sun';
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
        icon.className = 'fas fa-moon';
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
});

// Helper: update character count
function updateCharCount() {
    const len = sourceText.value.length;
    charCountSpan.textContent = len;
}

// Debounce function
function debounce(func, delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay);
}

// Main translation function
async function translate() {
    const text = sourceText.value.trim();
    if (!text) {
        targetTextDiv.innerText = '';
        return;
    }

    const source = sourceLangSelect.value;
    const target = targetLangSelect.value;

    // Build langpair: "auto|fr" for detect, otherwise "en|fr"
    const langpair = source === 'detect' ? `auto|${target}` : `${source}|${target}`;

    // Show loading, hide previous error
    loadingDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');

    // Abort previous request if any
    if (currentController) {
        currentController.abort();
    }
    currentController = new AbortController();
    const { signal } = currentController;

    try {
        // Use GET request with query parameters
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langpair)}`;
        const response = await fetch(url, { signal });

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const data = await response.json();
        // MyMemory returns translated text in responseData.translatedText
        const translated = data.responseData?.translatedText || '';

        if (translated) {
            targetTextDiv.innerText = translated;
        } else {
            throw new Error('Empty translation');
        }
    } catch (err) {
        if (err.name === 'AbortError') {
            // Request was aborted, ignore
            return;
        }
        console.error(err);
        errorDiv.textContent = 'Translation failed. Please try again.';
        errorDiv.classList.remove('hidden');
        targetTextDiv.innerText = '';
    } finally {
        loadingDiv.classList.add('hidden');
        currentController = null;
    }
}

// Swap languages with smart handling of "detect"
function swapLanguages() {
    const source = sourceLangSelect.value;
    const target = targetLangSelect.value;

    let newSource = target;
    let newTarget = source;

    // If new target becomes "detect" (only possible if source was "detect"),
    // set it to the opposite of the new source.
    if (newTarget === 'detect') {
        newTarget = newSource === 'en' ? 'fr' : 'en';
    }

    sourceLangSelect.value = newSource;
    targetLangSelect.value = newTarget;

    // Trigger translation after swap (with debounce)
    debounce(translate, 300);
}

// Text‑to‑Speech function
function speak(text, langCode) {
    if (!window.speechSynthesis) {
        alert('Text-to-speech not supported in this browser.');
        return;
    }
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Map our codes to BCP‑47 language tags
    if (langCode === 'en') utterance.lang = 'en-US';
    else if (langCode === 'fr') utterance.lang = 'fr-FR';
    else utterance.lang = 'en-US'; // fallback for detect

    window.speechSynthesis.speak(utterance);
}

// Copy text to clipboard
async function copyText(text) {
    if (!text) return;
    try {
        await navigator.clipboard.writeText(text);
        // Optional: brief visual feedback (e.g., change button color)
        console.log('Copied!');
    } catch (err) {
        alert('Failed to copy text.');
    }
}