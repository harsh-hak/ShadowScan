# 🕵️‍♂️ ShadowScan  
**IP Vulnerability & Reconnaissance Scanner**

ShadowScan is a lightweight **Bash-based vulnerability scanner** that automates IP reconnaissance using `nmap`, `whois`, and `nslookup`.  
It identifies open ports, analyzes service versions for potential vulnerabilities, and retrieves WHOIS + DNS data — all in one go.  

---

## 🚀 Features
- 🔍 **Port & Service Scanning** — Uses `nmap` to detect open ports and running service versions.  
- 🧠 **Basic Vulnerability Analysis** — Flags services (like Apache 2.4.x) that might be prone to known exploits.  
- 🌐 **WHOIS Lookup** — Gathers domain registration and ownership info for each IP.  
- 🔎 **DNS Resolution (NSLOOKUP)** — Retrieves associated domain names or host records.  
- 📋 **Clean, Organized Output** — Displays status, vulnerabilities, and lookup results per IP in a structured format.  

---

## 🧰 Prerequisites
Make sure the following tools are installed on your system:

```bash
sudo apt-get install nmap whois dnsutils
```
## ⚙️ Installation

Clone this repository or download the script directly:

```bash
git clone https://github.com/<yourusername>/shadowscan.git
cd shadowscan
chmod +x shadowscan.sh
```
## 🧪 Usage

Run the script followed by one or more IP addresses:
```bash
./shadowscan.sh <IP1> <IP2> ...
```
```bash
./shadowscan.sh 8.8.8.8 1.1.1.1
```
## Example Output
```bash
Scanning IP: 8.8.8.8
Results for IP: 8.8.8.8
Status: No vulnerabilities found
WHOIS Info:
[WHOIS data here]
NSLOOKUP Info: dns.google.
------------------------
```
## ⚠️ Disclaimer
This tool is intended for educational and ethical use only.
Do not scan networks or systems you don’t have explicit permission to test.
The author is not responsible for any misuse or illegal activity.

