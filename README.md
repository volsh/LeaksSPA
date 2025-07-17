# 🛡️ Guardio Frontend Home Assignment - Leaks SPA

This is my submission for the Frontend Developer home exercise at Guardio.  
The app displays a list of known data breaches with the ability to view full details, lazy-load results, and toggle between light/dark themes.

## 🕒 Time Spent

Approx. **2 hours**.

---

## 🚀 Demo

> _Replace with your Vercel/Netlify deployment link if hosted._

[Live Demo](https://your-demo-url.com)

---

## 🧠 Features

- ✅ Fully functional **SPA** using Next.js App Router
- ✅ Breach list with:
  - Title, date, logo
  - Infinite scroll (lazy loading)
- ✅ Breach details view
  - Full info (description, metadata)
  - Deep link support
- ✅ Light/Dark mode support
  - Auto-detect system theme
  - Manual toggle with persistence
- ✅ Responsive design using Tailwind CSS

---

## 📦 Tech Stack

- [Next.js 14+ App Router](https://nextjs.org/docs/app)
- [React + TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- No backend or database required

---

## 🧼 Assumptions & Design Notes

- External logos are loaded directly; fallback is provided for broken image links.
- Theme preferences are saved in localStorage and default to system if unset.
- Clean, minimal animations were added for polish.

---

## 🛠️ Setup & Run Locally

1. Clone the repo:

```bash
git clone https://github.com/volsh/LeaksSPA.git
cd LeaksSPA
```
