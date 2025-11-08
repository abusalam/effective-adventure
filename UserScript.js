// --- 2. Prompt Improvement Logic ---
        
        improveButton.addEventListener('click', () => {
            const currentPrompt = promptTextarea.value;
            if (!currentPrompt) {
                alert("Please enter a prompt first.");
                return;
            }
            feedbackArea.style.display = 'none';
            loadingSpinner.style.display = 'block';
            improveButton.disabled = true;
            
            // This is no longer a simulation!
            callRealImprovePromptAPI(currentPrompt);
        });

        /**
         * !! THIS IS THE REAL API CALL !!
         * This function reads from localStorage (set by your userscript)
         * and makes the actual network request.
         */
        function callRealImprovePromptAPI(prompt) {
            // Get credentials from localStorage
            const apiEndpoint = localStorage.getItem('IMPROVE_API_ENDPOINT');
            const apiKey = localStorage.getItem('IMPROVE_API_KEY');

            // Check if keys exist
            if (!apiEndpoint || !apiKey) {
                alert("Error: Prompt Improvement API endpoint or key is not set in localStorage.");
                loadingSpinner.style.display = 'none';
                improveButton.disabled = false;
                return;
            }

            console.log("Calling Prompt Improvement API:", apiEndpoint);

            // --- REAL FETCH CALL ---
            fetch(apiEndpoint, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + apiKey 
                },
                body: JSON.stringify({ prompt: prompt })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                feedbackArea.style.display = 'block';
                // --- Process your API's specific response ---
                // (You must adapt this part to match your API's JSON response)
                if (data.followUpQuestion) {
                    feedbackArea.innerHTML = `<strong>Follow-up:</strong> ${data.followUpQuestion}`;
                } else if (data.improvedPrompt) {
                    promptTextarea.value = data.improvedPrompt;
                    feedbackArea.innerHTML = "<strong>Suggestion:</strong> I've improved your prompt!";
                } else {
                    feedbackArea.innerHTML = "<strong>Feedback:</strong> Prompt looks good!";
                }
            })
            .catch(err => {
                console.error('Error improving prompt:', err);
                feedbackArea.style.display = 'block';
                feedbackArea.innerHTML = `Error connecting to prompt service: ${err.message}`;
            })
            .finally(() => {
                loadingSpinner.style.display = 'none';
                improveButton.disabled = false;
            });
        }


        // --- 3. Main AI Submission Logic ---

        submitButton.addEventListener('click', () => {
            const prompt = promptTextarea.value;
            if (!prompt) {
                alert("Please provide a text prompt.");
                return;
            }
            if (!audioBlob) {
                alert("Please record audio first.");
                return;
            }
            
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            // This is no longer a simulation!
            callRealMainAI_API(prompt, audioBlob);
        });

        /**
         * !! THIS IS THE REAL API CALL !!
         * This function reads from localStorage (set by your userscript)
         * and sends both the prompt and the audio file.
         */
        function callRealMainAI_API(prompt, audioData) {
            // Get credentials from localStorage
            const apiEndpoint = localStorage.getItem('MAIN_AI_API_ENDPOINT');
            const apiKey = localStorage.getItem('MAIN_AI_API_KEY');

            // Check if keys exist
            if (!apiEndpoint || !apiKey) {
                alert("Error: Main AI API endpoint or key is not set in localStorage.");
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Audio and Prompt';
                return;
            }

            console.log("Calling Main AI API:", apiEndpoint);

            // Use FormData to package the text and audio file
            const formData = new FormData();
            formData.append('prompt', prompt);
            formData.append('audio_file', audioData, 'recording.webm'); // 'audio_file' is the key the server expects

            // --- REAL FETCH CALL ---
            fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    // IMPORTANT: When using FormData, *do not* set 'Content-Type'.
                    // The browser sets it automatically with the correct 'boundary'.
                    'Authorization': 'Bearer ' + apiKey 
                },
                body: formData 
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('AI Response:', data);
                // --- Process your API's specific response ---
                // (e.g., display the transcription, summary, or AI answer)
                feedbackArea.style.display = 'block';
                // This is an example, change 'data.result' to match your API response
                feedbackArea.innerHTML = `<strong>AI Response:</strong> ${data.result || JSON.stringify(data)}`;
            })
            .catch(err => {
                console.error('Error submitting to AI:', err);
                feedbackArea.style.display = 'block';
                feedbackArea.innerHTML = `Error submitting to AI: ${err.message}`;
            })
            .finally(() => {
                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Audio and Prompt';
            });
        }