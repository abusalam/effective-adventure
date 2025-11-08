// ==UserScript==
// @name         AI Homeo Remedy
// @namespace    http://tampermonkey.net/
// @version      2025-11-08
// @description  try to take over the world!
// @author       You
// @match        https://abusalam.github.io/effective-adventure/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to be fully loaded
    window.addEventListener('load', () => {

        // We define the four keys our HTML page will need
        const KEYS_TO_CHECK = {
            'IMPROVE_API_ENDPOINT': {
                prompt: "Please enter your PROMPT IMPROVEMENT API Endpoint:",
                default: "https://api.example.com/v1/improve-prompt"
            },
            'IMPROVE_API_KEY': {
                prompt: "Please enter your PROMPT IMPROVEMENT API Key:",
                default: "sk-improve-..."
            },
            'MAIN_AI_API_ENDPOINT': {
                prompt: "Please enter your MAIN AI (Audio) API Endpoint:",
                default: "https://api.example.com/v1/multimodal"
            },
            'MAIN_AI_API_KEY': {
                prompt: "Please enter your MAIN AI (Audio) API Key:",
                default: "sk-main-..."
            }
        };

        let allKeysSet = true;
        let keysWereMissing = false;

        // Loop through each key and check if it exists in localStorage
        for (const [key, config] of Object.entries(KEYS_TO_CHECK)) {
            if (!localStorage.getItem(key)) {
                allKeysSet = false;
                keysWereMissing = true;
                
                // If a key is missing, prompt the user for it
                const userInput = window.prompt(config.prompt, config.default);
                
                if (userInput) {
                    // Save the user's input to localStorage
                    localStorage.setItem(key, userInput);
                } else {
                    // User clicked "Cancel"
                    alert(`Warning: ${key} was not set. The app may not function correctly.`);
                }
            }
        }

        // If we just added keys, a refresh is often needed for the page to pick them up
        if (keysWereMissing) {
            alert("API configuration saved! Please refresh the page for the changes to take effect.");
        }
    });
})();