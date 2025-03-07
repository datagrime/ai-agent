const INTRO_PROMPT =''
const PROMPT = '> ';
const API_URL = '__API_URL__';

const terminalContainer = document.getElementById('terminal-container');
const { Terminal } = window;
const FitAddon = window.FitAddon?.FitAddon || window.FitAddon;

// Function to check if the device is mobile
function isMobile() {
    return window.innerWidth < 768;
}

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

window.addEventListener('resize', () => fitAddon.fit());

const asciiArt = `
\x1b[29m         __                                     __         
  ____ _/ /__  _  ______ ___  ____ ___  __ ____/ /__ _   __
 / __ \`/ / _ \\| |/_/ __ \`__ \\/ __ \`/ / / // __  / _ \\ | / /
/ /_/ / /  __/>  </ / / / / / /_/ / /_/ // /_/ /  __/ |/ / 
\\__,_/_/\\___/_/|_/_/ /_/ /_/\\__,_/\\__, (_)__,_/\\___/|___/  
                                 /____/                     
                                 
                                                        \x1b[0m`;

// Display ASCII art only on desktop
if (!isMobile()) {
    term.writeln(asciiArt);
}
term.write(PROMPT);

let userInput = '';
let isProcessing = false;

term.onData(async (data) => {
    if (isProcessing) return;

    switch (data) {
        case '\r':
            await handleUserInput();
            break;
        case '\x7F':
            if (userInput.length > 0) {
                userInput = userInput.slice(0, -1);
                term.write('\b \b');
            }
            break;
        case '\x03':
            userInput = '';
            term.write('^C\r\n' + PROMPT);
            break;
        default:
            if (data.charCodeAt(0) >= 32 && data.charCodeAt(0) <= 126) {
                userInput += data;
                term.write(data);
            }
    }
});

async function loadGreeting() {
    term.write('[Model] Initializing...');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: "Respond with this exact response. Hello I'm a GPT-3.5 Turbo-powered AI agent built to assist with Alex’s dev environment. Ask me about Alex’s resume (work experience, skills) or my own architecture (Show agent architecture). Anything else just ask!" }) // Hidden prompt
        });

        term.write("\r\x1b[K"); // Clear the "Initializing..." message

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const { reply } = await response.json();

        // **Simulate typing effect instead of displaying all at once**
        await typeText(reply);

    } catch (error) {
        term.writeln("\r\x1b[K\x1b[31m[Error]\x1b[0m Failed to load greeting.");
    } finally {
        term.write("\r\n" + PROMPT);
    }
}

/**
 * Simulates typing effect by printing text one character at a time.
 * @param {string} text - The text to type out.
 * @param {number} delay - Typing speed in milliseconds (default 50ms).
 */
async function typeText(text, delay = 20) {
    for (const char of text) {
        term.write(char);
        await new Promise(resolve => setTimeout(resolve, delay)); // Simulate typing delay
    }
}


// Load greeting when the terminal initializes
loadGreeting();


async function handleUserInput() {
    const input = userInput.trim();
    userInput = '';

    if (!input) {
        term.write('\r\n' + PROMPT);
        return;
    }

    isProcessing = true;
    term.write(`\r\n[You] ${input}\r\n`);
    term.write('[AI] Thinking...');
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input }),
        });

        term.write("\r\x1b[K");

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const { reply } = await response.json();
        const lines = reply.split('\n');
        
        // Write first line inline with [AI] marker
        term.write(`[AI] ${lines[0] || ''}`);
        
        // Write remaining lines (if any) on new lines
        if (lines.length > 1) {
            term.writeln('');
            lines.slice(1).forEach(line => term.writeln(line));
        }
    } catch (error) {
        term.writeln("\r\x1b[K\x1b[31m[Error]\x1b[0m " + (error.message || "Unable to connect to the AI server."));
    } finally {
        isProcessing = false;
        term.write('\r\n' + PROMPT);
    }
}