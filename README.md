# multilingual-translator.
A web‑based translation app using My Memory API – supports English/French, text‑to‑speech, copy, swap, dark mode, and real‑time translation.
# Multilingual Translation Web App

A web‑based translation application built for a Full Stack Development assignment.  
It uses the MyMemory API to translate text between English and French, with additional features like text‑to‑speech, copy to clipboard, language swap, dark mode, and real‑time translation with debounce.

## Features
- Translate user‑entered text (max 500 characters)
- Source language: Detect, English, French
- Target language: English, French
- Swap languages with a single click
- Listen to original and translated text (Text‑to‑Speech)
- Copy original and translated text to clipboard
- Real‑time translation with debounce
- Loading indicator while fetching translation
- Error handling for failed API requests
- Responsive design (works on mobile)
- Dark mode toggle

## Technologies Used
- HTML5
- CSS3 (Flexbox/Grid, responsive design, dark mode)
- JavaScript (ES6)
- [MyMemory Translation API](https://mymemory.translated.net/doc/spec.php)

## How to Run
1. Download or clone this repository.
2. Open `index.html` in any modern web browser.
3. No server or build step required – it works directly in the browser.

## API Reference
The app fetches translations from:
