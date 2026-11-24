<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Custom card designs accept validated external HTTPS image URLs; legacy private-bucket designs remain supported through signed URLs in businesses.card_template. Why: preserves public card RPC compatibility while supporting link-based designs.
- Business logos accept validated external HTTPS URLs or private business-logos uploads scoped to the business ID. Why: supports both image sources without making the bucket public.
- Public card and join screens use versioned RPCs when their returned row shape grows. Why: PostgreSQL cannot replace a function while changing its OUT row type without a breaking drop.
- Customer mascots are generated deterministically from each card ID in the frontend. Why: every customer stays visually distinct without storing extra personal data.
- Theme and necessary-storage notice state are client-hydrated in the shared root provider. Why: keeps all screens consistent without SSR storage mismatches.
- Public commercial and operator settings use the existing admin-protected app_settings table; legal text renders as plain JSX. Why: avoids duplicating permissions or exposing HTML injection.
- Admin legal fields and public notices share a normalized settings model with explicit missing values; costs and commercial terms are separate entries. Why: prevents invented legal information and keeps publication consistent.
- New customer registration uses a versioned consent-recording RPC while retaining the legacy RPC for published-client compatibility. Why: records acceptance without interrupting existing clients; legacy creation is not proof of consent.

- This distribution uses TanStack Router with a Vite browser entry and repository-aware URLs; data and authentication remain in the existing hosted backend because Pages cannot execute server code.
