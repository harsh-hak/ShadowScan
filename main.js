// main.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Typewriter Effect for Terminal
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const lines = [
            { text: '$ shadowscan -d example.com', class: 'cmd-prompt' },
            { text: '[*] Initializing ShadowScan v1.2.0...', class: 'cmd-info' },
            { text: '[*] Loading wordlist: massive.txt (1.2M entries)', class: 'cmd-info' },
            { text: '[*] Starting stealth scan with 50 threads...', class: 'cmd-info' },
            { text: '[+] Found: api.example.com (200 OK)', class: 'cmd-success' },
            { text: '[+] Found: dev.example.com (403 Forbidden)', class: 'cmd-success' },
            { text: '[+] Found: staging.example.com (200 OK)', class: 'cmd-success' },
            { text: '[+] Found: vpn.example.com (200 OK)', class: 'cmd-success' },
            { text: '[+] Found: mail.example.com (200 OK)', class: 'cmd-success' },
            { text: '[*] Scan complete. 12 subdomains discovered.', class: 'cmd-info' },
            { text: '[*] Results saved to shadow_results.json', class: 'cmd-info' },
            { text: '$ _', class: 'cmd-prompt' }
        ];

        let lineIndex = 0;
        let charIndex = 0;

        function typeLine() {
            if (lineIndex < lines.length) {
                const currentLine = lines[lineIndex];
                
                // Create line container if it doesn't exist
                let lineDiv = typewriterElement.lastElementChild;
                if (!lineDiv || lineDiv.dataset.lineIndex !== lineIndex.toString()) {
                    lineDiv = document.createElement('div');
                    lineDiv.className = currentLine.class || '';
                    lineDiv.dataset.lineIndex = lineIndex;
                    lineDiv.style.marginBottom = '4px';
                    typewriterElement.appendChild(lineDiv);
                }

                if (charIndex < currentLine.text.length) {
                    lineDiv.textContent += currentLine.text.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeLine, Math.random() * 50 + 20);
                } else {
                    lineIndex++;
                    charIndex = 0;
                    setTimeout(typeLine, 500);
                }
            }
        }

        typeLine();
    }

    // 3. Copy to Clipboard Functionality
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const codeText = "git clone https://github.com/harsh-hak/ShadowScan";
            try {
                await navigator.clipboard.writeText(codeText);
                
                // Visual feedback
                const icon = copyBtn.querySelector('i');
                const originalIcon = icon.getAttribute('data-lucide');
                
                icon.setAttribute('data-lucide', 'check');
                lucide.createIcons();
                copyBtn.style.color = '#0df20d';

                setTimeout(() => {
                    icon.setAttribute('data-lucide', originalIcon);
                    lucide.createIcons();
                    copyBtn.style.color = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        });
    }

    // 4. Smooth Scrolling for Nav Links (Optional enhancement, already in CSS)
});
