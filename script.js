(function () {
  'use strict';
  var doc = document;
  doc.documentElement.classList.add('js');

  var PHONE = '+447412852338';
  var EMAIL = 'lucia.massage@mail.com';

  /* Mobile menu */
  var burger = doc.getElementById('burger');
  var nav = doc.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* Breathing orb text, synced to the 8s CSS cycle */
  var breath = doc.getElementById('breath');
  var inhale = true;
  setInterval(function () {
    inhale = !inhale;
    breath.style.opacity = 0;
    setTimeout(function () {
      breath.textContent = inhale ? 'Breathe in' : 'Breathe out';
      breath.style.opacity = 1;
    }, 300);
  }, 4000);

  /* Treatment finder */
  var picks = {
    relax: {
      tag: 'Best for switching off',
      title: 'Relaxing massage',
      text: 'Slow, soothing work to melt away stress. A full-body relaxing massage is for women only and fits into 60 minutes. Add head and face and Lucia needs at least 90.',
      price: 'From \u00a355 for 60 mins',
      treat: 'Relaxing or deep tissue massage', len: '60 mins'
    },
    aches: {
      tag: 'Best for knots and tension',
      title: 'Deep tissue massage',
      text: 'Targeted work on stubborn muscles, with myofascial and neuromuscular release where needed. 60 minutes covers back, neck and shoulders. A full-body session needs 90 minutes or more.',
      price: '\u00a355 for 60 mins \u00b7 \u00a380 for 90 mins',
      treat: 'Relaxing or deep tissue massage', len: '90 mins'
    },
    head: {
      tag: 'Best for headaches',
      title: 'Head and face tension relief',
      text: 'Focused work to ease tension and migraine-type headaches. Prefer something gentler? An Indian head massage or a relaxing head and face massage are both \u00a355.',
      price: '\u00a360 for 60 mins',
      treat: 'Head and face massage', len: '60 mins'
    },
    swelling: {
      tag: 'Best for swelling and recovery',
      title: 'Manual lymphatic drainage (MLD)',
      text: 'Lucia\u2019s specialism. A gentle full-body technique that supports lymph flow and can help with swelling after surgery. Women only. Mention any surgery when you get in touch.',
      price: '\u00a380 for 90 mins',
      treat: 'Manual lymphatic drainage (women only)', len: '90 mins'
    },
    pregnancy: {
      tag: 'Best for mums-to-be',
      title: 'Pregnancy massage',
      text: 'A comfortable, supportive massage for pregnancy, at home where you can relax properly afterwards.',
      price: '\u00a355 for 60 mins',
      treat: 'Pregnancy massage', len: '60 mins'
    },
    different: {
      tag: 'Something a little different',
      title: 'Dry cupping, free with any massage',
      text: 'Add dry cupping to any massage at no extra cost. Curious about what\u2019s next? Bioenergetic meridian massage is coming soon, so register your interest.',
      price: 'Free add-on \u00b7 Meridian massage \u00a365 for 60 mins (coming soon)',
      treat: 'Dry cupping add-on', len: '60 mins'
    }
  };

  var chips = doc.getElementById('finder-chips');
  var result = doc.getElementById('finder-result');
  var cta = doc.getElementById('r-cta');
  var current = null;

  chips.addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn) return;
    var p = picks[btn.dataset.key];
    current = p;
    chips.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
    doc.getElementById('r-tag').textContent = p.tag;
    doc.getElementById('r-title').textContent = p.title;
    doc.getElementById('r-text').textContent = p.text;
    doc.getElementById('r-price').textContent = p.price;
    result.hidden = false;
    result.style.animation = 'none';
    void result.offsetWidth;
    result.style.animation = '';
  });

  var treat = doc.getElementById('f-treat');
  var len = doc.getElementById('f-len');

  /* Custom dropdowns: the native select stays in the DOM as the source of truth */
  var chevron = '<svg viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.5 1.75 6 6.25l4.5-4.5"/></svg>';
  var allDropdowns = [];

  function enhanceSelect(select) {
    var wrap = doc.createElement('div');
    wrap.className = 'dd';
    var btn = doc.createElement('button');
    btn.type = 'button';
    btn.className = 'dd__btn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-labelledby', select.getAttribute('aria-labelledby') + ' ' + select.id + '-val');
    btn.innerHTML = '<span class="dd__val" id="' + select.id + '-val"></span><span class="dd__chev">' + chevron + '</span>';
    var list = doc.createElement('ul');
    list.className = 'dd__list';
    list.id = select.id + '-list';
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-labelledby', select.getAttribute('aria-labelledby'));
    list.tabIndex = -1;
    btn.setAttribute('aria-controls', list.id);

    var opts = Array.prototype.map.call(select.options, function (o, i) {
      var li = doc.createElement('li');
      li.className = 'dd__opt';
      li.id = select.id + '-o' + i;
      li.setAttribute('role', 'option');
      li.textContent = o.text;
      list.appendChild(li);
      return li;
    });

    var active = 0;
    var valEl = btn.firstChild;

    function sync() {
      var idx = select.selectedIndex;
      valEl.textContent = select.options[idx].text;
      opts.forEach(function (li, i) { li.setAttribute('aria-selected', String(i === idx)); });
    }
    function setActive(i) {
      active = Math.max(0, Math.min(opts.length - 1, i));
      opts.forEach(function (li, i2) { li.classList.toggle('active', i2 === active); });
      list.setAttribute('aria-activedescendant', opts[active].id);
      opts[active].scrollIntoView({ block: 'nearest' });
    }
    function open() {
      allDropdowns.forEach(function (d) { if (d.wrap !== wrap) d.close(); });
      var r = btn.getBoundingClientRect();
      var below = window.innerHeight - r.bottom - 70;
      wrap.classList.toggle('up', below < 250 && r.top > below);
      wrap.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      setActive(select.selectedIndex);
      list.focus({ preventScroll: true });
    }
    function close(refocus) {
      wrap.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      if (refocus) btn.focus({ preventScroll: true });
    }
    function choose(i) {
      select.selectedIndex = i;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      sync();
      close(true);
    }

    btn.addEventListener('click', function () { wrap.classList.contains('open') ? close(true) : open(); });
    btn.addEventListener('keydown', function (e) {
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !wrap.classList.contains('open')) { e.preventDefault(); open(); }
    });
    list.addEventListener('click', function (e) {
      var li = e.target.closest('.dd__opt');
      if (li) choose(opts.indexOf(li));
    });
    list.addEventListener('mousemove', function (e) {
      var li = e.target.closest('.dd__opt');
      if (li) setActive(opts.indexOf(li));
    });
    list.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (k === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (k === 'Home') { e.preventDefault(); setActive(0); }
      else if (k === 'End') { e.preventDefault(); setActive(opts.length - 1); }
      else if (k === 'Enter' || k === ' ') { e.preventDefault(); choose(active); }
      else if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); }
      else if (k === 'Tab') { close(false); }
    });
    list.addEventListener('blur', function () {
      setTimeout(function () { if (!wrap.contains(doc.activeElement)) close(false); }, 0);
    });

    select.hidden = true;
    select.parentNode.insertBefore(wrap, select.nextSibling);
    wrap.appendChild(btn);
    wrap.appendChild(list);
    sync();

    var api = { wrap: wrap, sync: sync, close: close };
    allDropdowns.push(api);
    return api;
  }

  var treatDD = enhanceSelect(treat);
  var lenDD = enhanceSelect(len);
  doc.addEventListener('click', function (e) {
    allDropdowns.forEach(function (d) { if (!d.wrap.contains(e.target)) d.close(false); });
  });

  function prefill(t, l) {
    Array.prototype.forEach.call(treat.options, function (o) { if (o.text === t) treat.value = o.value; });
    if (l) Array.prototype.forEach.call(len.options, function (o) { if (o.text === l) len.value = o.value; });
    treatDD.sync();
    lenDD.sync();
  }

  cta.addEventListener('click', function () { if (current) prefill(current.treat, current.len); });

  doc.querySelectorAll('[data-prefill]').forEach(function (a) {
    a.addEventListener('click', function () {
      var l = a.dataset.prefill.indexOf('Relaxing') === 0 ? selectedLen : null;
      prefill(a.dataset.prefill, l);
    });
  });

  /* Price picker */
  var tabs = doc.querySelectorAll('.pricer__tabs button');
  var selectedLen = '60 mins';
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (o) { o.setAttribute('aria-checked', String(o === t)); });
      doc.getElementById('p-amt').textContent = '\u00a3' + t.dataset.price;
      doc.getElementById('p-min').textContent = 'for ' + t.dataset.min + ' minutes';
      doc.getElementById('p-note').innerHTML = t.dataset.note;
      selectedLen = t.dataset.min + ' mins';
    });
  });

  /* Enquiry: builds an email or text; nothing is sent by the site */
  var form = doc.getElementById('enquiry');
  var err = doc.getElementById('f-err');
  function message() {
    var v = function (id) { return doc.getElementById(id).value.trim(); };
    if (!v('f-name') || !v('f-phone')) { err.hidden = false; return null; }
    err.hidden = true;
    return [
      'Hi Lucia, I\u2019d like to book a massage.',
      '',
      'Name: ' + v('f-name'),
      'Phone: ' + v('f-phone'),
      'Treatment: ' + treat.value,
      'Length: ' + len.value,
      'Area: ' + (v('f-area') || 'not given'),
      'Notes: ' + (v('f-note') || 'none')
    ].join('\n');
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var m = message();
    if (m) window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Massage enquiry') + '&body=' + encodeURIComponent(m);
  });
  doc.getElementById('f-sms').addEventListener('click', function () {
    var m = message();
    if (m) window.location.href = 'sms:' + PHONE + '?body=' + encodeURIComponent(m);
  });

  /* Scroll reveal */
  var items = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
})();
