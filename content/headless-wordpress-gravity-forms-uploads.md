---
title: Gravity Forms Uploads with Headless WordPress
description: 'How to get file uploads working with a headless WordPress and Gravity Forms setup'
createdAt: 'July 23, 2022'
tags:
  - Gravity Forms
  - File Uploads
  - Headless WordPress
  - Nuxt
  - Vue
  - Apollo
  - GraphQL
---

# Gravity Forms Uploads with Headless WordPress

I found myself struggling through the documentation for getting file uploads in [Gravity Forms](https://www.gravityforms.com/) in a headless WordPress setup recently. If you're not familiar with headless WordPress, it involves decoupling WordPress so you're using WordPress for it's back-end (database and content management), and a separate front-end framework (Nuxt / Next / Gatsby / etc) for the presentation layer.

## 1. WordPress Setup

You will need to make sure you have these plugins installed in WordPress in addition to Gravity Forms:
- [WPGraphQL](https://wordpress.org/plugins/wp-graphql/)
- [WPGraphQL Gravity Forms](https://github.com/harness-software/wp-graphql-gravity-forms)
- [WPGraphQL Upload](https://github.com/dre1080/wp-graphql-upload).

Once you have a form created in Gravity Forms with one or multiple file upload fields, you're ready to start on the front-end.

## 2. File Upload Support

The [WPGraphQL Upload](https://github.com/dre1080/wp-graphql-upload) plugin adds upload support on the WordPress server side. It's as simple as installing the plugin in WordPress and activating it.

We also need to add upload support to the front-end using [Apollo Upload Client](https://github.com/jaydenseric/apollo-upload-client
). You can run `npm install apollo-upload-client --save` to add this to your Vue or React project. To use `apollo-upload-client` in Nuxt, you need to import the package and use the `createUploadLink` function in your `apollo` configuration for the WordPress client. Here's an example of how to do this.

```js
//nuxt.config.js
export default {
  ...
  apollo: {
    wordpressClient: '~/queries/config.js',
  }
}
```

```js
//queries/config.js
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'
import introspectionResult from '~/src/fragmentTypes.json'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: introspectionResult,
});

export default () => {
  return {
    link: createUploadLink({ uri: "https://domain.com/graphql"}),
    connectToDevTools: true,
    cache: new InMemoryCache({ fragmentMatcher }),
    defaultHttpLink: false,
  }
}
```


## 3. Display Your Form

In this instance, I am using [Nuxt.js](https://nuxtjs.org/) for the front-end. If you have multiple forms on your site, you may want to create a `GForm.vue` component that is flexible and can be re-used to display any Gravity Forms form on your site. I can't take credit for creating this component, that was done by [Nick](https://nicholasbuhr.com/).

First, we need to make our call to the GraphQL WordPress endpoint and get the form data using the `gfForm` [query](https://github.com/harness-software/wp-graphql-gravity-forms/blob/develop/docs/querying-forms.md).

```graphql
# form.gql
query form($id: ID!) {
  gfForm(id: $id, idType: DATABASE_ID) {
    id
    title
    button {
      text
    }
    confirmations {
      message
      type
      id
    }
    formFields {
      nodes {
        id
        type
        ... on TextField {
          id
          label
        }
        ... on WebsiteField {
          id
          label
        }
        ... on EmailField {
          id
          label
        }
        ... on TextAreaField {
          id
          label
        }
        ... on SelectField {
          id
          label
          choices {
            value
          }
        }
        ... on CheckboxField {
          id
          label
          choices {
            isSelected
            text
            value
          }
        }
        ... on RadioField {
          id
          label
          choices {
            isSelected
            text
            value
          }
        }
        ... on FileUploadField {
          id
          label
        }
        ... on SectionField {
          id
          label
        }
      }
    }
  }
}
```

Next, we can create our `GForm.vue` component that displays the form.


```vue
<!-- GForm.vue -->
<template>
   <form v-on:submit.prevent="submitForm" class="contact-form [ flex flex-wrap ]" :data-id="formid">
      <slot v-for="(field, index) in data.gfForm.formFields.nodes">

        <div v-if="field.type === 'SECTION'" :key="field.id">{{ field.label }}</div>

        <div v-if="field.type === 'TEXT'" :key="field.id">
          <label :for="`field-${index}`">{{ field.label }}</label>
          <div class="field" :data-id="field.id" :data-type="field.type">
            <input :id="`field-${index}`" type="text" required />
          </div>
        </div>

        <div v-if="field.type === 'EMAIL'" :key="field.id">
          <label :for="`field-${index}`">{{ field.label }}</label>
          <div class="field" :data-id="field.id" :data-type="field.type">
            <input :id="`field-${index}`"  type="email" required />
          </div>
        </div>

        <div v-if="field.type === 'WEBSITE'" :key="field.id">
          <label :for="`field-${index}`">{{ field.label }}</label>
          <div class="field" :data-id="field.id" :data-type="field.type">
            <input :id="`field-${index}`"  type="url" required />
          </div>
        </div>

        <div v-if="field.type === 'CHECKBOX'" :key="field.id">
          <label>{{ field.label }}</label>
          <div class="field checkbox-field" :data-id="field.id" :data-type="field.type">
            <label v-for="(choice, index) in field.choices" :key="index">
              <input type="checkbox" @change="checkboxSelected" :value="choice.value" :name="field.type+field.id" />
              <span v-html="choice.value" />
            </label>
          </div>
        </div>

        <div v-if="field.type === 'RADIO'" :key="field.id">
          <label>{{ field.label }}</label>
          <div class="field radio-field" :data-id="field.id" :data-type="field.type">
            <label v-for="(choice, index) in field.choices" :key="index">
              <input type="radio" @change="radioSelected" :value="choice.value" :name="field.type+field.id" />
              <span v-html="choice.value" />
            </label>
          </div>
        </div>

        <div v-if="field.type === 'SELECT'" class="field-wrap [ w-full lg:w-1/2 ]" :key="field.id">
          <label :for="`field-${index}`">{{ field.label }}</label>
            <div class="field" :data-id="field.id" :data-type="field.type">
            <select :id="`field-${index}`">
              <option v-for="(choice, index) in field.choices" :key="index">
                {{ choice.value }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="field.type === 'FILEUPLOAD'" class="field-wrap [ w-full lg:w-1/2 ]" :key="field.id">
          <label :for="`field-${index}`">{{ field.label }}</label>
          <div class="field" :data-id="field.id" :data-type="field.type">
            <input :id="`field-${index}`" type="file" />
          </div>
        </div>

        <div v-if="field.type === 'TEXTAREA'" class="field-wrap [ w-full ]" :key="field.id">
          <label :for="`field-${index}`">{{ field.label }}</label>
          <div class="field" :data-id="field.id" :data-type="field.type">
            <textarea :id="`field-${index}`" required></textarea>
          </div>
        </div>

      </slot>

      <div class="field-wrap">
        <button data-label="Send" class="btn">
          <span class="btn-label">Send</span>
        </button>
      </div>

      <template v-if="data.gfForm.confirmations">
        <slot v-for="(msg) in data.gfForm.confirmations">
          <div v-if="msg.type === 'MESSAGE'" :key="msg.id" class="message invisible" v-html="msg.message"></div>
        </slot>
      </template>

    </form>
</template>
```

Lastly, we can now use our form component in pages like so.

```vue
<!-- contact.vue -->
<template>
  <ApolloQuery :query="require('~/queries/forms/form.gql')" :variables="{ id: item.formId }">
    <template v-slot="{ result: { loading, error, data} }">
      <g-form v-if="data" :data="data" :formid="item.formId" />
    </template>
  </ApolloQuery>
</template>
```


## 4. Submitting the Form

To submit the form, we need to package up the field values and send it to a GraphQL mutation. Lets start with the [GraphQL mutation](https://github.com/harness-software/wp-graphql-gravity-forms/blob/develop/docs/submitting-forms.md) `submitGfForm`. We define the input as a variable to allow us to add this data dynamically.

```graphql
# submit-form.gql
mutation submitForm($input: SubmitGfFormInput!) {
  submitGfForm(input: $input) {
    confirmation {
      type
      message
      url
    }
    errors {
      id
      message
    }
  }
}
```

In our `GForm.vue` component, we have a method called `submitForm` that is called when a user submits the form. This method compiles all of the field values and calls the WordPress API using Apollo.

```js
// import gql mutation
import SubmitForm from "~/queries/mutations/forms/submit-form.gql";

export default {
  ...
  methods: {
    submitForm: function(e) {
      e.preventDefault()

      // Build Input for mutation
      let gravityInput = new Object
      gravityInput['id'] = Number(e.target.dataset.id)
      gravityInput['fieldValues'] = []
      gravityInput['saveAsDraft'] = false

      // Loop through fields and set field values for mutation
      let fields = e.target.querySelectorAll('.field')
      fields.forEach(field => {

        const fieldType = field.dataset.type.toLowerCase()
        let gravityValues = {}

        // Include ID data for fields other than the file upload (we don't want this for blank file upload fields as it casues a json error)
        if(fieldType != 'fileupload') {
          gravityValues['id'] = Number(field.dataset.id)
        }

        // Set the value within the object based on type
        if(fieldType == 'email') {
          gravityValues['emailValues'] = {}
          gravityValues['emailValues']['value'] = field.firstChild.value
        }
        else if(fieldType == 'select') {
          let select = field.children.item(0)
          select.options.forEach((choice, index) => {
            if (choice.selected) {
              gravityValues['value'] = choice.value;
            }
          })
        }
        else if(fieldType == 'radio') {
          let selectedChoices = field.querySelectorAll('input:checked')
          selectedChoices.forEach((choice, index) => {
            gravityValues['value'] = choice.value
          })
        }
        else if(fieldType == 'checkbox') {
          let selectedChoices = field.querySelectorAll('input:checked')
          let checkboxValues = []
          selectedChoices.forEach((choice, index) => {
            let checkboxValue = {}
            let checkboxIdPrefix = field.dataset.id
            let checkboxIdSuffix = index+1
            let checkboxId = checkboxIdPrefix + '.' + checkboxIdSuffix
            checkboxValue['inputId'] = Number(checkboxId)
            checkboxValue['value'] = choice.value
            checkboxValues.push(checkboxValue)
          })
          gravityValues['checkboxValues'] = checkboxValues;
        }
        else if(fieldType == 'fileupload') {
          if( field.firstChild.files.length > 0) {
            gravityValues['id'] = Number(field.dataset.id)
            gravityValues['fileUploadValues'] = field.firstChild.files
          }
        }
        else {
          gravityValues['value'] = field.firstChild.value;
        }

        // Push to fieldsValues array if non empty object
        if( gravityValues && Object.keys(gravityValues).length != 0 ) {
          gravityInput['fieldValues'].push(gravityValues)
        }
      })

      // send data to GForms entries
      this.$apollo.mutate({
        mutation: SubmitForm,
        variables: {
          input: gravityInput
        }
      }).then(response => {
        // Do stuff like displaying messages here
        console.log(response)
      }).catch((error) => {
        // Error
        console.error(error)
      })
    }
  }
}
```


## Wrap Up

You should now see file uploads in your Gravity Forms entries! You'll want to add some form of validation to your form, but this basic example should get you able to submit form data to Gravity Forms as entries.