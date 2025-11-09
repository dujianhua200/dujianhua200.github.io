(function (global) {
  'use strict';

  var SEARCH_INDEX_URL = global.SITE_SEARCH_INDEX_URL || 'postList.json';
  var CACHE_KEY = 'site-search-index-v2';

  var index = [];
  var meta = {};
  var rawIndex = null;
  var loadPromise = null;

  function safeGetCache() {
    try {
      var cached = global.sessionStorage && global.sessionStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      return JSON.parse(cached);
    } catch (err) {
      return null;
    }
  }

  function safeSetCache(payload) {
    try {
      if (!global.sessionStorage) return;
      global.sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    } catch (err) {
      /* ignore quota errors */
    }
  }

  function safeClearCache() {
    try {
      if (!global.sessionStorage) return;
      global.sessionStorage.removeItem(CACHE_KEY);
    } catch (err) {
      /* noop */
    }
  }

  function normalizeUrl(url) {
    if (!url) return '';
    return url.replace(/^\/+/, '').replace(/\/+/g, '/');
  }

  function unique(array) {
    var seen = Object.create(null);
    var result = [];
    for (var i = 0; i < array.length; i += 1) {
      var value = array[i];
      if (!value) continue;
      if (!seen[value]) {
        seen[value] = true;
        result.push(value);
      }
    }
    return result;
  }

  function deriveCategories(tags, mapping, fallback) {
    var categories = [];
    if (Array.isArray(tags)) {
      for (var i = 0; i < tags.length; i += 1) {
        var tag = tags[i];
        var mapped = mapping && mapping[tag];
        if (!mapped) continue;
        if (Array.isArray(mapped)) {
          categories = categories.concat(mapped);
        } else {
          categories.push(mapped);
        }
      }
    }
    if (!categories.length && fallback) {
      categories.push(fallback);
    }
    return unique(categories);
  }

  function shallowClone(obj) {
    var copy = {};
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        copy[key] = obj[key];
      }
    }
    return copy;
  }

  function parseRaw(raw) {
    var metaFromRaw = raw && raw.meta ? shallowClone(raw.meta) : {};
    if (!metaFromRaw.tagColors && raw && raw.labelColorDict) {
      metaFromRaw.tagColors = shallowClone(raw.labelColorDict);
    }
    var mapping = metaFromRaw.categoryMapping || {};
    var defaultCategoryName = (metaFromRaw.defaultCategory && metaFromRaw.defaultCategory.name) || 'Uncategorized';
    var defaultCategoryColor = (metaFromRaw.defaultCategory && metaFromRaw.defaultCategory.color) || '#6e7781';

    var posts = [];

    if (raw && Array.isArray(raw.posts)) {
      for (var i = 0; i < raw.posts.length; i += 1) {
        var entry = raw.posts[i] || {};
        var labels = entry.labels || entry.tags || [];
        var categories = deriveCategories(labels, mapping, defaultCategoryName);
        posts.push({
          id: entry.id || entry.postId || ('P' + (i + 1)),
          title: entry.title || entry.postTitle || '',
          description: entry.description || '',
          excerpt: entry.excerpt || entry.description || '',
          url: normalizeUrl(entry.url || entry.postUrl || ''),
          createdAt: entry.createdAt || Date.parse(entry.createdDate || '') || 0,
          createdDate: entry.createdDate || '',
          dateLabelColor: entry.dateLabelColor || null,
          tags: labels.slice(),
          categories: categories,
          wordCount: typeof entry.wordCount === 'number' ? entry.wordCount : null,
          viewCount: typeof entry.viewCount === 'number' ? entry.viewCount : null
        });
      }
    } else if (raw && typeof raw === 'object') {
      for (var key in raw) {
        if (!Object.prototype.hasOwnProperty.call(raw, key)) continue;
        if (key === 'labelColorDict') continue;
        var value = raw[key];
        if (!value || typeof value !== 'object') continue;
        var entryLabels = value.labels || [];
        var entryCategories = deriveCategories(entryLabels, mapping, defaultCategoryName);
        posts.push({
          id: key,
          title: value.postTitle || '',
          description: value.description || '',
          excerpt: value.description || '',
          url: normalizeUrl(value.postUrl || ''),
          createdAt: value.createdAt || Date.parse(value.createdDate || '') || 0,
          createdDate: value.createdDate || '',
          dateLabelColor: value.dateLabelColor || null,
          tags: entryLabels.slice(),
          categories: entryCategories,
          wordCount: typeof value.wordCount === 'number' ? value.wordCount : null,
          viewCount: typeof value.viewCount === 'number' ? value.viewCount : null
        });
      }
    }

    posts.sort(function (a, b) {
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    if (!metaFromRaw.defaultCategory) {
      metaFromRaw.defaultCategory = {
        name: defaultCategoryName,
        color: defaultCategoryColor
      };
    }

    return {
      posts: posts,
      meta: metaFromRaw
    };
  }

  function getSearchableText(item) {
    var base = [item.title, item.description, item.excerpt].join(' ');
    var tags = Array.isArray(item.tags) ? item.tags.join(' ') : '';
    var categories = Array.isArray(item.categories) ? item.categories.join(' ') : '';
    return (base + ' ' + tags + ' ' + categories).toLowerCase();
  }

  function buildScore(item, tokens) {
    var haystack = getSearchableText(item);
    var score = 0;
    for (var i = 0; i < tokens.length; i += 1) {
      var token = tokens[i];
      var index = haystack.indexOf(token);
      if (index === -1) {
        return null;
      }
      var proximityBoost = 1 / (index + 1);
      var titleBoost = item.title.toLowerCase().indexOf(token) !== -1 ? 2 : 0;
      score += proximityBoost + titleBoost;
    }
    return score;
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function highlight(text, query) {
    if (!query) return escapeHtml(text);
    var tokens = query.trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) return escapeHtml(text);
    tokens.sort(function (a, b) { return b.length - a.length; });
    var pattern = tokens.map(function (token) { return escapeRegExp(token); }).join('|');
    var regex = new RegExp('(' + pattern + ')', 'gi');
    return escapeHtml(text).replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  function runSearch(query, limit) {
    if (!query || !query.trim()) {
      return [];
    }
    var tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) {
      return [];
    }
    var results = [];
    for (var i = 0; i < index.length; i += 1) {
      var item = index[i];
      var score = buildScore(item, tokens);
      if (score === null) continue;
      results.push({ item: item, score: score });
    }
    results.sort(function (a, b) { return b.score - a.score; });
    var sliced = results.slice(0, typeof limit === 'number' ? limit : 20);
    return sliced.map(function (entry) { return entry.item; });
  }

  function ensureIndexLoaded() {
    if (index.length) {
      return Promise.resolve(index);
    }
    if (loadPromise) {
      return loadPromise;
    }
    var cached = safeGetCache();
    if (cached && Array.isArray(cached.posts)) {
      index = cached.posts;
      meta = cached.meta || {};
      rawIndex = cached.raw || null;
      return Promise.resolve(index);
    }
    loadPromise = fetch(SEARCH_INDEX_URL, { cache: 'force-cache' })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Failed to download search index: ' + response.status);
        }
        return response.json();
      })
      .then(function (raw) {
        rawIndex = raw;
        var parsed = parseRaw(raw);
        index = parsed.posts;
        meta = parsed.meta;
        safeSetCache({ posts: index, meta: meta, raw: raw });
        return index;
      })
      .catch(function (error) {
        console.error('[SiteSearch] Unable to load index', error);
        index = [];
        meta = {};
        rawIndex = null;
        safeClearCache();
        return index;
      })
      .finally(function () {
        loadPromise = null;
      });
    return loadPromise;
  }

  var api = {
    ready: function () {
      return ensureIndexLoaded().then(function () {
        return { posts: index.slice(), meta: shallowClone(meta) };
      });
    },
    ensureIndexLoaded: ensureIndexLoaded,
    search: function (query, limit) {
      return ensureIndexLoaded().then(function () {
        return runSearch(query, limit);
      });
    },
    instantSearch: function (query, limit) {
      return runSearch(query, limit);
    },
    highlight: highlight,
    getIndexSync: function () {
      return index.slice();
    },
    getMeta: function () {
      return shallowClone(meta);
    },
    getRawIndex: function () {
      return rawIndex ? JSON.parse(JSON.stringify(rawIndex)) : null;
    },
    clearCache: function () {
      safeClearCache();
      index = [];
      meta = {};
      rawIndex = null;
      loadPromise = null;
    }
  };

  global.SiteSearch = api;
})(typeof window !== 'undefined' ? window : this);
