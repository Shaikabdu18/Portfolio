# Shaik Abdulla – Software Engineer Portfolio

Personal portfolio of **Shaik Abdulla**, a Software Engineer building backend systems, RESTful APIs and AI features with Node.js, NestJS, C#/.NET and Go.

**Live site:** https://shaikabdu18.github.io/Portfolio/

## Highlights

- **300+** RESTful APIs built across 3+ enterprise client projects
- **80%** faster reporting APIs (8s to under 1.5s) through SQL indexing and query tuning
- **10,000+** records per asynchronous background run with BullMQ and Redis
- **20+** releases shipped on schedule

## Features

- **"Ask about me" assistant**: a chat widget that answers questions about my skills, projects and experience. It runs entirely in the browser using keyword matching over portfolio data, so no API keys are needed and no visitor data is sent anywhere.
- **Expertise section**: bento-style cards covering backend APIs, AI & LLM integration, microservices, performance, security and delivery.
- **Modern dark UI**: gradient hero, availability badge, scrolling tech-stack strip, cursor spotlight on cards, and scroll-triggered animations.
- **Resume and projects**: experience timeline, project cards with tech tags, skill groups, and a downloadable PDF resume.
- **Testimonials**: feedback from client teams.
- **Contact form**: powered by [Web3Forms](https://web3forms.com/).
- **AI and search discoverability**: [schema.org](https://schema.org/Person) structured data in the page and an [`llms.txt`](llms.txt) profile summary for AI assistants and crawlers.
- **Responsive and accessible**: works from phones to desktops, with keyboard support for the assistant and `prefers-reduced-motion` respected.

## Tech Stack

HTML5, CSS3 (custom properties, grid, animations), JavaScript, jQuery, Font Awesome, Google Fonts (Inter). Hosted on GitHub Pages.

## Project Structure

```
Portfolio/
├── index.html            # Single-page site
├── llms.txt              # Plain-text profile for AI assistants
├── css/
│   ├── default.css       # Base template styles
│   ├── layout.css        # Base template layout
│   ├── media-queries.css # Base template breakpoints
│   └── modern.css        # Custom design layer (theme, sections, assistant)
├── js/
│   ├── init.js           # Navigation, animations, scroll progress, spotlight
│   └── assistant.js      # "Ask about me" assistant (answers and matching)
├── images/               # Profile photo and project covers
└── assets/               # Resume PDF and project images
```

## Run Locally

No build step is needed. Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Updating the Site

- **Assistant answers**: edit the `INTENTS` list in [`js/assistant.js`](js/assistant.js). Each entry has keywords and an answer.
- **Resume**: replace `assets/Shaik-Abdulla-Resume.pdf`.
- **Cache busting**: after changing any CSS or JS file, update the `?v=` value on its link in `index.html` so returning visitors get the new version.

## Credits

Built on the [Ceevee](https://www.styleshout.com/) template by StyleShout, with a custom redesign and new features.

## Contact

- Email: shaikabdu49@gmail.com
- LinkedIn: [Shaik Abdulla](https://www.linkedin.com/in/shaik--abdulla/)
- GitHub: [Shaikabdu18](https://github.com/Shaikabdu18)

## License

The code is for personal use. Content, photos and resume © Shaik Abdulla.
