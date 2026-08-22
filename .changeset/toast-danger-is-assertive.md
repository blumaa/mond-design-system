---
"@mond-design-system/react": minor
---

Toast: a danger toast is announced assertively.

Every toast was a polite `status`, which queues the message behind whatever the
screen reader is already saying. For a refusal that is the wrong order: the
thing the reader asked for did not happen, and they are about to carry on as
though it did. A `danger` toast is now `role="alert"`; neutral and success stay
`status`, and the rest of the system already read this way — ConfirmDialog's
error line and UploadProgress's failure are both alerts.
