/**
 * ShadowScan Frontend Logic
 * Version: 1.2.5
 * Author: Harsh Kanojia / Overhauled by Antigravity
 * 
 * Handles terminal typing simulations, scroll reveal animations,
 * and interactive UI components like copy-to-clipboard.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /**
     * Initializes Lucide icons across the document.
     * Can be called whenever new elements are added dynamically.
     */
    const initIcons = () => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    };
    initIcons();

    /**
     * Intersection Observer for Reveal Animations.
     * Triggers the 'active' class on elements when they enter the viewport.
     */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    /**
     * Class representing a specialized Terminal interface.
     * Manages typewriter-style text rendering and progress simulations.
     */
    class Terminal {
        /**
         * @param {string} elementId - The ID of the container element.
         */
        constructor(elementId) {
            this.container = document.getElementById(elementId);
            this.isTyping = false;
        }

        /**
         * Sequentially renders a list of commands/logs.
         * @param {Array<Object>} lines - Array of line objects {text, class, type, delay}.
         */
        async type(lines) {
            if (this.isTyping) return;
            this.isTyping = true;
            this.container.innerHTML = '';

            for (const line of lines) {
                const lineDiv = document.createElement('div');
                lineDiv.className = line.class || '';
                lineDiv.style.marginBottom = '6px';
                this.container.appendChild(lineDiv);

                if (line.type === 'progress') {
                    await this.animateProgress(lineDiv, line.text);
                } else {
                    await this.typeString(lineDiv, line.text);
                }
                
                // Ensure the terminal always shows the latest output
                this.container.scrollTop = this.container.scrollHeight;
                await new Promise(resolve => setTimeout(resolve, line.delay || 300));
            }
            this.isTyping = false;
        }

        /**
         * Animates a single string character by character.
         * @private
         */
        typeString(element, text) {
            return new Promise(resolve => {
                let i = 0;
                const interval = setInterval(() => {
                    element.textContent += text[i];
                    i++;
                    if (i === text.length) {
                        clearInterval(interval);
                        resolve();
                    }
                }, Math.random() * 30 + 10);
            });
        }

        /**
         * Animates a CLI-style progress bar.
         * @private
         */
        animateProgress(element, label) {
            return new Promise(resolve => {
                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.floor(Math.random() * 15);
                    if (progress > 100) progress = 100;
                    
                    const bars = Math.floor(progress / 5);
                    const barStr = '█'.repeat(bars) + '░'.repeat(20 - bars);
                    element.textContent = `${label} [${barStr}] ${progress}%`;
                    
                    if (progress === 100) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        }
    }

    // Initialize Main Hero Terminal
    const mainTerminal = new Terminal('typewriter');
    const initialLines = [
        { text: '$ shadowscan --stealth target.infra', class: 'cmd-prompt' },
        { text: '[*] Initializing Shadow Engine v1.2.5...', class: 'cmd-info' },
        { text: '[*] Mapping network topography...', class: 'cmd-info', type: 'progress' },
        { text: '[+] Bypass successful: Cloud Armor WAF detected.', class: 'cmd-success' },
        { text: '[*] Enumerating subdomains via async pool...', class: 'cmd-info' },
        { text: '[+] core.target.infra (200 OK)', class: 'cmd-success' },
        { text: '[+] vault.target.infra (403 Forbidden)', class: 'cmd-warning' },
        { text: '[+] dev-api.target.infra (200 OK)', class: 'cmd-success' },
        { text: '[*] Scan complete. 18 endpoints identified.', class: 'cmd-info', delay: 1000 },
        { text: '$ _', class: 'cmd-prompt' }
    ];

    // Trigger initial animation
    if (mainTerminal.container) {
        mainTerminal.type(initialLines);
    }

    /**
     * Start Mock Scan Trigger.
     * Linked to the "Start Mock Scan" button in the hero section.
     */
    const startScanBtn = document.querySelector('a[href="#demo"]');
    if (startScanBtn) {
        startScanBtn.addEventListener('click', (e) => {
            // Restart terminal animation for visual feedback
            setTimeout(() => mainTerminal.type(initialLines), 800);
        });
    }

    /**
     * Copy to Clipboard Functionality.
     * Provides visual feedback via icon change and color pulse.
     */
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const codeText = "git clone https://github.com/harsh-hak/ShadowScan";
            try {
                await navigator.clipboard.writeText(codeText);
                
                const icon = copyBtn.querySelector('i');
                const originalIcon = icon.getAttribute('data-lucide');
                
                // Success State feedback
                icon.setAttribute('data-lucide', 'check-circle');
                initIcons();
                copyBtn.style.color = 'var(--primary)';

                setTimeout(() => {
                    // Revert to original state
                    icon.setAttribute('data-lucide', originalIcon);
                    initIcons();
                    copyBtn.style.color = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });
    }
});
