(function (global) {
  'use strict';

  if (!global || !global.document) {
    return;
  }

  var document = global.document;
  var READ_WORDS_PER_MINUTE = 200;
  var LOCAL_VIEW_CACHE_KEY = 'site-view-counts-v1';
  var KEY_CODES = {
    ESC: 'Escape',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ENTER: 'Enter',
    TAB: 'Tab'
  };

  var STATE = {
    overlay: null,
    overlayInput: null,
    overlayList: null,
    overlayEmpty: null,
    overlayResults: [],
    activeResultIndex: -1,
    hashInternalUpdate: false,
    analyticsLoaded: false,
    analyticsConfig: null,
    viewElements: Object.create(null),
    numberFormatter: (global.Intl && typeof global.Intl.NumberFormat === 'function')
      ? new global.Intl.NumberFormat()
      : { format: function (value) { return String(value); } }
  };

  document.addEventListener('DOMContentLoaded', onReady);

  function onReady() {
    initSearchOverlay();

    if (!global.SiteSearch) {
      console.warn('[SiteEnhancements] SiteSearch module is not available.');
      return;
    }

    global.SiteSearch.ensureIndexLoaded().then(function () {
      var posts = global.SiteSearch.getIndexSync();
      var meta = global.SiteSearch.getMeta();

      if (!Array.isArray(posts)) {
        posts = [];
      }

      var context = (document.body && document.body.dataset && document.body.dataset.page) || 'home';

      setupAnalytics(meta);
      renderAnalyticsNotice(meta);

      if (context === 'home' || context === 'tags') {
        initFilterablePage(posts, meta, context);
      }

      if (context === 'post') {
        initPostPage(posts, meta);
      }
    }).catch(function (error) {
      console.error('[SiteEnhancements] Unable to bootstrap search index', error);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Search Overlay                                                             */
  /* -------------------------------------------------------------------------- */

  function initSearchOverlay() {
    if (STATE.overlay) {
      return;
    }

    var overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');

    var container = document.createElement('div');
    container.className = 'search-overlay__container';
    container.setAttribute('role', 'document');

    var header = document.createElement('div');
    header.className = 'search-overlay__header';

    var input = document.createElement('input');
    input.className = 'search-overlay__input';
    input.type = 'search';
    input.placeholder = 'Search posts, tags, descriptions…';
    input.setAttribute('aria-label', 'Search posts');

    var actions = document.createElement('div');
    actions.className = 'search-overlay__actions';

    var hint = document.createElement('span');
    hint.className = 'search-overlay__hint';
    hint.textContent = 'Use ↑ / ↓ or Tab to navigate, Enter to open, Esc to close';

    var closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'search-overlay__close';
    closeButton.setAttribute('aria-label', 'Close search');
    closeButton.innerHTML = '&times;';

    actions.appendChild(hint);
    actions.appendChild(closeButton);

    header.appendChild(input);
    header.appendChild(actions);

    var resultsWrapper = document.createElement('div');
    resultsWrapper.className = 'search-overlay__results';

    var resultsList = document.createElement('ul');
    resultsList.className = 'search-results';
    resultsList.setAttribute('role', 'listbox');

    var emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No results found.';
    emptyState.hidden = true;

    resultsWrapper.appendChild(resultsList);
    resultsWrapper.appendChild(emptyState);

    container.appendChild(header);
    container.appendChild(resultsWrapper);
    overlay.appendChild(container);

    document.body.appendChild(overlay);

    STATE.overlay = overlay;
    STATE.overlayInput = input;
    STATE.overlayList = resultsList;
    STATE.overlayEmpty = emptyState;

    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) {
        closeOverlay();
      }
    });

    closeButton.addEventListener('click', closeOverlay);

    input.addEventListener('input', debounce(handleSearchInput, 150));
    input.addEventListener('keydown', handleOverlayKeydown);
    resultsList.addEventListener('keydown', handleOverlayKeydown);

    var triggers = document.querySelectorAll('[data-action="open-search"]');
    for (var i = 0; i < triggers.length; i += 1) {
      triggers[i].addEventListener('click', function (event) {
        event.preventDefault();
        openOverlay();
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
        if (document.activeElement && document.activeElement.tagName.match(/input|textarea|select/i)) {
          return;
        }
        event.preventDefault();
        openOverlay();
      }
      if (event.key === KEY_CODES.ESC && overlay.classList.contains('is-visible')) {
        closeOverlay();
      }
    });
  }

  function openOverlay() {
    if (!STATE.overlay) return;
    STATE.overlay.classList.add('is-visible');
    STATE.overlay.setAttribute('aria-hidden', 'false');
    STATE.overlayInput.value = '';
    STATE.overlayResults = [];
    STATE.activeResultIndex = -1;
    clearSearchResults();
    global.SiteSearch.ensureIndexLoaded().finally(function () {
      STATE.overlayInput.focus();
    });
  }

  function closeOverlay() {
    if (!STATE.overlay) return;
    STATE.overlay.classList.remove('is-visible');
    STATE.overlay.setAttribute('aria-hidden', 'true');
    STATE.overlayInput.blur();
  }

  function handleSearchInput(event) {
    var query = event.target.value || '';
    if (!query.trim()) {
      STATE.overlayResults = [];
      STATE.activeResultIndex = -1;
      clearSearchResults();
      return;
    }

    global.SiteSearch.ensureIndexLoaded().then(function () {
      var results = global.SiteSearch.instantSearch(query, 20);
      STATE.overlayResults = results || [];
      renderSearchResults(query);
    });
  }

  function clearSearchResults() {
    if (!STATE.overlayList) return;
    STATE.overlayList.innerHTML = '';
    STATE.overlayEmpty.hidden = true;
  }

  function renderSearchResults(query) {
    var list = STATE.overlayList;
    if (!list) return;
    list.innerHTML = '';

    if (!STATE.overlayResults.length) {
      STATE.overlayEmpty.hidden = false;
      STATE.activeResultIndex = -1;
      return;
    }

    STATE.overlayEmpty.hidden = true;
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < STATE.overlayResults.length; i += 1) {
      var result = STATE.overlayResults[i];
      var item = document.createElement('li');
      item.setAttribute('role', 'option');

      var link = document.createElement('a');
      link.className = 'search-results__item';
      link.href = resolveRelativeUrl(result.url);
      link.dataset.index = String(i);

      link.addEventListener('mouseover', function (evt) {
        var idx = parseInt(evt.currentTarget.dataset.index, 10);
        if (!isNaN(idx)) {
          setActiveResult(idx);
        }
      });

      link.addEventListener('focus', function (evt) {
        var idx = parseInt(evt.currentTarget.dataset.index, 10);
        if (!isNaN(idx)) {
          setActiveResult(idx);
        }
      });

      var title = document.createElement('span');
      title.className = 'search-result__title';
      title.innerHTML = global.SiteSearch.highlight(result.title || '', query);

      var metaLine = document.createElement('span');
      metaLine.className = 'search-result__meta';
      var pieces = [];
      if (result.createdDate) {
        pieces.push(result.createdDate);
      }
      if (result.categories && result.categories.length) {
        pieces.push(result.categories.join(', '));
      }
      if (result.tags && result.tags.length) {
        pieces.push('#' + result.tags.join(' #'));
      }
      metaLine.textContent = pieces.join(' • ');

      var excerpt = document.createElement('span');
      excerpt.className = 'search-result__excerpt';
      excerpt.innerHTML = global.SiteSearch.highlight(result.excerpt || result.description || '', query);

      link.appendChild(title);
      link.appendChild(metaLine);
      link.appendChild(excerpt);

      item.appendChild(link);
      fragment.appendChild(item);
    }

    list.appendChild(fragment);
    setActiveResult(0);
  }

  function setActiveResult(index) {
    var list = STATE.overlayList;
    if (!list) return;
    var items = list.querySelectorAll('.search-results__item');
    if (!items.length) return;

    if (STATE.activeResultIndex >= 0 && STATE.activeResultIndex < items.length) {
      items[STATE.activeResultIndex].classList.remove('is-active');
    }

    if (typeof index === 'number' && index >= 0 && index < items.length) {
      items[index].classList.add('is-active');
      STATE.activeResultIndex = index;
      items[index].focus({ preventScroll: true });
    } else {
      STATE.activeResultIndex = -1;
    }
  }

  function handleOverlayKeydown(event) {
    var key = event.key;
    if (!STATE.overlayResults.length) return;

    if (key === KEY_CODES.ARROW_DOWN || key === KEY_CODES.TAB && !event.shiftKey) {
      event.preventDefault();
      var next = (STATE.activeResultIndex + 1) % STATE.overlayResults.length;
      setActiveResult(next);
      return;
    }

    if (key === KEY_CODES.ARROW_UP || key === KEY_CODES.TAB && event.shiftKey) {
      event.preventDefault();
      var prev = STATE.activeResultIndex - 1;
      if (prev < 0) {
        prev = STATE.overlayResults.length - 1;
      }
      setActiveResult(prev);
      return;
    }

    if (key === KEY_CODES.ENTER && STATE.activeResultIndex >= 0) {
      event.preventDefault();
      var items = STATE.overlayList.querySelectorAll('.search-results__item');
      if (items[STATE.activeResultIndex]) {
        var href = items[STATE.activeResultIndex].getAttribute('href');
        closeOverlay();
        global.location.href = href;
      }
    }

    if (key === KEY_CODES.ESC) {
      closeOverlay();
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Filterable Listing (Home & Tags)                                          */
  /* -------------------------------------------------------------------------- */

  function initFilterablePage(posts, meta, context) {
    var listContainer = document.querySelector('[data-post-list]');
    if (!listContainer) return;

    var emptyState = document.getElementById('empty-state');
    var categoryContainer = document.getElementById('category-filters');
    var tagContainer = document.getElementById('tag-filters');
    var statsContainer = document.getElementById('site-stats');
    var tagTitle = document.querySelector('[data-tag-title]');

    var viewCache = readViewCache();

    renderStats(statsContainer, posts, meta);

    var categories = buildCategorySummary(posts, meta);
    renderCategoryFilters(categoryContainer, categories);

    var tags = buildTagSummary(posts);
    renderTagFilters(tagContainer, tags);

    var filterState = restoreFiltersFromHash(categories, tags);
    syncCategoryButtons(categoryContainer, filterState);
    syncTagButtons(tagContainer, filterState);

    applyFiltersAndRender();

    if (categoryContainer) {
      categoryContainer.addEventListener('click', function (event) {
        var target = event.target.closest('[data-filter-scope="category"]');
        if (!target) return;
        var value = target.dataset.filterValue;
        if (!value || value === 'All') {
          filterState.category = null;
        } else {
          filterState.category = value;
        }
        syncCategoryButtons(categoryContainer, filterState);
        applyFiltersAndRender();
      });
    }

    if (tagContainer) {
      tagContainer.addEventListener('click', function (event) {
        var target = event.target.closest('[data-filter-scope="tag"]');
        if (!target) return;
        var value = target.dataset.filterValue;
        if (value === '__clear__') {
          filterState.tags = new Set();
        } else if (value) {
          if (filterState.tags.has(value)) {
            filterState.tags.delete(value);
          } else {
            filterState.tags.add(value);
          }
        }
        syncTagButtons(tagContainer, filterState);
        applyFiltersAndRender();
      });
    }

    global.addEventListener('hashchange', function () {
      if (STATE.hashInternalUpdate) {
        STATE.hashInternalUpdate = false;
        return;
      }
      var restored = restoreFiltersFromHash(categories, tags);
      if (!filtersEqual(filterState, restored)) {
        filterState = restored;
        syncCategoryButtons(categoryContainer, filterState);
        syncTagButtons(tagContainer, filterState);
        applyFiltersAndRender(false);
      }
    });

    function applyFiltersAndRender(shouldUpdateHash) {
      if (shouldUpdateHash === undefined) shouldUpdateHash = true;
      var filtered = filterPosts(posts, filterState);
      renderPostList(listContainer, filtered, meta, viewCache);
      if (emptyState) {
        emptyState.hidden = filtered.length > 0;
      }
      if (shouldUpdateHash) {
        updateHashFromFilters(filterState);
      }
      if (tagTitle) {
        var tagLabel = 'All posts';
        if (filterState.tags && filterState.tags.size === 1) {
          tagLabel = 'Tag #' + Array.from(filterState.tags)[0];
        } else if (filterState.category) {
          tagLabel = 'Category ' + filterState.category;
        }
        tagTitle.textContent = tagLabel;
      }
    }
  }

  function renderPostList(container, posts, meta, viewCache) {
    if (!container) return;
    container.innerHTML = '';

    if (!Array.isArray(posts) || !posts.length) {
      return;
    }

    var tagColors = meta && meta.tagColors ? meta.tagColors : {};
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < posts.length; i += 1) {
      var post = posts[i];
      var card = document.createElement('article');
      card.className = 'post-card';

      var header = document.createElement('div');
      header.className = 'post-card__header';

      var titleLink = document.createElement('a');
      titleLink.className = 'post-card__title';
      titleLink.href = resolveRelativeUrl(post.url);
      titleLink.textContent = post.title || 'Untitled post';
      header.appendChild(titleLink);

      if (post.createdDate) {
        var dateLabel = document.createElement('span');
        dateLabel.className = 'Label LabelTime';
        if (post.dateLabelColor) {
          dateLabel.style.backgroundColor = post.dateLabelColor;
        }
        dateLabel.textContent = post.createdDate;
        header.appendChild(dateLabel);
      }

      card.appendChild(header);

      if (post.excerpt) {
        var excerpt = document.createElement('p');
        excerpt.className = 'post-card__excerpt';
        excerpt.textContent = post.excerpt;
        card.appendChild(excerpt);
      }

      var metaRow = document.createElement('div');
      metaRow.className = 'post-card__meta';

      if (post.categories && post.categories.length) {
        var categoryPill = document.createElement('span');
        categoryPill.className = 'meta-pill';
        categoryPill.textContent = '📂 ' + post.categories.join(', ');
        metaRow.appendChild(categoryPill);
      }

      var readingPill = createReadingPill(post.wordCount);
      if (readingPill) {
        metaRow.appendChild(readingPill);
      }

      var viewPill = createViewPill(post.url, {
        initialValue: viewCache[normalizePath(post.url)]
      });
      metaRow.appendChild(viewPill);

      card.appendChild(metaRow);

      if (post.tags && post.tags.length) {
        var tagsRow = document.createElement('div');
        tagsRow.className = 'post-card__tags';
        for (var j = 0; j < post.tags.length; j += 1) {
          var tag = post.tags[j];
          var tagChip = document.createElement('span');
          tagChip.className = 'post-card__tag';
          tagChip.style.backgroundColor = tagColors[tag] || '#6e7781';
          tagChip.textContent = tag;
          tagsRow.appendChild(tagChip);
        }
        card.appendChild(tagsRow);
      }

      fragment.appendChild(card);
    }

    container.appendChild(fragment);
  }

  function renderStats(container, posts, meta) {
    if (!container) return;
    container.innerHTML = '';

    var totalPosts = posts.length;
    var tagSet = new Set();
    for (var i = 0; i < posts.length; i += 1) {
      var post = posts[i];
      if (Array.isArray(post.tags)) {
        for (var j = 0; j < post.tags.length; j += 1) {
          tagSet.add(post.tags[j]);
        }
      }
    }

    var stats = [];
    stats.push('📚 ' + totalPosts + ' posts');
    stats.push('🔖 ' + tagSet.size + ' tags');

    var startDate = meta && meta.site && meta.site.startDate;
    if (startDate) {
      var start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        var diff = Date.now() - start.getTime();
        var days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
        stats.push('🕰️ ' + days + ' days online');
      }
    }

    var fragment = document.createDocumentFragment();
    for (var k = 0; k < stats.length; k += 1) {
      var stat = document.createElement('span');
      stat.className = 'site-stat-pill';
      stat.textContent = stats[k];
      fragment.appendChild(stat);
    }

    if (STATE.analyticsConfig && STATE.analyticsConfig.enabled) {
      var views = document.createElement('span');
      views.className = 'site-stat-pill';
      var icon = document.createElement('span');
      icon.textContent = '👀 ';
      var value = document.createElement('span');
      value.id = 'busuanzi_value_site_pv';
      value.textContent = '—';
      var suffix = document.createElement('span');
      suffix.textContent = ' site views';
      views.appendChild(icon);
      views.appendChild(value);
      views.appendChild(suffix);
      fragment.appendChild(views);
    }

    container.appendChild(fragment);
  }

  function buildCategorySummary(posts, meta) {
    var counts = Object.create(null);
    var defaultCategory = meta && meta.defaultCategory && meta.defaultCategory.name ? meta.defaultCategory.name : 'Uncategorized';
    counts.All = posts.length;
    for (var i = 0; i < posts.length; i += 1) {
      var post = posts[i];
      var categories = (post.categories && post.categories.length) ? post.categories : [defaultCategory];
      for (var j = 0; j < categories.length; j += 1) {
        var key = categories[j];
        counts[key] = (counts[key] || 0) + 1;
      }
    }

    var list = [];
    for (var name in counts) {
      if (!Object.prototype.hasOwnProperty.call(counts, name)) continue;
      list.push({
        name: name,
        count: counts[name]
      });
    }

    list.sort(function (a, b) {
      if (a.name === 'All') return -1;
      if (b.name === 'All') return 1;
      return a.name.localeCompare(b.name);
    });

    return list;
  }

  function buildTagSummary(posts) {
    var counts = Object.create(null);
    for (var i = 0; i < posts.length; i += 1) {
      var post = posts[i];
      if (!Array.isArray(post.tags)) continue;
      for (var j = 0; j < post.tags.length; j += 1) {
        var tag = post.tags[j];
        counts[tag] = (counts[tag] || 0) + 1;
      }
    }

    var list = [];
    for (var tagName in counts) {
      if (!Object.prototype.hasOwnProperty.call(counts, tagName)) continue;
      list.push({
        name: tagName,
        count: counts[tagName]
      });
    }

    list.sort(function (a, b) {
      return b.count - a.count || a.name.localeCompare(b.name);
    });

    return list;
  }

  function renderCategoryFilters(container, categories) {
    if (!container) return;
    container.innerHTML = '';
    if (!Array.isArray(categories) || !categories.length) return;

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < categories.length; i += 1) {
      var category = categories[i];
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'filter-chip';
      button.dataset.filterScope = 'category';
      button.dataset.filterValue = category.name;
      button.textContent = category.name + ' · ' + category.count;
      button.setAttribute('aria-pressed', category.name === 'All' ? 'true' : 'false');
      fragment.appendChild(button);
    }
    container.appendChild(fragment);
  }

  function renderTagFilters(container, tags) {
    if (!container) return;
    container.innerHTML = '';
    if (!Array.isArray(tags) || !tags.length) return;

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < tags.length; i += 1) {
      var tag = tags[i];
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'filter-chip';
      button.dataset.filterScope = 'tag';
      button.dataset.filterValue = tag.name;
      button.textContent = '#' + tag.name + ' · ' + tag.count;
      button.setAttribute('aria-pressed', 'false');
      fragment.appendChild(button);
    }

    var clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.className = 'filter-chip filter-chip--clear';
    clearButton.dataset.filterScope = 'tag';
    clearButton.dataset.filterValue = '__clear__';
    clearButton.textContent = 'Clear tags';
    clearButton.hidden = true;
    fragment.appendChild(clearButton);

    container.appendChild(fragment);
  }

  function syncCategoryButtons(container, filters) {
    if (!container) return;
    var buttons = container.querySelectorAll('[data-filter-scope="category"]');
    for (var i = 0; i < buttons.length; i += 1) {
      var button = buttons[i];
      var value = button.dataset.filterValue;
      var isActive = (!filters.category && value === 'All') || (filters.category && filters.category === value);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }
  }

  function syncTagButtons(container, filters) {
    if (!container) return;
    var buttons = container.querySelectorAll('[data-filter-scope="tag"]');
    var hasTags = filters.tags && filters.tags.size > 0;
    for (var i = 0; i < buttons.length; i += 1) {
      var button = buttons[i];
      var value = button.dataset.filterValue;
      if (value === '__clear__') {
        button.hidden = !hasTags;
        continue;
      }
      var isActive = filters.tags && filters.tags.has(value);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }
  }

  function filterPosts(posts, filters) {
    return posts.filter(function (post) {
      var categoryMatch = true;
      if (filters.category) {
        categoryMatch = Array.isArray(post.categories) && post.categories.indexOf(filters.category) !== -1;
      }

      var tagsMatch = true;
      if (filters.tags && filters.tags.size) {
        tagsMatch = Array.isArray(post.tags) && Array.from(filters.tags).every(function (tag) {
          return post.tags.indexOf(tag) !== -1;
        });
      }

      return categoryMatch && tagsMatch;
    });
  }

  function restoreFiltersFromHash(categories, tags) {
    var state = {
      category: null,
      tags: new Set()
    };

    var hash = global.location.hash.replace(/^#/, '');
    if (!hash) {
      return state;
    }

    if (hash.indexOf('=') === -1) {
      state.tags.add(decodeURIComponent(hash));
      return state;
    }

    var parts = hash.split('&');
    for (var i = 0; i < parts.length; i += 1) {
      var chunk = parts[i];
      if (!chunk) continue;
      var tuple = chunk.split('=');
      var key = tuple[0];
      var value = tuple.slice(1).join('=');
      if (!value) continue;
      value = decodeURIComponent(value);
      if (key === 'category') {
        state.category = value;
      }
      if (key === 'tags') {
        var list = value.split(',');
        for (var j = 0; j < list.length; j += 1) {
          var tag = decodeURIComponent(list[j]);
          if (tag) {
            state.tags.add(tag);
          }
        }
      }
    }

    var validCategories = new Set();
    for (var c = 0; c < categories.length; c += 1) {
      validCategories.add(categories[c].name);
    }
    if (state.category && !validCategories.has(state.category)) {
      state.category = null;
    }

    var validTags = new Set();
    for (var t = 0; t < tags.length; t += 1) {
      validTags.add(tags[t].name);
    }
    state.tags = new Set(Array.from(state.tags).filter(function (tag) { return validTags.has(tag); }));

    return state;
  }

  function filtersEqual(a, b) {
    if (!!a.category !== !!b.category) return false;
    if (a.category && b.category && a.category !== b.category) return false;
    if ((!a.tags || !a.tags.size) && (!b.tags || !b.tags.size)) return true;
    if (!a.tags || !b.tags) return false;
    if (a.tags.size !== b.tags.size) return false;
    var iterator = a.tags.values();
    var step = iterator.next();
    while (!step.done) {
      if (!b.tags.has(step.value)) return false;
      step = iterator.next();
    }
    return true;
  }

  function updateHashFromFilters(filters) {
    var parts = [];
    if (filters.category) {
      parts.push('category=' + encodeURIComponent(filters.category));
    }
    if (filters.tags && filters.tags.size) {
      parts.push('tags=' + Array.from(filters.tags).map(encodeURIComponent).join(','));
    }
    var hash = parts.join('&');
    STATE.hashInternalUpdate = true;
    if (hash) {
      if (global.history && global.history.replaceState) {
        global.history.replaceState(null, '', '#' + hash);
      } else {
        global.location.hash = hash;
      }
    } else {
      if (global.history && global.history.replaceState) {
        global.history.replaceState(null, '', global.location.pathname + global.location.search);
      } else {
        global.location.hash = '';
      }
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Post Detail Enhancements                                                   */
  /* -------------------------------------------------------------------------- */

  function initPostPage(posts, meta) {
    var metaContainer = document.querySelector('[data-post-meta]');
    if (!metaContainer) return;

    var explicitUrl = metaContainer.dataset.postUrl;
    var path = explicitUrl || normalizePath(global.location.pathname);

    var post = findPostByUrl(posts, path);
    var viewPill = renderPostMeta(metaContainer, post, meta);

    var tagsContainer = document.querySelector('[data-post-tags]');
    if (tagsContainer && post) {
      var tagColors = meta && meta.tagColors ? meta.tagColors : {};
      renderTagBadges(tagsContainer, post.tags, tagColors);
    }

    if (!post || !viewPill) {
      return;
    }

    var normalized = normalizePath(post.url);
    var currentViews = incrementLocalViewCount(normalized);
    updateViewElements(normalized, currentViews);

    if (STATE.analyticsConfig && STATE.analyticsConfig.enabled) {
      observeBusuanzi(normalized, viewPill);
    }
  }

  function renderPostMeta(container, post, meta) {
    container.innerHTML = '';
    if (!post) {
      container.textContent = 'Metadata unavailable for this entry.';
      return null;
    }

    var fragment = document.createDocumentFragment();

    if (post.createdDate) {
      fragment.appendChild(createMetaPill('📅', post.createdDate));
    }

    var readingPill = createReadingPill(post.wordCount);
    if (readingPill) {
      fragment.appendChild(readingPill);
    }

    if (post.categories && post.categories.length) {
      fragment.appendChild(createMetaPill('📂', post.categories.join(', ')));
    }

    var viewPill = createViewPill(post.url, { isDetail: true });
    fragment.appendChild(viewPill);

    container.appendChild(fragment);

    return viewPill;
  }

  function createMetaPill(prefix, text) {
    var pill = document.createElement('span');
    pill.className = 'meta-pill';
    pill.textContent = prefix + ' ' + text;
    return pill;
  }

  function createReadingPill(wordCount) {
    if (typeof wordCount !== 'number' || wordCount <= 0) return null;
    var minutes = Math.max(1, Math.round(wordCount / READ_WORDS_PER_MINUTE));
    var pill = document.createElement('span');
    pill.className = 'meta-pill';
    pill.textContent = '⏱️ ' + minutes + ' min read';
    return pill;
  }

  function renderTagBadges(container, tags, tagColors) {
    container.innerHTML = '';
    if (!Array.isArray(tags) || !tags.length) return;
    for (var i = 0; i < tags.length; i += 1) {
      var tag = document.createElement('span');
      tag.className = 'Label';
      tag.style.backgroundColor = tagColors[tags[i]] || '#6e7781';
      tag.textContent = tags[i];
      container.appendChild(tag);
    }
  }

  function createViewPill(url, options) {
    options = options || {};
    var pill = document.createElement('span');
    pill.className = 'meta-pill';
    pill.dataset.role = 'views';
    pill.dataset.postUrl = normalizePath(url);

    if (STATE.analyticsConfig && STATE.analyticsConfig.enabled) {
      pill.dataset.loading = 'true';
    }

    var icon = document.createElement('span');
    icon.textContent = '👁';
    pill.appendChild(icon);

    var value = document.createElement('span');
    value.className = 'view-count-value';
    value.textContent = '—';

    if (options.isDetail) {
      value.id = 'busuanzi_value_page_pv';
    }

    pill.appendChild(value);

    var suffix = document.createElement('span');
    suffix.textContent = ' views';
    pill.appendChild(suffix);

    registerViewElement(url, value, pill, options.initialValue);

    return pill;
  }

  /* -------------------------------------------------------------------------- */
  /* Views Cache & Analytics                                                    */
  /* -------------------------------------------------------------------------- */

  function readViewCache() {
    try {
      var raw = global.localStorage && global.localStorage.getItem(LOCAL_VIEW_CACHE_KEY);
      if (!raw) return Object.create(null);
      var parsed = JSON.parse(raw);
      var normalized = Object.create(null);
      for (var key in parsed) {
        if (!Object.prototype.hasOwnProperty.call(parsed, key)) continue;
        normalized[normalizePath(key)] = parsed[key];
      }
      return normalized;
    } catch (err) {
      return Object.create(null);
    }
  }

  function writeViewCache(cache) {
    try {
      if (!global.localStorage) return;
      global.localStorage.setItem(LOCAL_VIEW_CACHE_KEY, JSON.stringify(cache));
    } catch (err) {
      /* ignore */
    }
  }

  function registerViewElement(url, valueNode, pill, initialValue) {
    if (!url || !valueNode) return;
    var key = normalizePath(url);
    if (!STATE.viewElements[key]) {
      STATE.viewElements[key] = [];
    }
    STATE.viewElements[key].push({ node: valueNode, pill: pill });
    if (typeof initialValue === 'number') {
      updateViewElements(key, initialValue);
    }
  }

  function updateViewElements(url, count) {
    var key = normalizePath(url);
    var entries = STATE.viewElements[key];
    if (!entries || !entries.length) return;

    var formatted = (typeof count === 'number' && !isNaN(count)) ? STATE.numberFormatter.format(count) : '—';
    for (var i = 0; i < entries.length; i += 1) {
      var entry = entries[i];
      if (entry.node) {
        entry.node.textContent = formatted;
      }
      if (entry.pill) {
        entry.pill.removeAttribute('data-loading');
      }
    }
  }

  function incrementLocalViewCount(url) {
    var cache = readViewCache();
    var current = cache[url] || 0;
    var next = current + 1;
    cache[url] = next;
    writeViewCache(cache);
    return next;
  }

  function observeBusuanzi(postUrl, viewPill) {
    var target = document.getElementById('busuanzi_value_page_pv');
    if (!target) return;

    var update = function () {
      var value = parseInt(target.textContent || target.innerText, 10);
      if (!isNaN(value)) {
        var cache = readViewCache();
        cache[postUrl] = value;
        writeViewCache(cache);
        updateViewElements(postUrl, value);
      }
    };

    var observer = new MutationObserver(update);
    observer.observe(target, { childList: true, characterData: true, subtree: true });
    update();
  }

  function setupAnalytics(meta) {
    var analytics = meta && meta.site && meta.site.analytics;
    if (!analytics || analytics.enabled === false) {
      STATE.analyticsConfig = { enabled: false };
      return;
    }
    STATE.analyticsConfig = { enabled: true, privacyNotice: analytics.privacyNotice };
    if (STATE.analyticsLoaded) {
      return;
    }
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    script.setAttribute('data-source', 'busuanzi');
    document.body.appendChild(script);
    STATE.analyticsLoaded = true;
  }

  function renderAnalyticsNotice(meta) {
    var notice = document.querySelector('[data-analytics-notice]');
    if (!notice) return;
    var analytics = meta && meta.site && meta.site.analytics;
    if (analytics && analytics.enabled) {
      notice.textContent = analytics.privacyNotice || 'View counts are collected anonymously via a third-party analytics service.';
      notice.hidden = false;
    } else {
      notice.hidden = true;
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Utilities                                                                  */
  /* -------------------------------------------------------------------------- */

  function debounce(fn, delay) {
    var timeoutId;
    return function () {
      var args = arguments;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        fn.apply(null, args);
      }, delay);
    };
  }

  function normalizePath(path) {
    if (!path) return '';
    return path.replace(/^\/+/, '').replace(/\/+/g, '/');
  }

  function resolveRelativeUrl(url) {
    if (!url) return '#';
    if (/^https?:/i.test(url) || url.indexOf('//') === 0) {
      return url;
    }
    if (url[0] === '#') {
      return url;
    }
    var link = document.createElement('a');
    link.href = url;
    return link.href;
  }

  function findPostByUrl(posts, path) {
    var normalized = normalizePath(path);
    for (var i = 0; i < posts.length; i += 1) {
      if (normalizePath(posts[i].url) === normalized) {
        return posts[i];
      }
    }
    return null;
  }

})(typeof window !== 'undefined' ? window : this);
