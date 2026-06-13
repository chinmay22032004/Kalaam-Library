# Kalaam Library

Kalaam Library is a poetry club web app built with React and Vite. It includes support for Hindi and English book collections, mobile-number authentication, admin-managed site content, book management, and secure local session handling.

## Features

- Responsive React SPA built with Vite
- Mobile/password login and registration
- First admin can be created at registration time
- Admin dashboard for managing books, users, and site content
- Persistent books and settings stored in browser local storage
- Secure password hashing using Web Crypto PBKDF2
- Favorite books, book details modal, and search by title/author

## Local development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

This is a static single-page app that can be deployed to any static host such as Netlify, Vercel, GitHub Pages, or Firebase Hosting. The `dist/` folder is the production build output.

### Recommended deployment steps

1. Run `npm run build`
2. Deploy the contents of `dist/`

## Notes

- Authentication and data are simulated in-browser for demo use.
- To use the admin panel, register the first account with admin rights.
- Book and settings data persist in browser local storage between sessions.
