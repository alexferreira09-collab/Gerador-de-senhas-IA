let history = [];
let isDark = true;

const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lower = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const similar = '1lIoO0';

function getRandomChar(str) {
    return str[Math.floor(Math.random() * str.length)];
}

function shuffle(str) {
    return str.split('').sort(() => Math.random() - 0.5).join('');
}

function generatePassword() {
    const length = parseInt(document.getElementById('length').value);
    const useUpper = document.getElementById('uppercase').checked;
    const useLower = document.getElementById('lowercase').checked;
    const useNum = document.getElementById('numbers').checked;
    const useSym = document.getElementById('symbols').checked;
    const avoidSimilar = document.getElementById('avoid-similar').checked;

    let chars = '';
    let password = '';

    if (useUpper) chars += upper;
    if (useLower) chars += lower;
    if (useNum) chars += numbers;
    if (useSym) chars += symbols;

    if (chars === '') {
        alert("Selecione pelo menos um tipo de caractere!");
        return;
    }

    // Garantir variedade
    if (useUpper) password += getRandomChar(upper);
    if (useLower) password += getRandomChar(lower);
    if (useNum) password += getRandomChar(numbers);
    if (useSym) password += getRandomChar(symbols);

    // Gerar resto
    for (let i = password.length; i < length; i++) {
        let char = getRandomChar(chars);
        if (avoidSimilar && similar.includes(char)) {
            i--;
            continue;
        }
        password += char;
    }

    password = shuffle(password);
    document.getElementById('password').textContent = password;

    evaluateStrength(password);
    addToHistory(password);
}

function evaluateStrength(password) {
    let score = 0;
    const length = password.length;

    if (length >= 16) score += 2;
    else if (length >= 12) score += 1;

    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const entropy = Math.floor(length * Math.log2(95)); // Estimativa

    const bar = document.getElementById('strength-bar');
    const text = document.getElementById('strength-text');
    const entropyEl = document.getElementById('entropy');

    entropyEl.textContent = `${entropy} bits`;

    if (score >= 6) {
        bar.style.width = '100%';
        bar.style.background = 'linear-gradient(to right, #10b981, #34d399)';
        text.textContent = 'EXCELENTE';
        text.style.color = '#34d399';
    } else if (score >= 5) {
        bar.style.width = '85%';
        bar.style.background = 'linear-gradient(to right, #84cc16, #a3e635)';
        text.textContent = 'MUITO FORTE';
        text.style.color = '#a3e635';
    } else if (score >= 4) {
        bar.style.width = '65%';
        bar.style.background = 'linear-gradient(to right, #eab308, #facc15)';
        text.textContent = 'FORTE';
        text.style.color = '#facc15';
    } else {
        bar.style.width = '45%';
        bar.style.background = 'linear-gradient(to right, #f59e0b, #fb923c)';
        text.textContent = 'MÉDIA';
        text.style.color = '#fb923c';
    }
}

function generateMultiple() {
    const container = document.getElementById('history');
    container.innerHTML = '<p class="text-emerald-400 text-center py-4">Gerando 5 senhas...</p>';
    
    setTimeout(() => {
        for (let i = 0; i < 5; i++) {
            generatePassword();
        }
    }, 300);
}

function updateLength(value) {
    document.getElementById('length-value').textContent = value;
}

function copyPassword() {
    const pass = document.getElementById('password').textContent;
    if (!pass) return;

    navigator.clipboard.writeText(pass).then(() => {
        const btn = document.getElementById('copy-btn');
        const original = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-check"></i> Copiado!`;
        btn.style.backgroundColor = '#10b981';
        
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.backgroundColor = '';
        }, 2000);
    });
}

function addToHistory(password) {
    history.unshift({ pass: password, time: Date.now() });
    if (history.length > 10) history.pop();
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('history');
    container.innerHTML = '';

    history.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = "glass border border-zinc-700 hover:border-emerald-500/50 rounded-2xl p-5 flex items-center justify-between group cursor-pointer transition-all";
        div.innerHTML = `
            <div class="font-mono text-lg">${item.pass}</div>
            <button onclick="copyFromHistory(${i}); event.stopImmediatePropagation()" 
                    class="opacity-0 group-hover:opacity-100 px-5 py-2 text-sm border border-emerald-500/30 hover:bg-emerald-900 rounded-xl transition-all">
                Copiar
            </button>
        `;
        div.onclick = () => {
            document.getElementById('password').textContent = item.pass;
            evaluateStrength(item.pass);
        };
        container.appendChild(div);
    });
}

function copyFromHistory(i) {
    navigator.clipboard.writeText(history[i].pass);
}

function clearHistory() {
    if (confirm("Limpar todo o histórico?")) {
        history = [];
        renderHistory();
    }
}

function toggleTheme() {
    // Por enquanto mantemos dark (melhor para cyber)
    alert("Tema escuro ativado (melhor experiência)");
}

// Inicialização
window.onload = () => {
    document.getElementById('password').textContent = "Clique em Gerar";
    setTimeout(() => generatePassword(), 400);
};

document.addEventListener('keydown', e => {
    if (e.key === "Enter") generatePassword();
});