// ===== State =====
let transactions = JSON.parse(localStorage.getItem('et_transactions')) || [];
let currentType = 'income';

// ===== DOM References =====
const form          = document.getElementById('transactionForm');
const descInput     = document.getElementById('description');
const amtInput      = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput     = document.getElementById('date');
const submitBtn     = document.getElementById('submitBtn');
const incomeBtn     = document.getElementById('incomeBtn');
const expenseBtn    = document.getElementById('expenseBtn');
const txList        = document.getElementById('transactionList');
const emptyState    = document.getElementById('emptyState');
const exportBtn     = document.getElementById('exportBtn');
const clearAllBtn   = document.getElementById('clearAllBtn');
const filterCat     = document.getElementById('filterCategory');
const filterType    = document.getElementById('filterType');
const totalBalance  = document.getElementById('totalBalance');
const totalIncome   = document.getElementById('totalIncome');
const totalExpense  = document.getElementById('totalExpense');
const toast         = document.getElementById('toast');

// ===== Helpers =====
function saveData() {
  localStorage.setItem('et_transactions', JSON.stringify(transactions));
}

function formatINR(amount) {
  return '₹' + Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function showToast(message, duration = 2800) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ===== Type Toggle =====
incomeBtn.addEventListener('click', () => setType('income'));
expenseBtn.addEventListener('click', () => setType('expense'));

function setType(type) {
  currentType = type;
  if (type === 'income') {
    incomeBtn.className = 'toggle-btn active-income';
    expenseBtn.className = 'toggle-btn';
    submitBtn.textContent = 'Add Income';
  } else {
    expenseBtn.className = 'toggle-btn active-expense';
    incomeBtn.className = 'toggle-btn';
    submitBtn.textContent = 'Add Expense';
  }
}

// ===== Live Validation (clear errors as user types) =====
descInput.addEventListener('input', () => {
  if (descInput.value.trim()) {
    descInput.classList.remove('invalid');
    document.getElementById('descError').classList.remove('visible');
  }
});

amtInput.addEventListener('input', () => {
  const v = parseFloat(amtInput.value);
  if (amtInput.value && !isNaN(v) && v > 0) {
    amtInput.classList.remove('invalid');
    document.getElementById('amtError').classList.remove('visible');
  }
});

// Press Enter in description → jump to amount
descInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    amtInput.focus();
  }
});

// ===== Set default date =====
function setDefaultDate() {
  const today = new Date();
  dateInput.value = today.toISOString().split('T')[0];
}
setDefaultDate();

// ===== Validation =====
function validate() {
  let valid = true;

  const desc = descInput.value.trim();
  if (!desc) {
    descInput.classList.add('invalid');
    document.getElementById('descError').classList.add('visible');
    valid = false;
  } else {
    descInput.classList.remove('invalid');
    document.getElementById('descError').classList.remove('visible');
  }

  const amt = parseFloat(amtInput.value);
  if (!amtInput.value || isNaN(amt) || amt <= 0) {
    amtInput.classList.add('invalid');
    document.getElementById('amtError').classList.add('visible');
    valid = false;
  } else {
    amtInput.classList.remove('invalid');
    document.getElementById('amtError').classList.remove('visible');
  }

  return valid;
}

// ===== Add Transaction =====
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validate()) return;

  const transaction = {
    id: generateId(),
    type: currentType,
    description: descInput.value.trim(),
    amount: parseFloat(amtInput.value),
    category: categoryInput.value,
    date: dateInput.value
  };

  transactions.unshift(transaction);
  saveData();
  renderAll();
  form.reset();
  setDefaultDate();
  setType(currentType);
  showToast(`✅ ${currentType === 'income' ? 'Income' : 'Expense'} added successfully!`);
});

// ===== Delete Transaction =====
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveData();
  renderAll();
  showToast('🗑 Transaction deleted.');
}

// ===== Clear All =====
clearAllBtn.addEventListener('click', () => {
  if (transactions.length === 0) {
    showToast('Nothing to clear!');
    return;
  }
  if (confirm('Are you sure you want to delete all transactions? This cannot be undone.')) {
    transactions = [];
    saveData();
    renderAll();
    showToast('🗑 All transactions cleared.');
  }
});

// ===== Export CSV =====
exportBtn.addEventListener('click', () => {
  if (transactions.length === 0) {
    showToast('No transactions to export!');
    return;
  }
  const header = ['Date', 'Description', 'Category', 'Type', 'Amount (INR)'];
  const rows = transactions.map(t => [
    t.date,
    '"' + t.description.replace(/"/g, '""') + '"',
    t.category,
    t.type,
    (t.type === 'expense' ? '-' : '') + t.amount.toFixed(2)
  ]);
  const csvContent = [header, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'transactions_' + new Date().toISOString().slice(0, 10) + '.csv';
  link.click();
  URL.revokeObjectURL(url);
  showToast('📥 CSV downloaded!');
});

// ===== Filters =====
filterCat.addEventListener('change', renderList);
filterType.addEventListener('change', renderList);

// ===== Update Summary =====
function updateSummary() {
  const income  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  totalIncome.textContent  = formatINR(income);
  totalExpense.textContent = formatINR(expense);
  totalBalance.textContent = (balance < 0 ? '-' : '') + formatINR(balance);
}

// ===== Render List =====
function renderList() {
  const catFilter  = filterCat.value;
  const typeFilter = filterType.value;

  const filtered = transactions.filter(t => {
    const matchCat  = catFilter  === 'All' || t.category === catFilter;
    const matchType = typeFilter === 'All' || t.type === typeFilter;
    return matchCat && matchType;
  });

  // Remove existing items (keep empty state)
  txList.querySelectorAll('.transaction-item').forEach(el => el.remove());

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    filtered.forEach(t => {
      const li = document.createElement('li');
      li.className = `transaction-item ${t.type}-item`;
      li.innerHTML = `
        <div class="tx-info">
          <p class="tx-desc">${escapeHtml(t.description)}</p>
          <p class="tx-meta">${t.category} &bull; ${formatDate(t.date)}</p>
        </div>
        <span class="tx-amount ${t.type}-amount">
          ${t.type === 'income' ? '+' : '-'}${formatINR(t.amount)}
        </span>
        <button class="tx-delete" aria-label="Delete transaction" data-id="${t.id}">✕</button>
      `;
      txList.appendChild(li);
    });
  }
}

// ===== XSS Protection =====
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ===== Event Delegation for Delete =====
txList.addEventListener('click', (e) => {
  const btn = e.target.closest('.tx-delete');
  if (btn) deleteTransaction(btn.dataset.id);
});

// ===== Render Everything =====
function renderAll() {
  updateSummary();
  renderList();
}

// ===== Init =====
renderAll();
