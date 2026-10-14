# Sanat Singh — Multi-page portfolio review draft

A static homepage with five dedicated case-study pages. No build step, framework, package installation or CMS is needed.

## Preview

Unzip the review package, keep all folders together, and double-click **index.html** in Chrome or Edge. All page images, fonts, styles and scripts are local. External profile links still need internet.

Alternatively, from this folder run `python -m http.server 8766 --bind 127.0.0.1`, then visit http://127.0.0.1:8766/ . Stop the server with Ctrl+C when finished. Python is optional; opening index.html is enough for review.

## Find the right file

- `index.html`: hero, About, five-card Selected Work gallery, supporting brands, Experience and Contact.
- `work/the-pharmassist.html`, `work/ksolves.html`, `work/magniclipper.html`, `work/knauf-india.html`, `work/guruji-astro.html`: the complete approved case studies, numbered 01–05, including images, metrics, disclosures and external links.
- `styles.css`: palette, font stack, spacing and motion tokens at the top, followed by named layout sections and responsive rules.
- `script.js`: mobile menu, brand-strip pause control, active navigation, timeline progress, the 1.65-second hero opening, visibility-aware ambient movement, delegated pointer interactions, one-time section reveals and formatted metric count-ups and experience printing.
- `assets/manifest.json`: source filename, brand, type, dimensions and usage for each supplied file. It documents assets; the page does not load this JSON at runtime.
- `ASSET-MAP.md`: readable inventory and naming/quality notes.

## Replace a project image

1. Open the corresponding case-study HTML file under `work/`; its project ID remains `pharmassist`, `ksolves`, `magni`, `knauf` or `guruji`.
2. Put the replacement in the matching folder under assets/projects.
3. Update both the image `src` and the enclosing link `href` to the new relative path.
4. Set `width` and `height` to the actual file dimensions. Update `alt` text and the caption to describe the actual work.
5. Keep text-heavy artwork uncropped; the shared CSS uses object-fit: contain.
6. Add or update its entry in assets/manifest.json and ASSET-MAP.md.

Existing WebP files do not need repeated compression. Prefer a 1000–1600px source for new detailed campaign work when available. Keep transparent logos transparent.

## Add another image

Within the relevant project's `.creative-grid`, copy a complete `<figure class="creative">...</figure>` block. Change its link, image path, actual dimensions, alt description and figcaption. The grid automatically stacks on phones. Keep only a curated selection in the main flow; additional evidence can go inside the existing case-details disclosure.

## Update a metric

Search for its exact number in the corresponding case-study file under `work/`. Update the number, label and reporting-period note together. Keep brand/page totals separate from personally attributable results. Do not convert MagniClipper sign-ups into sales or backers, or add Guruji campaign numbers without evidence. The figures remain ordinary HTML text. Major Pharmassist, Ksolves and MagniClipper values count up once on entering the viewport over 1.1 seconds; formatting is derived from the source text. The final figure remains stable for assistive technology. Reduced-motion visitors see the final value immediately.

## Update text

Edit homepage content in `index.html` and project content in the corresponding `work/*.html` file. Retain valid links. Each page has one h1; the project h1 retains the approved visual treatment. The content stays available when JavaScript is disabled.

## Add or replace a brand logo

Put a genuine logo file under assets/brands. Copy a link within the first `.brand-group`, use an existing section ID as its destination, and set the correct alt text and dimensions. Repeat the same item in the duplicate brand-group so both loops stay identical. The second group must retain `aria-hidden="true" inert` and its links `tabindex="-1"`.

`.logo-frame` uses contain sizing; add `.light` only when the original logo needs a light background to remain readable. Do not stretch, recolor or recreate logos. A text wordmark is the fallback for missing authentic files.

## Typography

Playfair Display regular and italic are self-hosted in assets/fonts with the SIL Open Font License. Sources are Google Fonts / fonts.gstatic.com; license source is google/fonts on GitHub. Only the Latin subsets are shipped.

Proxima Nova requires a licensed web-font file or authorized hosted-font setup from the owner. Until supplied, the primary stack is `"Proxima Nova", "Avenir Next", "Helvetica Neue", Arial, sans-serif`. No Proxima Nova web-font source was supplied; exact Proxima Nova rendering is not verified. Do not obtain the commercial font from unauthorized download sites.

## Motion and accessibility

The hero now reads “Beyond the scroll. Into the story.” Its opening finishes in approximately 1.65 seconds; text begins at readable opacity and links remain available immediately. The five platform marks have independent floating trajectories. Three are used on phones. Base composition, entrance, pointer response and ambient movement use separate nested layers so their transforms do not overwrite one another.

Desktop pointer movement is interpolated with one shared requestAnimationFrame loop, which stops when the response settles. Nearby marks respond with different strengths/directions. Portrait and artwork frames also respond to the cursor; the portrait uses translation only, preserving its proportions. Mobile layouts disable cursor transforms and retain gentler ambient motion. Resizing from desktop to phone clears pointer offsets.

Selected artwork frames continue moving by a few pixels while visible. Images keep their approved contain sizing; hover zoom is removed from these frames so campaign copy is not clipped. Capability and KPI accents animate gently, while body copy and final values remain stable. Major metrics still count up only once over 1.1 seconds. Grouped entrances remain short and do not delay each paragraph.

IntersectionObserver pauses ambient layers outside the viewport. Tab visibility pauses CSS motion and the pointer loop; active count-ups finish at their accurate final values when the tab is hidden. Reduced-motion visitors receive final content immediately with animation and pointer transforms disabled. The marquee retains its icon-only pause/play control, continuous 44-second loop, hover/focus pause and stable keyboard grid.

The phone menu closes via its Close button, link selection, outside click or Escape. Tab/Shift+Tab stay within its controls while open. Native details elements expose campaign contributions and career responsibilities. Full-size creative links work with keyboard and touch. The working print button now prints the experience section and expands its disclosures for print.

## GitHub Pages and publishing

The original repository has a root index.html and assets folder, with no tracked build configuration or .github/workflows file. Its live URL is https://sanattsingh.github.io/sanat.singh/ . This draft keeps the same static root structure and uses relative asset paths compatible with that project URL.

Local review branch: **design/multipage-portfolio**, based on the approved publication at main commit `fc13a4182900b41e4f01851caa0ae05a819ab56b`. This structural revision has not been pushed, merged or published.

After explicit approval, publish the chosen revision through the existing main-branch GitHub Pages configuration. Include the root files, the entire `work/` page directory and `assets/`. Styles, JavaScript and fonts remain shared at the root; nested pages use `../` asset paths and return to `../index.html#section`. No deployment configuration was changed.

The Ksolves webinar uses the approved redacted `assets/projects/ksolves/keda-webinar.webp` asset. Do not restore an unredacted source or the removed webinar caption. The Pharmassist is an ongoing independent brand collaboration from 2023–Present in the Experience timeline; it is not presented as conventional full-time employment.

## Content notes needing owner input later

- November 2021 career start is retained. Earlier employer, role and end date remain undocumented; no employer was inferred. The existing 5+ years claim was retained as requested; five completed years are reached in November 2026.
- Guruji's historical ₹1 campaign analytics are unavailable. Wider YouTube figures stay inside additional social/video work and are not attributed to that offer.
- The Pharmassist channel snapshot lacks a capture date; numbers are preserved as existing portfolio figures.
- Specific deliverables for Surgery Tours India and Shubham Graphics were not supplied, so those entries make no detailed performance claims.

See the companion verification report for actual browser coverage and limitations.
