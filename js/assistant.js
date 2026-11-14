/* ------------------------------------------------------------------
   "Ask about me" portfolio assistant
   Runs fully in the browser: answers come from the facts below,
   matched by keywords. No data is sent anywhere.
------------------------------------------------------------------ */
(function () {
   'use strict';

   var EMAIL = 'shaikabdu49@gmail.com';
   var LINKS = {
      email: { label: 'Email me', href: 'mailto:' + EMAIL },
      resume: { label: 'Download resume', href: './assets/Shaik-Abdulla-Resume.pdf', download: true },
      linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shaik--abdulla/' },
      github: { label: 'GitHub', href: 'https://github.com/Shaikabdu18' },
      works: { label: 'See my work', href: '#portfolio' },
      servicedesk: { label: 'Service Desk API code', href: 'https://github.com/Shaikabdu18/servicedesk-api' }
   };

   var INTENTS = [
      {
         keys: ['stack', 'tech', 'skill', 'language', 'tools', 'technolog', 'framework'],
         weight: 0.8,
         answer: 'My core stack is Node.js with NestJS and Express in TypeScript, plus C#/.NET and Go. For data I use MySQL, PostgreSQL, SQL Server, MongoDB and Redis, and for async work Kafka and BullMQ. On the front end I work with React and Next.js.'
      },
      {
         keys: ['experience', 'years', 'company', 'doodleblue', 'current', 'job', 'background'],
         weight: 0.6,
         answer: 'I\'m a Software Developer at DoodleBlue Innovations in Chennai (since June 2024). Over 2+ years I\'ve built backend services and APIs for 3+ enterprise clients, owning API and database design, releases and production support.'
      },
      {
         keys: ['achievement', 'proud', 'impact', 'best', 'result', 'performance', 'faster', 'optimi'],
         answer: 'On the ASB platform I cut reporting API response times from 8s to under 1.5s (about 80% faster) with MySQL indexing and query tuning. Across my work I\'ve built 300+ RESTful APIs and shipped 20+ releases on schedule.'
      },
      {
         keys: ['project', 'asb', 'rattha', 'built', 'portfolio', 'work on', 'case'],
         answer: 'At work: ASB, an enterprise microservices platform where I own the Admin Module and Pillar 5 (100+ APIs across 4 microservices), and Rattha, a CMS where I was the sole backend engineer (75+ APIs, zero critical issues at launch). My featured personal project is the Service Desk API, built with ASP.NET Core, EF Core and SQL Server.',
         links: ['works', 'servicedesk']
      },
      {
         keys: ['ai', 'llm', 'rag', 'openai', 'vector', 'embedding', 'gpt', 'semantic', 'machine learning', 'genai'],
         answer: 'I\'ve built AI features with the OpenAI API: RAG, embeddings and semantic search on vector databases like Qdrant and PGVector, wired into backend services so they\'re useful in real products.'
      },
      {
         keys: ['.net', 'dotnet', 'c#', 'csharp', 'asp', 'golang', 'go'],
         answer: 'Alongside Node.js I work in C#/.NET and Go. My Service Desk API shows my .NET work: ASP.NET Core 10, EF Core and SQL Server, with JWT roles, Repository and Strategy patterns, and 34 passing tests.',
         links: ['servicedesk']
      },
      {
         keys: ['service desk', 'servicedesk', 'ticket', 'featured'],
         answer: 'The Service Desk API is a ticketing REST API in ASP.NET Core 10 with EF Core and SQL Server. It has JWT roles, a ticket workflow, SLA due dates by priority, search and pagination, 34 unit and integration tests, Docker Compose and GitHub Actions CI.',
         links: ['servicedesk']
      },
      {
         keys: ['microservice', 'kafka', 'event', 'queue', 'bullmq', 'redis', 'async', 'scale', 'distributed'],
         answer: 'I design microservices with event-driven and queue-based processing using Kafka, BullMQ and Redis. On ASB, background jobs process 10,000+ records per run without blocking the APIs.'
      },
      {
         keys: ['available', 'hire', 'hiring', 'open to', 'role', 'notice', 'join', 'opportunit', 'looking'],
         answer: 'Yes, I\'m open to Software Engineer roles: backend or full stack, with Node.js, .NET or AI work. The quickest way to start a conversation is email.',
         links: ['email', 'resume']
      },
      {
         keys: ['contact', 'email', 'mail', 'phone', 'reach', 'call', 'number', 'linkedin', 'github'],
         answer: 'Email me at ' + EMAIL + ' or call +91 9498876303. You can also find me on LinkedIn and GitHub.',
         links: ['email', 'linkedin', 'github']
      },
      {
         keys: ['resume', 'cv', 'download'],
         answer: 'Here\'s my latest resume.',
         links: ['resume']
      },
      {
         keys: ['education', 'degree', 'college', 'study', 'studied', 'cgpa', 'university', 'graduat'],
         answer: 'I have a B.E. in Electronics and Communication Engineering from Mohammed Sathak A.J. College of Engineering, Chennai (Anna University), 2020 to 2024, with a CGPA of 8.2.'
      },
      {
         keys: ['strength', 'work style', 'team', 'culture', 'approach', 'how do you work', 'feedback', 'testimonial'],
         answer: 'I own problems end to end, ship in small, frequent releases, and learn fast from code reviews and feedback. Teams I\'ve worked with say I\'m dependable through UAT and release cycles, and always available for support.'
      },
      {
         keys: ['hi', 'hello', 'hey', 'hii', 'good morning', 'good evening'],
         answer: 'Hi! Ask me about my skills, projects, AI work, or how to get in touch.'
      }
   ];

   var FALLBACK = {
      answer: 'I don\'t have an answer for that one here yet. Send me an email and I\'ll reply personally.',
      links: ['email']
   };

   var SUGGESTIONS = [
      'What\'s your tech stack?',
      'Biggest achievement?',
      'AI experience?',
      'Tell me about your projects',
      'Are you open to roles?',
      'How can I contact you?'
   ];

   var fab = document.getElementById('ask-fab');
   var panel = document.getElementById('ask-panel');
   if (!fab || !panel) return;

   var body = document.getElementById('ask-body');
   var chips = document.getElementById('ask-chips');
   var form = document.getElementById('ask-form');
   var input = document.getElementById('ask-input');
   var closeBtn = panel.querySelector('.ask-close');
   var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   var started = false, busy = false;

   function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

   function match(text) {
      var q = ' ' + text.toLowerCase() + ' ';
      var best = null, bestScore = 0;
      INTENTS.forEach(function (intent) {
         var score = 0;
         intent.keys.forEach(function (k) {
            var short = k.length <= 3 && /^[a-z]+$/.test(k);
            var hit = short ? new RegExp('[^a-z]' + escapeRe(k) + '[^a-z]').test(q) : q.indexOf(k) !== -1;
            if (hit) score += (short || k.length > 4) ? 2 : 1;
         });
         score *= intent.weight || 1;
         if (score > bestScore) { bestScore = score; best = intent; }
      });
      return best || FALLBACK;
   }

   function scrollDown() { body.scrollTop = body.scrollHeight; }

   function addUser(text) {
      var el = document.createElement('div');
      el.className = 'ask-msg user';
      el.textContent = text;
      body.appendChild(el);
      scrollDown();
   }

   function addLinks(container, keys) {
      if (!keys || !keys.length) return;
      var wrap = document.createElement('div');
      wrap.className = 'ask-links';
      keys.forEach(function (key) {
         var l = LINKS[key];
         var a = document.createElement('a');
         a.textContent = l.label;
         a.href = l.href;
         if (l.download) a.setAttribute('download', '');
         if (/^https?:/.test(l.href)) { a.target = '_blank'; a.rel = 'noopener'; }
         if (l.href.charAt(0) === '#') a.addEventListener('click', close);
         wrap.appendChild(a);
      });
      container.appendChild(wrap);
   }

   function addBot(reply, done) {
      var el = document.createElement('div');
      el.className = 'ask-msg bot typing';
      el.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(el);
      scrollDown();

      setTimeout(function () {
         el.className = 'ask-msg bot';
         el.textContent = '';
         var text = document.createElement('p');
         el.appendChild(text);
         if (reduceMotion) {
            text.textContent = reply.answer;
            addLinks(el, reply.links); scrollDown(); done && done();
            return;
         }
         var i = 0;
         (function tick() {
            i = Math.min(reply.answer.length, i + 3);
            text.textContent = reply.answer.slice(0, i);
            scrollDown();
            if (i < reply.answer.length) setTimeout(tick, 16);
            else { addLinks(el, reply.links); scrollDown(); done && done(); }
         })();
      }, reduceMotion ? 0 : 550);
   }

   function ask(text) {
      text = (text || '').trim();
      if (!text || busy) return;
      busy = true;
      addUser(text);
      addBot(match(text), function () { busy = false; });
   }

   function renderChips() {
      SUGGESTIONS.forEach(function (s) {
         var b = document.createElement('button');
         b.type = 'button';
         b.textContent = s;
         b.addEventListener('click', function () { ask(s); });
         chips.appendChild(b);
      });
   }

   function open() {
      panel.hidden = false;
      fab.setAttribute('aria-expanded', 'true');
      fab.classList.add('is-open');
      if (!started) {
         started = true;
         renderChips();
         addBot({ answer: 'Hi, I\'m Shaik. Ask me anything about my skills, projects or experience, or tap a question below.' });
      }
      setTimeout(function () { input.focus(); }, 50);
   }

   function close() {
      panel.hidden = true;
      fab.setAttribute('aria-expanded', 'false');
      fab.classList.remove('is-open');
   }

   fab.addEventListener('click', function () { panel.hidden ? open() : close(); });
   closeBtn.addEventListener('click', close);
   document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close(); });
   form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value;
      input.value = '';
      ask(v);
   });
})();
