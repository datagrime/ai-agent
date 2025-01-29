const PROMPT = '> ';
const API_URL = 'https://ai-agent-uggb.onrender.com/api/chat';

// Initialize terminal
const terminalContainer = document.getElementById('terminal-container');
const { Terminal } = window;
const FitAddon = window.FitAddon?.FitAddon || window.FitAddon;

const term = new Terminal({
    convertEol: true,
    scrollback: 100,
    cursorBlink: true,
    theme: {
        background: '#1e1e1e',
        foreground: '#ffffff',
        cursor: '#ffffff',
    },
});

const fitAddon = new FitAddon();
term.loadAddon(fitAddon);
term.open(terminalContainer);
fitAddon.fit();

// Auto-resize terminal on window resize
window.addEventListener('resize', () => fitAddon.fit());

// Initial welcome message
term.writeln('Hello, welcome to Alex\'s dev environment. How can I help you?');
term.write(PROMPT);

let userInput = '';
let isProcessing = false; // Track ongoing requests

// Efficient text wrapping function
function splitTextIntoLines(text, width) {
    return text.match(new RegExp(`.{1,${width}}`, 'g')) || [text];
}

// Handle user input
term.onData(async (data) => {
    if (isProcessing) return; // Ignore input during processing

    switch (data) {
        case '\r': // Enter key
            await handleUserInput();
            break;

        case '\x7F': // Backspace (DEL)
            if (userInput.length > 0) {
                userInput = userInput.slice(0, -1);
                term.write('\b \b');
            }
            break;

        case '\x03': // Ctrl+C
            userInput = '';
            term.write('^C\r\n' + PROMPT);
            break;

        default:
            if (data.charCodeAt(0) >= 32 && data.charCodeAt(0) <= 126) { // Printable characters
                userInput += data;
                term.write(data);
            }
    }
});

async function handleUserInput() {
    const input = userInput.trim();
    userInput = '';

    if (!input) {
        term.write('\r\n' + PROMPT);
        return;
    }

    isProcessing = true;
    term.write('\r\n\x1b[32m[You]\x1b[0m ' + input + '\r\n');

    try {
        // Show typing indicator
        const typingIndicator = term.write('\x1b[33m[AI] Thinking...\x1b[0m');

        // Fetch AI response
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input }),
        });

        term.write('\b'.repeat(14)); // Remove typing indicator

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const { reply } = await response.json();
        splitTextIntoLines(reply, term.cols).forEach((line) => term.writeln('\x1b[33m[AI]\x1b[0m ' + line));
    } catch (error) {
        term.writeln('\x1b[31m[Error]\x1b[0m ' + (error.message || 'Unable to connect to the AI server.'));
    } finally {
        isProcessing = false;
        term.write(PROMPT);
    }
}