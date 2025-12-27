// Lemonade Stand Web Demo
// Core semantics: price=5, bills in {5,10,20,50}.
// Change is made strictly from existing register before adding the incoming bill.
// Greedy largest-first (20 -> 10 -> 5) ensures 10+5 over 5+5+5 for 15, and uses only one 5 when making 45.
// Preserving $5 bills is crucial: without them, no future change is possible.

const PRICE = 5;
const ALLOWED = new Set([5, 10, 20, 50]);

// Utilities
function cloneRegister(r) { return { 5: r[5], 10: r[10], 20: r[20], 50: r[50] }; }
function emptyRegister() { return { 5: 0, 10: 0, 20: 0, 50: 0 }; }

// Make change using largest-first greedy order
function makeChangeGreedy(changeDue, reg) {
  if (changeDue === 0) return [];
  const work = cloneRegister(reg);
  const given = [];
  let remaining = changeDue;
  const order = [20, 10, 5];
  for (const bill of order) {
    while (remaining >= bill && work[bill] > 0) {
      remaining -= bill;
      work[bill] -= 1;
      given.push(bill);
    }
  }
  return remaining === 0 ? given : null;
}

// --- UI State and Controls ---
const els = {
  payments: document.getElementById('payments'),
  statusText: document.getElementById('status'),
  result: document.getElementById('result'),
  failIndex: document.getElementById('failIndex'),
  failPayment: document.getElementById('failPayment'),
  pointer: document.getElementById('pointer'),
  currentPay: document.getElementById('currentPay'),
  changeDue: document.getElementById('changeDue'),
  billsGiven: document.getElementById('billsGiven'),
  log: document.getElementById('log'),
  counts: {
    5: document.getElementById('c5'),
    10: document.getElementById('c10'),
    20: document.getElementById('c20'),
    50: document.getElementById('c50'),
  },
  buttons: {
    reset: document.getElementById('resetBtn'),
    step: document.getElementById('stepBtn'),
    run: document.getElementById('runBtn'),
    demoA: document.getElementById('demoA'),
    demoB: document.getElementById('demoB'),
    demoC: document.getElementById('demoC'),
  }
};

let uiPayments = [];
let uiPointer = 0; // 0-based internal; show 1-based to user
let uiHalted = false;
let uiRegister = emptyRegister();

function parseInput() {
  const raw = els.payments.value.split(',').map(s => s.trim()).filter(Boolean);
  if (raw.length === 0) return null;
  const parsed = [];
  for (const token of raw) {
    const num = Number(token);
    if (!ALLOWED.has(num)) return null;
    parsed.push(num);
  }
  return parsed;
}

function setStatus(text, tone = 'neutral') {
  els.statusText.textContent = text;
  els.statusText.className = 'status' + (tone === 'good' ? ' good' : tone === 'bad' ? ' bad' : '');
}

function writeLogEntry(step) {
  const after = step.registerAfter;
  const billsStr = step.billsGiven ? `[${step.billsGiven.join(',')}]` : '[]';
  const line = `#${step.i} | pay=${step.pay} | due=${step.changeDue} | give=${billsStr} | reg(after)=5:${after[5]} 10:${after[10]} 20:${after[20]} 50:${after[50]}`;
  const div = document.createElement('div');
  div.className = 'log-entry';
  if (!step.billsGiven) div.classList.add('danger'); else div.classList.add('muted');
  div.textContent = line;
  els.log.appendChild(div);
  els.log.scrollTop = els.log.scrollHeight;
}

function updateRegisterUI() {
  els.counts[5].textContent = uiRegister[5];
  els.counts[10].textContent = uiRegister[10];
  els.counts[20].textContent = uiRegister[20];
  els.counts[50].textContent = uiRegister[50];
}

function updateCurrentUI(step) {
  els.pointer.textContent = uiPointer + 1;
  els.currentPay.textContent = step ? step.pay : '-';
  els.changeDue.textContent = step ? step.changeDue : '-';
  els.billsGiven.textContent = step && step.billsGiven ? step.billsGiven.join(',') : '-';
  updateRegisterUI();
}

// Process a single payment against current UI state, producing a trace step
function processPaymentStep(pay) {
  const i1 = uiPointer + 1;
  const before = cloneRegister(uiRegister);
  const changeDue = pay - PRICE;
  const billsGiven = makeChangeGreedy(changeDue, uiRegister);
  if (billsGiven === null) {
    return { ok: false, step: { i: i1, pay, changeDue, billsGiven: null, registerBefore: before, registerAfter: before } };
  }
  for (const b of billsGiven) uiRegister[b] -= 1; // give change
  uiRegister[pay] += 1; // accept payment after change
  const after = cloneRegister(uiRegister);
  return { ok: true, step: { i: i1, pay, changeDue, billsGiven, registerBefore: before, registerAfter: after } };
}

function resetUI() {
  const parsed = parseInput();
  if (!parsed) {
    setStatus('Invalid input: use 5,10,20,50', 'bad');
    els.result.textContent = '-';
    els.failIndex.textContent = '-';
    els.failPayment.textContent = '-';
    uiPayments = [];
    uiPointer = 0;
    uiHalted = true;
    uiRegister = emptyRegister();
    els.log.innerHTML = '';
    updateCurrentUI(null);
    return;
  }
  uiPayments = parsed;
  uiPointer = 0;
  uiHalted = false;
  uiRegister = emptyRegister();
  els.log.innerHTML = '';
  setStatus('Ready');
  els.result.textContent = '-';
  els.failIndex.textContent = '-';
  els.failPayment.textContent = '-';
  updateCurrentUI(null);
}

function stepUI() {
  if (uiHalted) return;
  if (uiPointer >= uiPayments.length) {
    setStatus('All customers served', 'good');
    els.result.textContent = 'PASS';
    return;
  }
  const pay = uiPayments[uiPointer];
  const { ok, step } = processPaymentStep(pay);
  writeLogEntry(step);
  if (!ok) {
    uiHalted = true;
    setStatus(`FAIL at customer ${step.i}`, 'bad');
    els.result.textContent = 'FAIL';
    els.failIndex.textContent = String(step.i);
    els.failPayment.textContent = String(pay);
    updateCurrentUI(step);
    return;
  }
  uiPointer += 1;
  updateCurrentUI(step);
  if (uiPointer === uiPayments.length) {
    uiHalted = true;
    setStatus('PASS - everyone served', 'good');
    els.result.textContent = 'PASS';
  }
}

function runUI() {
  while (!uiHalted && uiPointer < uiPayments.length) {
    stepUI();
  }
}

// Demo presets
function loadDemoA() { els.payments.value = '5,5,5,10,20,10'; resetUI(); }
function loadDemoB() { els.payments.value = '10'; resetUI(); }
function loadDemoC() { els.payments.value = '5,5,5,10,5,10,20,5,10,50'; resetUI(); }

// Wire events
els.buttons.reset.onclick = resetUI;
els.buttons.step.onclick = () => stepUI();
els.buttons.run.onclick = () => runUI();
els.buttons.demoA.onclick = () => loadDemoA();
els.buttons.demoB.onclick = () => loadDemoB();
els.buttons.demoC.onclick = () => loadDemoC();

// Initialize
resetUI();
