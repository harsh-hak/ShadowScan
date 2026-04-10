#!/bin/bash

# ==============================================================================
#  ShadowScan Premium CLI Core
# ==============================================================================
# Description: High-performance IP reconnaissance and vulnerability scanner.
# Version:     1.2.5
# Author:      Harsh Kanojia / Overhauled by Antigravity
# License:     MIT (Ethical Use Only)
# ==============================================================================
# Requirements:
#   - nmap (Port Scanning & Service Versioning)
#   - whois (Ownership & Registration Data)
#   - dnsutils (NSLOOKUP / DNS Resolution)
# ==============================================================================

# --- COLOR DEFINITIONS (ANSI) ---
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# --- UI COMPONENTS ---

/**
 * Display the main ShadowScan banner.
 */
show_banner() {
    echo -e "${CYAN}${BOLD}"
    echo "  ██████  ██   ██  █████  ██████   ██████  ██     ██ ██████   ██████  █████  ███    ██ "
    echo "  ██      ██   ██ ██   ██ ██   ██ ██    ██ ██     ██ ██   ██ ██      ██   ██ ████   ██ "
    echo "  ██████  ███████ ███████ ██   ██ ██    ██ ██  █  ██ ██████  ██      ███████ ██ ██  ██ "
    echo "       ██ ██   ██ ██   ██ ██   ██ ██    ██ ██ ███ ██ ██   ██ ██      ██   ██ ██  ██ ██ "
    echo "  ██████  ██   ██ ██   ██ ██████   ██████   ███ ███  ██   ██  ██████ ██   ██ ██   ████ "
    echo -e "                                                                    ${GREEN}v1.2.5${NC}"
    echo -e "${PURPLE}  > Premium Reconnaissance & Vulnerability Core${NC}"
    echo -e "--------------------------------------------------------------------------------"
}

/**
 * Check if required binary dependencies are installed.
 * Exits if any core dependency is missing.
 */
check_deps() {
    local deps=("nmap" "whois" "nslookup")
    echo -ne "${CYAN}[*] Validating core subsystems... ${NC}"
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            echo -e "${RED}FAILED${NC}"
            echo -e "${RED}[!] Error: '$dep' is not installed.${NC}"
            echo -e "${YELLOW}[i] Run: sudo apt-get install nmap whois dnsutils${NC}"
            exit 1
        fi
    done
    echo -e "${GREEN}READY${NC}"
}

/**
 * Simple command-line spinner for asynchronous feedback.
 * @param progress_pid - PID of the process to monitor.
 */
spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

# --- CORE LOGIC ---

/**
 * Perform an Nmap scan with service version detection.
 * Stores raw output in a temporary file.
 * @param ip - Target IP address.
 */
scan_ip() {
    local ip=$1
    echo -ne "${CYAN}[*] Initializing deep scan for ${BOLD}$ip${NC}... "
    # Run nmap in background for spinner
    nmap -sV "$ip" &> ".scan_$ip.tmp" &
    local nmap_pid=$!
    spinner $nmap_pid
    echo -e "${GREEN}DONE${NC}"
}

/**
 * Parse scan data and flag known vulnerabilities or risk surfaces.
 * @param ip - Target IP address.
 */
analyze_vulnerabilities() {
    local ip=$1
    local vulnerabilities=()
    
    # Read temporary scan results
    while IFS= read -r line; do
        if echo "$line" | grep -q "open"; then
            port=$(echo "$line" | awk '{print $1}')
            service=$(echo "$line" | awk '{print $3}')
            version=$(echo "$line" | awk '{print $4}')
            
            # --- SIGNATURE ENGINE ---
            # Flag vulnerable Apache versions
            if [[ $service == "Apache" && $version == 2.4* ]]; then
                vulnerabilities+=("${YELLOW}[!] Potential Exploit: Apache 2.4.x detected on $port${NC}")
            fi
            # Flag exposed legacy services
            if [[ $port == "21/tcp" ]]; then
                vulnerabilities+=("${YELLOW}[!] Risk: FTP Service exposed on $port (Cleartext vulnerability)${NC}")
            fi
        fi
    done < <(grep '/tcp' ".scan_$ip.tmp")
    
    # Output analysis results
    if [ ${#vulnerabilities[@]} -eq 0 ]; then
        echo -e "${GREEN}[+] Status: Clean. No obvious vulnerabilities detected.${NC}"
    else
        echo -e "${RED}[!] Status: Potential Risks Identified!${NC}"
        for v in "${vulnerabilities[@]}"; do
            echo -e "    $v"
        done
    fi
}

/**
 * Executes a simulated scan session with all UI elements.
 * Used for previews and testing when dependencies are missing.
 */
run_demo() {
    show_banner
    echo -e "${CYAN}[*] Validating core subsystems... ${GREEN}READY (DEMO MODE)${NC}"
    
    local targets=("8.8.8.8" "1.1.1.1")
    for ip in "${targets[@]}"; do
        echo -e "\n${BOLD}${PURPLE}>>> TARGET: $ip${NC}"
        echo -ne "${CYAN}[*] Initializing deep scan for ${BOLD}$ip${NC}... "
        sleep 2 &
        spinner $!
        echo -e "${GREEN}DONE${NC}"
        
        echo -e "${RED}[!] Status: Potential Risks Identified!${NC}"
        echo -e "    ${YELLOW}[!] Potential Exploit: Apache 2.4.x detected on 80/tcp${NC}"
        
        echo -ne "${CYAN}[*] Fetching WHOIS & DNS records... ${NC}"
        sleep 1
        echo -e "${GREEN}OK${NC}"
        
        echo -e "\n${BOLD}RECON SUMMARY${NC}"
        echo -e "${CYAN}DNS:${NC} dns.google"
        echo -e "${CYAN}WHOIS:${NC}"
        echo "  OrgName: Google LLC"
        echo "  Country: US"
        echo -e "${CYAN}--------------------------------------------------------------------------------${NC}"
    done
    exit 0
}

# --- MAIN EXECUTION ---

main() {
    show_banner
    check_deps
    
    for ip in "$@"; do
        echo -e "\n${BOLD}${PURPLE}>>> TARGET: $ip${NC}"
        
        # 1. Port Scan & Service Identification
        scan_ip "$ip"
        
        # 2. Risk Analysis Profile
        analyze_vulnerabilities "$ip"
        
        # 3. Intelligent Recon gathering
        echo -ne "${CYAN}[*] Fetching WHOIS & DNS records... ${NC}"
        whois_data=$(whois "$ip" | grep -E "OrgName|NetName|Country" | head -n 3)
        dns_data=$(nslookup "$ip" | awk '/name =/ {print $4}')
        echo -e "${GREEN}OK${NC}"
        
        # 4. Final Recon Report
        echo -e "\n${BOLD}RECON SUMMARY${NC}"
        echo -e "${CYAN}DNS:${NC} ${dns_data:-"N/A"}"
        echo -e "${CYAN}WHOIS:${NC}"
        if [ -n "$whois_data" ]; then
            echo "$whois_data" | sed 's/^/  /'
        else
            echo "  N/A"
        fi
        
        # Temporary file cleanup
        rm -f ".scan_$ip.tmp"
        echo -e "${CYAN}--------------------------------------------------------------------------------${NC}"
    done
}

# --- ENTRY POINT ---

# Flag handling
if [[ "$1" == "--demo" ]]; then
    run_demo
fi

# Usage guide if no arguments provided
if [ $# -eq 0 ]; then
    show_banner
    echo -e "${RED}Usage: $0 <IP1> <IP2> ...${NC}"
    echo -e "${YELLOW}Tip: Use $0 --demo to see the premium UI in action without dependencies.${NC}"
    exit 1
fi

# Pass arguments to main loop
main "$@"
