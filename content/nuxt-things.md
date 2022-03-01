---
title: Nuxt Things
description: 'Random things in Nuxt that I have encountered lately.'
createdAt: 'Mar 1, 2022'
tags:
  - Nuxt.js
  - Vue.js
  - JavaScript
---

# Nuxt Things

Here's 3 recent issues I was faced with and how I solved them using JavaScript.

## Dynamic Routing and Nested Routes

The Nuxt documentation is quite good for [Dynamic Nested Routes](https://nuxtjs.org/docs/features/file-system-routing#dynamic-nested-routes), but I found that having a folder and file with the same dynamic name didn't work.

```
shop/
--collection/
---_tag.vue
---_tag/
----page/
-----_page.vue
```

This is the structure I started with. However I found that the `_tag.vue` was being used when going to a route like `/shop/collection/rugs/page/2`. I updated the structure slightly by changing the `_tag/` folder to `_slug/`. My folder and file structure now looked like:

```
shop/
--collection/
---_tag.vue
---_slug/
----page/
-----_page.vue
```
Now when I visisted `/shop/collection/rugs/page/2` I was getting the `_page.vue` template as expected. If anyone has any more insight on why this happens, let me know!