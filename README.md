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
| Statistics, chart data, the three research topics and seven readings, references | `js/data.js` |
| Text of the sections | `index.html` |
| Colours and type | the `:root` block at the top of `css/styles.css` |
| Assessment logic | `js/demo.js` |
| Three-level explorer text and labels | `explorer` in `js/data.js` |
| Key findings beside the regional chart | `findN` and `find` in `js/data.js` |

Every number in `js/data.js` carries a `ref` that points to an entry in the `REFS` list, so a figure and its source stay together.

## Honesty notes

- The prototype runs **no AI model**. The person using it makes every judgement. Only the image-quality check is computed, from pixel values in the browser. Photos are never uploaded.
- Cost outputs are calculations from stated inputs. Inputs tagged "our assumption" are not evidence.
- The site's code and first-draft text were generated with Claude (Anthropic) on 15 November 2026.
