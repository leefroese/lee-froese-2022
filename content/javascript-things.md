---
title: JavaScript Things
description: 'Random things in JavaScript that I have encountered lately.'
createdAt: 'February 21, 2022'
tags:
  - JavaScript
  - ES6
---

# JavaScript Things

Here's 3 recent issues I was faced with and how I solved them using JavaScript.

## Using `forEach` to loop through `.children` doesn't work!

`.children` returns an HTMLCollection which is an object. Despite it being array-like and returning a length, it is not actually an array. You can still use `forEach` to loop through the children, but need to convert them to an array first by using `Array.from`.

```
const children = document.getElementById('parent')
const childrenArray = Array.from(children)
childrenArray.forEach( child => { ... })
```

## Mega Menu's and delaying loading of images.

Mega menu's can be useful for certain websites and if they contain images, we can delay the loading of them to help pagespeed scores and loading times. Since these images aren't necessary on initial page load, we can load them once the menu is interacted with. Here's an example of how the HTML could be marked up.

```
<nav class="mega-menu" id="mega-menu">
  <ul>
    <li class="mega-menu__item">
      <a href="/link-1">Link 1</a>
      <div class="mega-menu__sub">
        <ul>
          <li>
            <a href="/sub-link-1a">
              <picture class="mega-menu__img">
                <source data-srcset="img/sub-link-1a.webp" type="image/webp">
                <source data-srcset="img/sub-link-1a.jpg" type="image/jpeg">
                <img data-src="img/sub-link-1a.jpg" alt="" width="400" height="250" />
              </picture>
              <span>Sub Link 1a</span>
            </a>
          </li>
          <li>
            <a href="/sub-link-1b">
              <picture class="mega-menu__img">
                <source data-srcset="img/sub-link-1b.webp" type="image/webp">
                <source data-srcset="img/sub-link-1b.jpg" type="image/jpeg">
                <img data-src="img/sub-link-1b.jpg" alt="" width="400" height="250" />
              </picture>
              <span>Sub Link 1b</span>
            </a>
          </li>
        </ul>
      </div>
    </li>
    <li class="mega-menu__item">
      <a href="/link-2">Link 2</a>
      <div class="mega-menu__sub">
        <ul>
          <li>
            <a href="/sub-link-2a">
              <picture class="mega-menu__img">
                <source data-srcset="img/sub-link-2a.webp" type="image/webp">
                <source data-srcset="img/sub-link-2a.jpg" type="image/jpeg">
                <img data-src="img/sub-link-2a.jpg" alt="" width="400" height="250" />
              </picture>
              <span>Sub Link 2a</span>
            </a>
          </li>
          <li>
            <a href="/sub-link-2b">
              <picture class="mega-menu__img">
                <source data-srcset="img/sub-link-2b.webp" type="image/webp">
                <source data-srcset="img/sub-link-2b.jpg" type="image/jpeg">
                <img data-src="img/sub-link-2b.jpg" alt="" width="400" height="250" />
              </picture>
              <span>Sub Link 2b</span>
            </a>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</nav>
```

This mega menu assumes that you have to click to expand the menus instead of using hover, but it can be adjusted for your needs. This also makes use of the above method of converting the `.children` HTMLCollection into an array as we're using the `<picture>` tag with multiple sources.

```
// load images function
function loadMegaMenuImages() {
  const menuPics = document.querySelectorAll('.mega-menu__img');
  menuPics.forEach(item => {
    const children = item.children;
    const childrenArray = Array.from(children);
    childrenArray.forEach( child => { // loop through children of picture element and update src / srcset of each
      const srcset = child.getAttribute('data-srcset');
      const src = child.getAttribute('data-src');
      if( srcset ) child.setAttribute('srcset', srcset);
      if( src ) child.setAttribute('src', src);
    });
  });
}

// run load images on click of menu
let megaMenuImages = false;
const megaMenu = document.getElementByID('mega-menu');
megaMenu.addEventListener("click", function( event ) {
  if( !megaMenuImages ) {
    megaMenuImages = true;
    loadMegaMenuImages();
  }
})
```


## An inventory problem.

I was recently tasked with an inventory problem and had 30 minutes to figure it out. I failed miserably initially. I decided to revist the problem one Staruday afternoon and was able to get it done in 30 minutes. Here's how I would go about it now.

```
const inventory = [
  { name: 'toronto', a: 5, b: 0, c: 2},
  { name: 'montreal', a: 6, b: 4, c: 0},
  { name: 'winnipeg', a: 7, b: 3, c: 5},
  { name: 'calgary', a: 2, b: 2, c: 4},
  { name: 'vancouver', a: 5, b: 5, c: 3}
];
```

Above is the inventory for each store. The keys 'a', 'b', 'c' are the different products available. Now I want to be able to input the items I need, and have the stores that have the available inventory to fulfill the order displayed. For example `{ a: 3, b: 1, c: 3}` would show me the stores that have this inventory available.

```


function getInventory( object ) {
  let locations = []

  const filterLocations = inventory.filter(item => item.a >= object.a && item.b >= object.b && item.c >= object.c) // a nice one liner using the filter method

  filterLocations.forEach( location => { locations.push(location.name) })

  return locations
}

getInventory({ a: 3, b: 1, c: 3});

// returns ["winnipeg","vancouver"]
```