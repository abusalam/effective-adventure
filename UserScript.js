// ==UserScript==
// @name         AI Page API Key Manager
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Prompts for and stores API keys in localStorage for the AI prompt page.
// @author       You
// @match        https://abusalam.github.io/effective-adventure/
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // We define the keys our HTML page will need
    const KEYS_TO_CHECK = {
        // 'OPENAI_API_KEY': {
        //     prompt: "Please enter your OpenAI API Key (for Whisper, GPT-4o):",
        //     default: "sk-..."
        // },
        'GOOGLE_AI_KEY': {
            prompt: "Please enter your Google AI API Key (for Gemini):",
            default: "AIzaSy..."
        }
        // Add other keys here as you add more models
    };

    let keysWereMissing = false;

    // Loop through each key and check if it exists in localStorage
    for (const [key, config] of Object.entries(KEYS_TO_CHECK)) {
        if (!localStorage.getItem(key)) {
            keysWereMissing = true;
            
            // If a key is missing, prompt the user for it
            const userInput = window.prompt(config.prompt, config.default);
            
            if (userInput) {
                // Save the user's input to localStorage
                localStorage.setItem(key, userInput);
            } else {
                // User clicked "Cancel"
                alert(`Warning: ${key} was not set. Some models may not function.`);
            }
        }
    }

    if (keysWereMissing) {
        alert("API configuration saved! Please refresh the page for the changes to take effect.");
    }
})();