# QuickieBot – AI Study Assistant

## Project Overview
QuickieBot is an AI-powered chatbot designed to help students learn faster by summarizing and simplifying study materials. Users can upload study modules — including math, engineering, science, or any education-related content — and QuickieBot generates easy-to-understand summaries and explanations. This helps make learning more efficient and accessible.

##  SDG and Target Challenges
Our project supports **Sustainable Development Goal (SDG) 4: Quality Education**, which aims to ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.  

QuickieBot addresses the following target challenges:  
- **SDG 4:** Improving access to simplified and structured educational content.  
- **SDG 3 & 4:** Supporting mental health and well-being by reducing study stress and improving comprehension through concise summaries.  

## Tech Stack
QuickieBot is built with the following core technologies:  
- **Google Gemini API** – For generative AI text summarization and natural language understanding.  
- **React.js** – For building an interactive and responsive frontend chat interface.  
- **Flask** – For creating a backend API to handle requests, manage file uploads, and connect to Google Gemini.  

##  Architecture
The QuickieBot system follows a simple but effective architecture:  

1. **Frontend (React.js)**
   - Users interact with a chat interface.
   - Files containing study modules can be uploaded directly via the chat box.
   - User messages and files are sent to the backend.

2. **Backend (Flask)**
   - Receives user input and file uploads.
   - Processes uploaded documents, extracting text content.
   - Sends the extracted text and user prompts to the **Google Gemini API** for summarization and simplification.

3. **Google Gemini API**
   - Uses generative AI to process text.
   - Returns concise, easy-to-understand summaries and explanations.

4. **Response Handling**
   - Flask returns the AI-generated summary to the frontend.
   - The chat interface displays the result for the user.

This data flow ensures a seamless experience where users can upload and receive simplified study material quickly and efficiently.

##  Biggest Challenge
The biggest technical hurdle we faced was **ensuring smooth communication between the server (Flask) and the client (React.js)** while integrating the Google Gemini API. We needed to make sure file uploads worked correctly, the extracted text was processed properly, and the AI prompt yielded high-quality summaries.

**Solution:**  
We solved this by:  
- Testing different file upload handling methods in Flask.  
- Structuring API routes clearly for file processing and message handling.  
- Iterating on prompt designs for Google Gemini to improve summarization accuracy.  

This process improved stability and performance and gave QuickieBot reliable summarization results.

## Future Improvements
- Add multi-language support.  
- Implement voice-to-text summarization.  
- Improve document parsing for diagrams, formulas, and non-text elements.  

## Conclusion
QuickieBot demonstrates how AI can transform education by making study materials simpler and more accessible. By aligning with **SDG 4**, it supports inclusive learning while leveraging cutting-edge generative AI, React.js, and Flask technologies to deliver a powerful study assistant.
