/* ------------------------------------------------------------------
   Visitor analytics (GoatCounter: no cookies, no personal data)
   Dashboard: https://shaikabdulla.goatcounter.com
------------------------------------------------------------------ */
(function () {
   'use strict';

   // Sends a named event, e.g. "click/resume-download". Safe to call before
   // GoatCounter has loaded or when an ad blocker stops it.
   function trackEvent(name, title) {
      try {
         if (window.goatcounter && typeof window.goatcounter.count === 'function') {
            window.goatcounter.count({ path: name, title: title || name, event: true });
         }
      } catch (e) { /* analytics must never break the page */ }
   }

   window.trackEvent = trackEvent;

   function classify(href) {
      var url = href.toLowerCase();
      if (url.indexOf('.pdf') !== -1) return 'click/resume-download';
      if (url.indexOf('linkedin.com') !== -1) return 'click/linkedin';
      if (url.indexOf('mailto:') === 0 || url.indexOf('mail.google.com') !== -1) return 'click/email';
      if (url.indexOf('vercel.app') !== -1) return 'click/live-demo/' + url.replace(/^https?:\/\//, '').split('/')[0].split('.')[0];
      if (url.indexOf('onrender.com') !== -1) return 'click/live-api';
      if (url.indexOf('github.com/shaikabdu18/') !== -1) {
         var repo = url.split('github.com/shaikabdu18/')[1].split(/[/#?]/)[0];
         return repo ? 'click/github/' + repo : 'click/github';
      }
      if (url.indexOf('github.com') !== -1) return 'click/github';
      return null;
   }

   // One listener covers every link, including ones added later by the assistant.
   document.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a[href]') : null;
      if (!link) return;
      var name = classify(link.getAttribute('href') || '');
      if (name) trackEvent(name);
   }, true);
})();
