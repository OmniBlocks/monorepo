import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = 3000;

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI();

const systemPrompt = `
You are an expert web developer specializing in visual programming environments.
Create a single-file interactive HTML, CSS, and JavaScript block-based programming language named "OmniBlocks".

Requirements:
1. Everything must be self-contained in a single valid HTML file (HTML, CSS in <style>, JS in <script>).
2. UI Layout:
   - Sidebar/Toolbox on the left containing distinct block categories (e.g., Logic, Math, Variables, Actions/Output).
   - Canvas/Workspace on the right where blocks can be dragged and dropped or snapped together.
   - Run/Execute button and an Output/Console panel to see the results of running the block code.
3. Functionality:
   - Allow users to create basic scripts by dragging blocks into the workspace.
   - Blocks should represent simple concepts like "Print [text]", "Set Variable [name] to [value]", "Repeat [N] times", or simple arithmetic.
   - A generator that compiles the arranged workspace blocks into executable JavaScript and runs it inside the browser sandbox, logging output to the built-in console panel.
4. Styling: Modern, clean, and intuitive design (similar to modern visual block editors like Blockly or Scratch).
5. Output strict HTML code only, without markdown code block formatting (no \`\`\`html tags).
`;

app.get('/', async (req, res) => {
    try {
        console.log('Requesting OmniBlocks HTML generation from Gemini...');

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Generate the single-file HTML block-based programming language OmniBlocks following all system specifications.',
            config: {
                systemInstruction: systemPrompt,
            }
        });

        let htmlContent = response.text;

        // Clean up markdown block wrapping if the model includes it
        if (htmlContent.startsWith('```')) {
            htmlContent = htmlContent.replace(/^```(html)?\n/, '').replace(/\n```$/, '');
        }

        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
    } catch (error) {
        console.error('Error generating OmniBlocks:', error);
        res.status(500).send(`<h1>Error generating page</h1><p>${error.message}</p>`);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Visit the URL in your browser to generate and view OmniBlocks.');
});
