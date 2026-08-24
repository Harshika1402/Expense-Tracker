# 💰 Expense Tracker

A simple, clean, and fully functional **Expense Tracker** web app built with plain HTML, CSS, and JavaScript — no frameworks, no build tools.

## ✨ Features

- ➕ **Add income & expense** transactions with description, category, amount, and date
- 📊 **Live balance** with color-coded card (green = positive, red = negative)
- 🗂 **Categorize** transactions — Food, Transport, Shopping, Health, Entertainment, Salary, and more
- 🔍 **Real-time search** — filter transactions by description as you type
- 🔽 **Sort** by newest, oldest, highest, or lowest amount
- 📅 **Monthly summary bar** — income, expenses, and net for the current month
- 🌙 **Dark mode toggle** with localStorage persistence
- 🧮 **Transaction count badge** and **savings rate** in footer
- ⬇ **Export to CSV** with date-stamped filename
- 🗑 **Delete** individual transactions or **Clear All** (with custom confirm dialog)
- ⚠️ **Custom animated confirm modal** — no browser dialog
- 📌 **Category emoji icons** and chip tags on each transaction row
- ⌨️ **Keyboard shortcuts**: `Alt+N` (new entry), `Alt+E` (search), `Esc` (close modal)
- 🖨 **Print-friendly** — clean print layout with hidden controls
- ♿ **Accessible** — focus-visible ring, ARIA labels, live regions
- 💾 **localStorage** — data survives page refresh
- 📱 **Fully responsive** (mobile-friendly)

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | CSS3 (Vanilla) |
| Logic | JavaScript (ES6+) |
| Fonts | Google Fonts (Inter) |
| Storage | localStorage |

## 🚀 Getting Started

Just open `index.html` in any modern browser — no installation needed.

```bash
# Clone the repo
git clone https://github.com/Harshika1402/Expense-Tracker.git

# Open in browser
open index.html
```

## 📁 Project Structure

```
Expense-Tracker/
├── index.html    # Main HTML structure
├── style.css     # Styling, dark mode, responsive layout
├── app.js        # Application logic
└── README.md     # This file
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + N` | Focus description field (new transaction) |
| `Alt + E` | Focus search bar |
| `Enter` (in description) | Jump to amount field |
| `Escape` | Close confirm modal |

## 📄 License

MIT License
