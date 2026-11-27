# black-friday-deal-finder-01-entry

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/bebek22-jpg/black-friday-deal-finder-01-entry/rank.svg)](https://make.fun/leaderboard/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/bebek22-jpg/black-friday-deal-finder-01-entry/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

Bargain Friday — a static deal-finder site of 28 real Black Friday deals, found and checked on Black Friday itself (27 Nov 2026) at Amazon, Best Buy, Walmart, Target and Kate Spade Outlet. Every deal shows its store link, sale price, usual price, discount and check time, plus an honest "real deal?" verdict. Search and filters by category, store and discount all work; the board sorts by biggest discount, biggest saving, price or name.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network requests at runtime: `app/` is plain static files (HTML, CSS, ES modules) and the deals live in `app/deals.js`. `main.ts` (Node 22) hands the entry in — it copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

See [DEALS.md](DEALS.md) for the check log: every price, its source, and when it was read.

---

<sub>Entered on [make.fun](https://make.fun/?ref=bebek22&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
