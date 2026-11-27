// Bargain Friday: renders the deal board, search and filters.
// All state lives in the page's controls; the URL query string mirrors
// it (?q=, ?category=, ?store=, ?discount=, ?sort=, ?real=1) so a
// filtered view can be linked and screenshotted.

import { DEALS, CHECKED_AT, discountPct, dollarsSaved, VERDICTS } from "./deals.js";

const grid = document.getElementById("deal-grid");
const countLine = document.getElementById("result-count");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const storeSelect = document.getElementById("store");
const discountSelect = document.getElementById("discount");
const sortSelect = document.getElementById("sort");
const realOnlyBox = document.getElementById("real-only");
const emptyState = document.getElementById("empty-state");

const money = (n) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\.00$/, "");

function checkedLabel(iso) {
  const d = new Date(iso);
  const day = d.getUTCDate();
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getUTCMonth()];
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${day} ${month} ${d.getUTCFullYear()}, ${hh}:${mm} UTC`;
}

function fillOptions(select, values) {
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  }
}

function renderStats() {
  const total = DEALS.length;
  const avg = Math.round(DEALS.reduce((sum, d) => sum + discountPct(d), 0) / total);
  const saved = DEALS.reduce((sum, d) => sum + dollarsSaved(d), 0);
  const stores = new Set(DEALS.map((d) => d.store)).size;
  const realCount = DEALS.filter((d) => d.verdict === "real").length;
  document.getElementById("stat-deals").textContent = String(total);
  document.getElementById("stat-avg").textContent = avg + "%";
  document.getElementById("stat-saved").textContent = money(saved);
  document.getElementById("stat-stores").textContent = String(stores);
  document.getElementById("stat-real").textContent = String(realCount);
  document.getElementById("checked-note").textContent =
    "All " + total + " prices checked " + checkedLabel(CHECKED_AT) + " (14:00 WIB) — Black Friday, 27 Nov 2026.";
}

function dealCard(deal) {
  const pct = discountPct(deal);
  const verdict = VERDICTS[deal.verdict];
  const card = document.createElement("article");
  card.className = "deal";
  card.dataset.id = deal.id;

  const top = document.createElement("div");
  top.className = "deal-top";
  const cat = document.createElement("span");
  cat.className = "tag";
  cat.textContent = deal.category;
  const store = document.createElement("span");
  store.className = "store";
  store.textContent = deal.store;
  top.append(cat, store);

  const title = document.createElement("h2");
  title.textContent = deal.title;

  const prices = document.createElement("p");
  prices.className = "prices";
  const now = document.createElement("span");
  now.className = "now";
  now.textContent = money(deal.price);
  const was = document.createElement("s");
  was.className = "was";
  was.textContent = money(deal.was);
  const badge = document.createElement("span");
  badge.className = "off";
  badge.textContent = "−" + pct + "%";
  prices.append(now, " ", was, " ", badge);

  const saved = document.createElement("p");
  saved.className = "saved";
  saved.textContent = "You save " + money(dollarsSaved(deal)) + " vs the usual price.";

  const verdictEl = document.createElement("p");
  verdictEl.className = "verdict verdict-" + deal.verdict;
  const verdictLabel = document.createElement("strong");
  verdictLabel.textContent = verdict.label + ": ";
  verdictEl.append(verdictLabel, document.createTextNode(deal.evidence));

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = "Checked " + checkedLabel(deal.checked) + " · Source: " + deal.source;

  const link = document.createElement("a");
  link.className = "buy";
  link.href = deal.url;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "View at " + deal.store + " ↗";

  card.append(top, title, prices, saved, verdictEl, meta, link);
  return card;
}

function readState() {
  return {
    q: searchInput.value.trim().toLowerCase(),
    category: categorySelect.value,
    store: storeSelect.value,
    discount: Number(discountSelect.value),
    sort: sortSelect.value,
    realOnly: realOnlyBox.checked,
  };
}

function applyFilters(state) {
  let list = DEALS.filter((deal) => {
    if (state.q) {
      const hay = (deal.title + " " + deal.store + " " + deal.category).toLowerCase();
      if (!hay.includes(state.q)) return false;
    }
    if (state.category !== "All categories" && deal.category !== state.category) return false;
    if (state.store !== "All stores" && deal.store !== state.store) return false;
    if (discountPct(deal) < state.discount) return false;
    if (state.realOnly && deal.verdict !== "real") return false;
    return true;
  });
  const by = {
    discount: (a, b) => discountPct(b) - discountPct(a),
    saving: (a, b) => dollarsSaved(b) - dollarsSaved(a),
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    name: (a, b) => a.title.localeCompare(b.title),
  };
  list = [...list].sort(by[state.sort] || by.discount);
  return list;
}

function render() {
  const state = readState();
  const list = applyFilters(state);
  grid.replaceChildren(...list.map(dealCard));
  countLine.textContent =
    "Showing " + list.length + " of " + DEALS.length + " deals" +
    (state.q ? ' for "' + searchInput.value.trim() + '"' : "") + ".";
  emptyState.hidden = list.length !== 0;
  const params = new URLSearchParams();
  if (state.q) params.set("q", searchInput.value.trim());
  if (state.category !== "All categories") params.set("category", state.category);
  if (state.store !== "All stores") params.set("store", state.store);
  if (state.discount) params.set("discount", String(state.discount));
  if (state.sort !== "discount") params.set("sort", state.sort);
  if (state.realOnly) params.set("real", "1");
  const query = params.toString();
  history.replaceState(null, "", query ? "?" + query : location.pathname);
}

function presetFromUrl() {
  const params = new URLSearchParams(location.search);
  if (params.get("q")) searchInput.value = params.get("q");
  if (params.get("category")) categorySelect.value = params.get("category");
  if (params.get("store")) storeSelect.value = params.get("store");
  if (params.get("discount")) discountSelect.value = params.get("discount");
  if (params.get("sort")) sortSelect.value = params.get("sort");
  if (params.get("real") === "1") realOnlyBox.checked = true;
}

function init() {
  const categories = [...new Set(DEALS.map((d) => d.category))].sort();
  const stores = [...new Set(DEALS.map((d) => d.store))].sort();
  fillOptions(categorySelect, categories);
  fillOptions(storeSelect, stores);
  presetFromUrl();
  renderStats();
  render();
  for (const el of [searchInput, categorySelect, storeSelect, discountSelect, sortSelect, realOnlyBox]) {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  }
}

init();
