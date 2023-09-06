// Create an initial file system
const fileSystem = {
    '/': {
        'home': {
            'user': {},
        },
        'var': {},
        'etc': {}
    }
};

let currentDirectory = fileSystem['/'];

// Helper functions
const resolvePath = (path, baseDir) => {
    const parts = path.split('/').filter(Boolean);
    let dir = baseDir;
    for (let part of parts) {
        if (!dir[part]) return null;
        dir = dir[part];
    }
    return dir;
};

// Command handlers
const commands = {
    pwd: () => {
        return "/"; // Assuming the root for this example
    },
    ls: (path = '/') => {
        const dir = resolvePath(path, currentDirectory);
        if (!dir) return `ls: cannot access '${path}': No such file or directory`;
        return Object.keys(dir).join(' ');
    },
    cd: (path) => {
        const newDir = resolvePath(path, currentDirectory);
        if (!newDir) return `cd: no such file or directory: ${path}`;
        currentDirectory = newDir;
        return '';
    },
    mkdir: (name) => {
        if (currentDirectory[name]) return `mkdir: cannot create directory '${name}': File exists`;
        currentDirectory[name] = {};
        return '';
    },
    clear: () => {
        const terminalOutput = document.querySelector('.terminal-output');
        terminalOutput.innerHTML = '';
        return '';  // No output for the 'clear' command
    },
    // More commands can be added here
};

const executeCommand = (commandString) => {
    const terminalOutput = document.querySelector('.terminal-output');

    if (commandString.trim() === '') {
        appendNewCommandLine(terminalOutput, commandString, '');
        return;
    }

    const [command, ...args] = commandString.split(' ');
    let result;
    if (commands[command]) {
        result = commands[command](...args);
    } else {
        result = `bash: ${command}: command not found`;
    }

    appendNewCommandLine(terminalOutput, commandString, result);
};

const appendNewCommandLine = (terminalOutput, commandString, result) => {
    // Create a new line div
    const newCommandLine = document.createElement('div');
    newCommandLine.className = "command-line";

    // Add the prompt
    const prompt = document.createElement('span');
    prompt.className = "prompt";
    prompt.textContent = "user@linux-terminal:~$";
    newCommandLine.appendChild(prompt);

    // Add the input
    const input = document.createElement('span');
    input.textContent = '  ' + commandString;  // Add two spaces before the command
    newCommandLine.appendChild(input);

    // Add the output
    const output = document.createElement('div');
    output.textContent = result;
    newCommandLine.appendChild(output);

    // Append new line to terminal output
    terminalOutput.appendChild(newCommandLine);

    // Clear the input
    document.querySelector('.commandInput').value = '';
};

document.addEventListener('DOMContentLoaded', () => {
    const terminalOutput = document.querySelector('#terminal');
    const commandInput = document.querySelector('.commandInput');

    commandInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const commandString = commandInput.value;
            executeCommand(commandString);
        }
    });
});
