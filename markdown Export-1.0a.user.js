// ==UserScript==
// @name         Google AI Mode Chat → Markdown Export
// @namespace    https://tampermonkey.net/
// @version      1.3
// @description  Export Google AI Mode chats to Markdown with one click
// @match        https://www.google.com/search*
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  const querySelector = 'span.VndcI.veK2kb';
  const responseSelector = 'div.mZJni';
  const timestampSelector = 'p.kwdzO';
  const codeBlockSelector = 'div.r1PmQe';

  const findTimestampBefore = function(node, timestamps) {
    let ts = '';
    for (const t of timestamps) {
      if (node.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) {
        ts = t.innerText.trim();
      }
    }
    return ts;
  };

  const EXCLUDED_CLASSES = ['DBd2Wb'];
  const TAG_WRAPPERS = {
    'STRONG': function(t) { return '**' + t + '**'; },
    'EM': function(t) { return '*' + t + '*'; },
  };

  const linkToMarkdown = function(aEl) {
    const text = aEl.innerText.trim();
    const href = aEl.getAttribute('href');
    if (!href || !text) return text;
    return '[' + text + '](' + href + ')';
  };
  const CLASS_WRAPPERS = {
    'otQkpb': function(t) { return '## ' + t; },
  };
  const TAG_BLOCK = {
    'LI': true,
    'UL': true,
    'OL': true,
  };

  // Convert a TABLE element to a Markdown table string using tag names only
  const tableToMarkdown = function(tableEl) {
    const rows = Array.from(tableEl.querySelectorAll('tr'));
    if (!rows.length) return tableEl.innerText;

    const grid = rows.map(function(row) {
      return Array.from(row.querySelectorAll('th, td')).map(function(cell) {
        return cell.innerText.replace(/\n/g, ' ').replace(/\|/g, '\\|').trim();
      });
    });

    if (!grid.length) return '';

    const colCount = grid.reduce(function(max, row) {
      return Math.max(max, row.length);
    }, 0);

    const padded = grid.map(function(row) {
      while (row.length < colCount) row.push('');
      return row;
    });

    const lines = [];
    lines.push('| ' + padded[0].join(' | ') + ' |');
    lines.push('| ' + padded[0].map(function() { return '---'; }).join(' | ') + ' |');
    for (let i = 1; i < padded.length; i++) {
      lines.push('| ' + padded[i].join(' | ') + ' |');
    }

    return '\n' + lines.join('\n') + '\n';
  };

  const extractResponseText = function(responseEl) {
    const parts = [];
    const walk = function(node, depth) {
      if (depth === undefined) depth = 0;
      if (node.nodeType === 3) {
        const t = node.textContent ? node.textContent.trim() : '';
        if (t) parts.push(t);
        return;
      }
      if (node.nodeType !== 1) return;
      const className = typeof node.className === 'string' ? node.className : '';
      if (EXCLUDED_CLASSES.some(function(c) { return className.split(' ').indexOf(c) !== -1; })) return;

      const preview = (node.innerText || '').trim().slice(0, 80).replace(/\n/g, '\u21B5');
      console.log('  '.repeat(depth) + '[' + node.tagName + '] class="' + className + '" | "' + preview + '"');

      // Handle entire table as a unit — tableToMarkdown handles tr/th/td internally
      if (node.tagName === 'TABLE') {
        parts.push(tableToMarkdown(node));
        return;
      }

      // Guard: skip orphaned table structural tags (shouldn't normally be reached)
      if (node.tagName === 'TR' || node.tagName === 'TH' || node.tagName === 'TD' ||
          node.tagName === 'THEAD' || node.tagName === 'TBODY' || node.tagName === 'TFOOT') {
        return;
      }

      if (node.tagName === 'A') {
        parts.push(linkToMarkdown(node));
        return;
      }

      const classKey = className.split(' ').find(function(c) { return CLASS_WRAPPERS[c]; });
      const classWrapper = classKey ? CLASS_WRAPPERS[classKey] : null;
      const tagWrapper = TAG_WRAPPERS[node.tagName] || null;
      const wrapper = classWrapper || tagWrapper;

      if (wrapper) {
        const t = node.innerText;
        if (t) parts.push(wrapper(t));
        return;
      }

      const isCode = node.matches(codeBlockSelector) || (node.querySelector && node.querySelector(codeBlockSelector));
      if (isCode) {
        parts.push('\n```\n' + node.innerText + '\n```\n');
        return;
      }

      if (TAG_BLOCK[node.tagName]) {
        if (node.tagName === 'LI') {
          const liParts = [];
          const liWalk = function(n) {
            if (n.nodeType === 3) {
              const t = n.textContent;
              if (t) liParts.push(t);
              return;
            }
            if (n.nodeType !== 1) return;
            const cn = typeof n.className === 'string' ? n.className : '';
            if (EXCLUDED_CLASSES.some(function(c) { return cn.split(' ').indexOf(c) !== -1; })) return;
            if (n.tagName === 'A') { liParts.push(linkToMarkdown(n)); return; }
            const cwKey = cn.split(' ').find(function(c) { return CLASS_WRAPPERS[c]; });
            const cw = cwKey ? CLASS_WRAPPERS[cwKey] : null;
            const tw = TAG_WRAPPERS[n.tagName] || null;
            const w = cw || tw;
            if (w) {
              const t = n.innerText;
              if (t) liParts.push(w(t));
              return;
            }
            Array.from(n.childNodes).forEach(liWalk);
          };
          Array.from(node.childNodes).forEach(liWalk);
          parts.push('- ' + liParts.join(''));
          return;
        }
        Array.from(node.childNodes).forEach(function(child) { walk(child, depth + 1); });
        return;
      }

      Array.from(node.childNodes).forEach(function(child) { walk(child, depth + 1); });
    };

    Array.from(responseEl.childNodes).forEach(function(child) { walk(child, 0); });
    return parts.length ? parts.join('\n') : responseEl.innerText;
  };

  const exportMarkdown = function() {
    const queries = Array.from(document.querySelectorAll(querySelector))
      .map(function(el) { return { el: el, text: el.innerText }; })
      .filter(function(q) { return q.text.length > 0; });

    const responses = Array.from(document.querySelectorAll(responseSelector));
    const timestamps = Array.from(document.querySelectorAll(timestampSelector));

    if (!queries.length || !responses.length) {
      alert('No chats found. Scroll to load all content first.');
      return;
    }

    const chats = [];

    for (let i = 0; i < queries.length; i++) {
      const qEl = queries[i].el;
      const qText = queries[i].text;
      const nextQEl = queries[i + 1] ? queries[i + 1].el : null;

      const matchedResponses = responses.filter(function(r) {
        const afterCurrent = qEl.compareDocumentPosition(r) & Node.DOCUMENT_POSITION_FOLLOWING;
        const beforeNext = nextQEl
          ? r.compareDocumentPosition(nextQEl) & Node.DOCUMENT_POSITION_FOLLOWING
          : true;
        return afterCurrent && beforeNext;
      });

      let prefixResponses = [];
      if (i === 0) {
        prefixResponses = responses.filter(function(r) {
          return r.compareDocumentPosition(qEl) & Node.DOCUMENT_POSITION_FOLLOWING;
        });
      }

      const allResponses = prefixResponses.concat(matchedResponses);

      const responseText = allResponses
        .map(extractResponseText)
        .filter(Boolean)
        .join('\n\n---\n\n');

      chats.push({
        id: i + 1,
        query: qText,
        response: responseText,
        timestamp: findTimestampBefore(qEl, timestamps),
      });
    }

    const md = chats.map(function(c) {
      return '## Question:\n' + c.query + '\n\n## Answer:\n' + c.response + '\n';
    }).join('\n---\n\n');

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = document.title.replace(/ - Google Search$/, '').replace(/[<>:"/\\|?*]/g, '_') + '.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const addButton = function() {
    if (document.getElementById('ai-export-md-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'ai-export-md-btn';
    btn.textContent = '\u2B07 Export AI Chat (MD)';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '999999';
    btn.style.padding = '10px 14px';
    btn.style.background = '#1a73e8';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '8px';
    btn.style.fontSize = '14px';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    btn.onclick = exportMarkdown;

    document.body.appendChild(btn);
  };

  window.addEventListener('load', addButton);
})();