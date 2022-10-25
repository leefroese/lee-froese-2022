---
title: Using Netlify Functions to Get Around CORS Fetch Errors
description: 'If you run into CORS errors when using external APIs, you can use Netlify Functions to fetch data from APIs without CORS issues.'
createdAt: 'Oct 25, 2022'
tags:
  - JS Fetch API
  - Node Fetch
  - Netlify Functions
  - JavaScript
  - Nuxt
  - Vue
---

# Using Netlify Functions to Get Around CORS Fetch Errors

Recently there was a project that required working with [Recharge's Subscription](https://rechargepayments.com/) app in [Shopify](https://www.shopify.com/). As it's a headless site, I needed to work with [Recharge's API](https://developer.rechargepayments.com/2021-11). Their API is a backend API and doesn't allow direct communication with frontend technologies like JavaScript and NuxtJS. Because of this I had to setup middleware using Netlify Functions and Node Fetch to call the Recharge API and allow me to pass the data to the NuxtJS frontend.

## 1. Getting Started

Install Netlify CLI if you haven't already.

`npm install netlify-cli -g`

Next, create the Netlify Function.

`netlify functions:create your-function-name`

Select `JavaScript` for the language and `javascript-hello-world` for the template.

Once the function has been generated, you can then install [Node Fetch](https://www.npmjs.com/package/node-fetch) which will allow us to use the Fetch API in Node.js.

`npm install node-fetch`

## 2. Create a netlify.toml File

Create a `netlify.toml` file in the root of your project. Here's what mine looks like with Netlify Functions capabilities.

```
[dev]
   command = "npm run dev"

[build]
  command = "npm run generate"
  publish = "dist"
  functions = "functions"  # directs netlify to where your functions directory is located

[[headers]]
  # Define which paths this specific [[headers]] block will cover.
  for = "/*"
    [headers.values]
    Access-Control-Allow-Origin = "*"

[[plugins]]
  package = "@netlify/plugin-functions-install-core"
```

## 3. Add Environment Variables

If you're already using [environment variables](https://medium.com/chingu/an-introduction-to-environment-variables-and-how-to-use-them-f602f66d15fa), great! If not, you'll want to create a `.env` file in the root of your project. In your `.env` file, you can then add variables for the API url, API key, etc. In the case of Recharge, I'll add the following:

```env
RECHARGE_URL=https://api.rechargeapps.com
RECHARGE_API_KEY=your_api_key_here
```

## 4. Write Your Netlify Function

Open the JavaScript file in `functions/your-function-name/` that was generated in step 1. First we need to add `node-fetch`, initialize the `Headers` class and add our enviroment variables.

```js
import fetch from 'node-fetch'
const { Headers } = fetch
const { RECHARGE_URL, RECHARGE_API_KEY } = process.env
```

We can then setup the headers meta that we need to pass to the API using the `node-fetch` Headers class.

```js
const meta = {
  'Accept': 'application/json',
  'X-Recharge-Access-Token': RECHARGE_API_KEY,
}
const headers = new Headers(meta)
```

Now that we have our inital setup done, we can write our API call.

```js
const handler = async() => {
  try {
    const response = await fetch( `${RECHARGE_URL}/products`, { method: 'GET', headers: headers});
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}
```

All together, the Netlify Function should look something like this.

```js
import fetch from 'node-fetch'
const { Headers } = fetch
const { RECHARGE_URL, RECHARGE_API_KEY } = process.env

const meta = {
  'Accept': 'application/json',
  'X-Recharge-Access-Token': RECHARGE_API_KEY,
}
const headers = new Headers(meta);

const handler = async() => {
  try {
    const response = await fetch( `${RECHARGE_URL}/products`, { method: 'GET', headers: headers});
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
```


## 5. Using Our Function to Retrieve Data

The last step is to use the Fetch API to call our Netlify Function. This in turn will pass data from the Recharge API to the frontend, in this case NuxtJS. In a VueJS component, I can create a `method` and call the method when needed.

```js
async getRechargeProducts() {
  try {
    const response = await fetch('/.netlify/functions/recharge-get-products')
    const data = await response.json()
    console.log(`data`, data)
    return data;
  } catch(e) {
    console.log(`error`, e)
    return e;
  }
}
```

The above example will then display a products object from Recharge in the developer console. You can extend this in any way you need.


## Wrap Up

I found Netlify Functions to be extremely helpful when dealing with CORS errors from external APIs. Their functions are easy to setup and allow you to create a proxy for querying APIs to avoid CORS errors.