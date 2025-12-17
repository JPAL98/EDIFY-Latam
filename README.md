<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/16vU3w74C_kOtcfpDtRXxaZOf9h6VD2cG

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

**Video Link**

https://notredame.zoom.us/rec/share/FcWBr_sutTThYfxb5h_CEDQhruVxT1lMvX8bEp92bOX0ZfK4ouhU7zVsNBmJY3qr.F2J0oCEUdIPNI1_x?from=hub

**Finalized PRD**

Overview & Goal
The goal is for the AI to give you recommendations, also as a downloadable PDF, on the best way possible to maximize the school resources in order to integrate Education technology in Christ-centered schools in Latin America, based on which country’s national curricula the school is based.

Core Feature (Implemented)
The AI is working great, however, I will need people related to Edify (my capstone, and the people I am building this to) to check this prototype and see what else I need to add for the AI to do and what features should we add also.

AI Specification
The AI takes in:

The user’s learning objectives
The school’s resources (this includes computers, laptops, number of teachers and number of children)
The Country’s national curriculum provided by the Ministry of Education.
And the AI returns recommendations to maximize the usage of the school’s resources as well as a way to integrate Education Technology in the teachings.

The AI feature is Gemini´s Intelligence.

Technical Architecture
Frontend - JS

Backend - Node.js server

Gemini API/Google AI Studio.

Prompting Strategy & Iteration Log
The most important prompts I gave was:

“Help me make a website where schools will give you their resources, learning objectives, and the national curricula and you will give me recommendations to maximize its resources and give me recommendations on how to implement Education Technology.”

Another important prompt: “Make two text boxes where the user will give you its learning objectives, and in the other one, the resources. Give me a displaylist of the countries of: Peru, Panama, Bolivia, Republica Dominicana, Ecuador, El Salvador, Guatemala and use each country’s national curricula to base your recommendations.”

My last iterations consisted in adding the “Download PDF” feature. Previously you could download a .cvs file, but when I changed it to PDF, somehow it got rid of everything and turned the page white, so I asked Google AI Studio to go back but just change the PDF while everything else remains the same.

I had this problem in previous iterations, and what I learned is to tell the AI that everything else remains the same.

UX & Design Notes
When the computer is in dark mode, so are the two “text box”, and the letters are also black, which makes what you are typing unreadable, while everything remains white.

The same thing happens after you hit “Download PDF” and you input the school's information.

Next Steps
The next step is to test this version of the AI with Edify’s next interviewees to see what can be added or what can be better.
