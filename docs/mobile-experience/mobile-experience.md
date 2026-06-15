# Mobile Experience Guidelines

This document records the mobile principles now used for the site, especially service and editorial pages such as /m-signature.

## Research Summary

The mobile approach is based on accessibility and usability standards from WCAG 2.2, W3C mobile accessibility guidance, Apple HIG, Android/Material touch-target guidance, and NN/g mobile usability research.

Practical interpretation for this site:

- Use 44px as the minimum practical tap height for meaningful links and controls; prefer 48px for primary actions.
- Preserve Swiss-design restraint on mobile by reducing decorative grids, not by shrinking everything.
- Make mobile sections more focused than desktop sections. One primary idea per viewport is better than compressing a full desktop composition.
- Use `100dvh`/`100svh` for hero-like sections, but allow content sections to grow when text would otherwise be clipped.
- Validate with Playwright metrics: overflow, section heights, scroll height, touch-target heights, and desktop regression.

## Current /m-signature Mobile Optimization

The mobile pass on /m-signature introduced a dedicated `@media (max-width: 640px)` layer. Desktop rules were preserved.

Measured outcome on a 390x844 smartphone viewport:

- Horizontal overflow: 0
- Hero height: 844px
- Scroll height before optimization: about 12,237px
- Scroll height after optimization: about 10,264px
- Main route targets such as sector links now meet the 44px practical target

## CSS Pattern

Mobile-only refinements should generally live near the end of the component/page style block:

```css
@media (max-width: 640px) {
  .page {
    --mobile-section: clamp(4.5rem, 14vw, 5.75rem);
  }

  .page :global(.primary-action),
  .page summary,
  .page .secondary-link {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }
}

@supports (height: 100dvh) {
  @media (max-width: 640px) {
    .hero {
      min-height: 100dvh;
    }
  }
}
```

## QA Checklist

Before finishing a mobile optimization:

- Run `npm run check`.
- Run `npm run build` for structural changes.
- Use Playwright at 390x844 and at least one desktop viewport.
- Confirm `document.documentElement.scrollWidth - document.documentElement.clientWidth === 0`.
- List interactive targets under 44px and fix those inside the scoped page when they are real user actions.
- Report remaining small targets if they belong to global nav/footer or another component outside scope.

## References

- WCAG 2.2 Target Size Minimum: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WCAG 2.2 Target Size Enhanced: https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html
- W3C Mobile Accessibility: https://www.w3.org/WAI/standards-guidelines/mobile/
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Android touch target guidance: https://support.google.com/accessibility/android/answer/7101858
- Material Design accessibility basics: https://m3.material.io/foundations/accessible-design/accessibility-basics
- Nielsen Norman Group mobile content: https://www.nngroup.com/articles/mobile-content/
