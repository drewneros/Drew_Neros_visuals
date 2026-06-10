# Drew Neros Visuals — Owner Notes

## Live site
**https://nerosvisuals.netlify.app**

## Access
- GitHub repo: https://github.com/drewneros/Drew_Neros_visuals (Private)
- Netlify project: nerosvisuals (auto-deploys from main branch on GitHub)

## Admin console
- Open: press **⌘U** (Mac) or **Ctrl+U** (Windows) anywhere on the site
- Mobile: **triple-tap** the bottom-right corner of the screen
- Password: **6088**
- First login asks for your Anthropic API key (stored in browser, never asked again)
- Anthropic API key: saved in your browser's localStorage under `dn_api_key`
  - Get/manage keys: https://console.anthropic.com/settings/keys

## Changing the password
1. Run in terminal: `echo -n "yournewpassword" | sha256sum`
2. Copy the hash
3. Open `src/admin.jsx` and replace the `OWNER_HASH` value on line ~12

## Upload flow (⌘U → 6088)
1. **Upload** — drag & drop images or browse. Batch any size.
2. **Analyze** — Claude looks at each photo (4 at a time) and sorts into categories
3. **Review** — drag images to fix wrong buckets. "↻ Re-analyze all" to retry
4. **Alt text** — AI writes captions; edit any you want to change
5. **Publish** — images appear live on the site immediately (no reload needed)

## Categories
| ID | Name | What goes here |
|----|------|----------------|
| fashion-editorial | Fashion Editorial | Styled, conceptual, magazine-worthy |
| portraits | Portraits | Person as themselves, intimate |
| models | Models / Digitals | Agency casting, plain background, standard poses |
| ecommerce | E-commerce | Clothes/accessories on model for retail |
| lifestyle | Lifestyle | Candid, behind-the-scenes, documentary |
| product | Product | Objects only — no people as main subject |

## What was built in this session
- Full portfolio site: cinematic intro, sidebar with live clock, masonry galleries,
  About/Services/FAQ, contact form, tweaks panel (theme, accent, clock city, etc.)
- Owner admin console: upload → AI sort → review → alt text → publish
- Password gate on admin (SHA-256, stored in browser session)
- Admin hidden from public (⌘U only + mobile triple-tap)
- Real Anthropic API calls for image classification and alt text (haiku model)
- Parallel batch processing (4 images at a time) for speed
- Re-analyze button on review screen

## Key files
```
index.html          — entry point, all CSS, loads all JSX via Babel
src/app.jsx         — root component, layout, keyboard shortcuts
src/sidebar.jsx     — left rail, clock, nav
src/intro.jsx       — cinematic full-screen intro overlay
src/gallery.jsx     — masonry galleries, lightbox, AI classification + alt text
src/about.jsx       — about section, services, FAQ
src/contact.jsx     — contact form, footer
src/admin.jsx       — owner upload console (password-gated)
src/tweaks.jsx      — tweaks panel wiring
src/data.jsx        — categories, shots array, publishFiles()
src/placeholder.jsx — placeholder cards, useReveal hook
```

## Contact info on site
- Email: drew@nerosvisuals.com
- Instagram: @drewnerosph → https://www.instagram.com/drewnerosph/
- Behance: DrewNeros → https://www.behance.net/DrewNeros
- Booking form: https://tally.so/r/BzD4YK
