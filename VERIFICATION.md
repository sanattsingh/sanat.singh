# Sanat Singh — final motion refinement review

The approved V3.1 design remains in place. The hero headline now reads **Beyond the scroll. Into the story.** The opening finishes in about **1.65 seconds**. Selected visual elements continue moving and respond to the cursor after their entrances finish; long-form copy and verified final numbers stay stable.

The hero uses separate base, entrance, pointer and ambient layers. Five independently phased icon trajectories remain visible on desktop; three gentler trajectories serve phones. The portrait has ongoing movement and desktop pointer translation. Campaign frames have varied, visibility-aware motion and mild pointer depth without cropping their artwork. Capability numbers, section dividers and KPI accents provide small ongoing cues. The marquee retains its approved appearance and icon-only control.

Local working branch: **design/portfolio-v3**. Changes are saved in the working tree and remain uncommitted and unpushed. No merge or publication occurred. Main remains unchanged. Changed files for this pass: **index.html, styles.css, script.js, README.md, VERIFICATION.md**. No assets or dependencies were added to the website. The source comparison patch is `final-motion-source-changes.patch` in the outputs folder.

## Observed browser checks

- Fresh-load hero text/CTAs began at at least 65% opacity, with no blank waiting screen. Headline and CTA were fully settled by the approximately 1.5-second sample; the lower divider completed at 1.65 seconds.
- A pointer action at 136ms changed the icon pointer transform while the independent ambient transform was also moving. Distinct icon responses were measured at different cursor positions. On leaving the hero, offsets decayed to 0 smoothly.
- The hero's ambient layer was running and changed its position at approximately 4.8 and 19.6 seconds after loading.
- The About portrait remained running after a 20-second pause at the same scroll position. Pointer translation and the capability hover response were observed. Capability accent phases also changed over that interval.
- All five featured projects had running frame transforms that changed between timed samples. The same check passed on mobile; mobile pointer layers remained neutral.
- Flagship pointer depth was observed on the product frame. Its full-size product-range link opened the actual local asset (1254 x 1254), retaining the existing interaction.
- The marquee uses equal 3108px groups and a 6216px track on desktop. At the actual loop seam, the second group's leading edge continued into the first group's equivalent edge with the expected travel distance. Pause held the exact transform over a timed interval; resume continued from that position.
- All ten original KPI values were observed after their count-ups, with correct K/M abbreviations, decimal precision, comma grouping, percent and plus signs. Hover changed the metric treatment while its final value stayed stable.
- All five case disclosures opened and closed at 390px, with their labels and tighter spacing intact. The phone menu opens, closes on Work selection, and releases its scroll lock. The conversation CTA reached #contact below the header.
- Measured current layouts at **320, 390, 768, 1024 and 1440px**: no page overflow or overflowing headings/major metrics. Portrait width remains 176.7px at 390px and 240px on desktop. Desktop hero height remains 620.9px.
- Full mobile scrolling found no failed visible images. The final browser session reported no console warnings or errors. JavaScript syntax and source/whitespace checks passed.
- Source comparison confirms identical navigation header markup and behavior, section IDs/order, all other visible portfolio text, case content, links, image references and asset bytes. Only the requested headline and its matching social metadata changed. No duplicate IDs or broken local anchors/assets were found.

## Preview and captures

Extract **sanat-portfolio-final-motion.zip**, then double-click **index.html** in Chrome or Edge. Keep assets, styles.css and script.js together. No installation/build is needed. Refresh to replay the brief opening; move the mouse across the hero and artwork to review depth. Scroll naturally, then pause on sections to inspect their ongoing movement.

Fresh desktop, tablet and phone screenshots accompany the ZIP. `final-motion-hero.gif` and `final-motion-pharmassist.gif` contain actual sampled browser captures (about 7.4 and 8.8 seconds). They are lower-frame-rate review sequences, not a measurement of the site's rendering frame rate. They are deliverables only and are not used by the website.

## Testing limits

Physical phones, Safari/Firefox, OS-level reduced-motion emulation and screen-reader announcements were not tested. Reduced-motion and hidden-tab paths were inspected in the source; the preview tool does not expose the needed OS/tab-emulation controls. External destination availability was not retested; all original URLs are unchanged. The local full-size artwork interaction was exercised. No external contact application was launched or message sent. Low-end device frame rates were not benchmarked. The existing font-source limitation remains unchanged.

The temporary localhost QA server is stopped after verification. The extracted ZIP is the durable working preview. Stop here for owner review before publication.
