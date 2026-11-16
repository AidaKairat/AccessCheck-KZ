# AccessCheck KZ: AI for an Accessible Kazakhstan

A single-page research website about accessibility barriers for people with disabilities in Kazakhstan, with a prototype of a three-level photo assessment (visual presence, standards compliance, functional usability).

Plain HTML, CSS and JavaScript. No build step and no libraries.

## Publish on GitHub Pages

1. Put these files in the root of the `AccessCheck-KZ` repository, keeping the folders:
   ```
   index.html
   css/styles.css
   js/data.js  js/charts.js  js/demo.js  js/main.js
   .nojekyll
   README.md
   ```
2. On GitHub open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. After a minute the site is live at `https://aidakairat.github.io/AccessCheck-KZ/`.

To preview on your computer, open `index.html` in a browser.

## Where to edit

| To change | Edit |
|---|---|
| Statistics, chart data, the three research topics and six readings, references | `js/data.js` |
| Text of the sections | `index.html` |
| Colours and type | the `:root` block at the top of `css/styles.css` |
| Assessment logic | `js/demo.js` |

Every number in `js/data.js` carries a `ref` that points to an entry in the `REFS` list, so a figure and its source stay together.

## Before you present

Search `index.html` for `class="placeholder"`. Each one marks evidence that could not be verified and needs to be filled in or removed:

- the adapted share of facilities for each region (the map gives only the number registered)
- in "Current research": the relevance line for each source, and your own debates and gaps
- numeric limits from SP RK 3.06-101-2012 (ramp slope, widths, threshold)
- costs not estimated (training, labelling, development, fixing barriers)
- your own statement on how you used AI

## Honesty notes

- The prototype runs **no AI model**. The person using it makes every judgement. Only the image-quality check is computed, from pixel values in the browser. Photos are never uploaded.
- Cost outputs are calculations from stated inputs. Inputs tagged "our assumption" are not evidence.
- Figures for reference [14] were read from the authors' conference slides. Check them against the paper before citing.
- The site's code and first-draft text were generated with Claude (Anthropic) on 15 November 2026.
