---
title: Simple Form Validation in Vue
description: 'How to setup simple form validation without a library or other dependancies for Vue.js'
createdAt: 'February 15, 2023'
tags:
  - Form validation
  - Vue.js
  - Javascript
---

# Simple Form Validation in Vue

Adding some simple validation for forms is important to ensure you're not receiving blank or useless data for your forms. It's also pretty easy to setup! This can be used for static forms or forms that integrate with an API such as Jotform.

## 1. Form Markup

```vue
<template>
  <form>
    <p>
      <label for="fullName">Full Name<sup>*</sup></label>
      <input id="fullName" class="required" type="text" name="fullName" v-model="form.fullName" required />
    </p>
    <p>
      <label for="email">Email<sup>*</sup></label>
      <input id="email" class="required" type="email" name="email" v-model="form.email" placeholder="name@domain.com" required />
    </p>
    <p>
      <label for="phone">Phone<sup>*</sup></label>
      <input id="phone" type="tel" name="phone" v-model="form.phone" placeholder="000-000-0000" />
    </p>
    <p>
      <label for="date">Date</label>
      <input id="date" type="date" name="date" v-model="form.date" placeholder="yyyy-mm-dd" />
    </p>
    <p>
      <label for="subject">Subject<sup>*</sup></label>
      <select id="subject" class="required" name="subject" v-model="form.subject" required>
        <option value="">Choose One</option>
        <option v-for="subject in subjects" :value="subject">{{ subject }}</option>
      </select>
    </p>
    <p>
      <label for="message">Message<sup>*</sup></label>
      <textarea id="message" class="required" name="message" v-model="form.message" required></textarea>
    </p>
  </form>
</template>

<script>
  export default {
    data: () => ({
      form: {
        fullName: '',
        email: '',
        phone: '',
        date: '',
        subject: '',
        message: ''
      },
      subjects: [
        'General Inquiry',
        'Human Resources',
        'Technical Support',
      ]
    }),
  }
</script>
```

## 2. Adding Validation

With our basic form markup done, lets add our `@submit` method to the form `<form @submit="validateForm">`. Now we can create our validation method and target required fields using the `.required` class we've added to required fields.

```js
  methods: {
    validateForm() {

      let valid = true

      const reqFields = document.querySelectorAll(`.required`)
      reqFields.forEach( field => {
        if( !field.value ) {
          valid = false
        }
      });

      return valid
    }
  }
```

We can take this further and add field specific validations for inputs such as email, tel, and date by adding their own methods.

```js
  methods: {
    isEmailValid(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    isPhoneValid(phone) { // (000) 000-0000 or (000)000-0000
      const re = /^\(\d{3}\)\s?\d{3}-\d{4}$/
      return re.test(phone)
    },
    isDateValid(dateString) { // yyyy-mm-dd
      const regEx = /^\d{4}-\d{2}-\d{2}$/;
      if(!dateString.match(regEx)) return false;  // Invalid format
      const d = new Date(dateString);
      const dNum = d.getTime();
      if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
      return d.toISOString().slice(0,10) === dateString;
    },
    validateForm() {

      let valid = true

      const reqFields = document.querySelectorAll(`.required`)
      reqFields.forEach( field => {

        if( !field.value ) {
          valid = false
        }
        if( field.type === 'email' && !this.isEmailValid(field.value)) {
          valid = false
        }
        if( field.type === 'tel' && !this.isPhoneValid(field.value)) {
          valid = false
        }
        if( field.type === 'date' && !this.isDateValid(field.value)) {
          valid = false
        }
      });

      return valid
    }
  }
```

## 3. Adding Error Messaging

While validation itself is great, you probably want to add some messaging to users to indicate there were issues with validation and how they can fix them. To do this, we can add an empty array called errors to our data method.

```js
data: () => ({
  errors: []
}),
```

We can then push error messages to our array if there are problems with the form validation.

```js
methods: {
  isEmailValid(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },
  isPhoneValid(phone) { // (000) 000-0000 or (000)000-0000
    const re = /^\(\d{3}\)\s?\d{3}-\d{4}$/
    return re.test(phone)
  },
  isDateValid(dateString) { // yyyy-mm-dd
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) return false;  // Invalid format
    const d = new Date(dateString);
    const dNum = d.getTime();
    if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0,10) === dateString;
  },
  validateForm() {

    let valid = true
    this.errors = [] // reset the errors array on each submit so we don't keep adding messages

    const reqFields = document.querySelectorAll(`.required`)
    reqFields.forEach( field => {

      if( !field.value ) {
        valid = false
        this.errors.push('Please fill all required fields indicated by *')
      }
      if( field.type === 'email' && !this.isEmailValid(field.value)) {
        valid = false
        this.errors.push('The email entered isn\'t valid. Emails are formatted as name@domain.com')
      }
      if( field.type === 'tel' && !this.isPhoneValid(field.value)) {
        valid = false
        this.errors.push('The phone number entered isn\'t valid. Phone numbers are formatted as (000) 000-0000')
      }
      if( field.type === 'date' && !this.isDateValid(field.value)) {
        valid = false
        this.errors.push('The date entered isn\'t valid. Dates are formatted as yyyy-mm-dd')
      }
    });

    return valid
  }
}
```

Next, we will want to display these errors somewhere in our form.

```vue
<p v-if="errors.length">
  <strong>Please correct the following error(s):</strong>
  <ul>
    <li v-for="error,idx in errors" :key="`err-${idx}`">{{ error }}</li>
  </ul>
</p>
```


## 4. Input Masking

A final piece you could add for a further improved user experience is input masking. For this, you could use an existing library like [v-mask](https://www.npmjs.com/package/v-mask) or [maska](https://www.npmjs.com/package/maska). In our case, we are going to add input masking to only the phone field, so adding a whole library doesn't make sense. Let's create our masking method.

```js
methods: {
  maskPhone(e) {
    const x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
  }
}
```

Then we can call our method on the phone input.

```vue
<p>
  <label for="phone">Phone<sup>*</sup></label>
  <input id="phone" type="tel" name="phone" v-model="form.phone" @input="maskPhone" placeholder="000-000-0000" />
</p>
```

## 5. Putting it all together

Now we can put all of this together!

```vue
<template>
  <form>
    <p v-if="errors.length">
      <strong>Please correct the following error(s):</strong>
      <ul>
        <li v-for="error,idx in errors" :key="`err-${idx}`">{{ error }}</li>
      </ul>
    </p>
    <p>
      <label for="fullName">Full Name<sup>*</sup></label>
      <input id="fullName" class="required" type="text" name="fullName" v-model="form.fullName" required />
    </p>
    <p>
      <label for="email">Email<sup>*</sup></label>
      <input id="email" class="required" type="email" name="email" v-model="form.email" placeholder="name@domain.com" required />
    </p>
    <p>
      <label for="phone">Phone<sup>*</sup></label>
      <input id="phone" type="tel" name="phone" v-model="form.phone" @input="maskPhone" placeholder="000-000-0000" />
    </p>
    <p>
      <label for="date">Date</label>
      <input id="date" type="date" name="date" v-model="form.date" placeholder="yyyy-mm-dd" />
    </p>
    <p>
      <label for="subject">Subject<sup>*</sup></label>
      <select id="subject" class="required" name="subject" v-model="form.subject" required>
        <option value="">Choose One</option>
        <option v-for="subject in subjects" :value="subject">{{ subject }}</option>
      </select>
    </p>
    <p>
      <label for="message">Message<sup>*</sup></label>
      <textarea id="message" class="required" name="message" v-model="form.message" required></textarea>
    </p>
  </form>
</template>

<script>
  export default {
    data: () => ({
      form: {
        fullName: '',
        email: '',
        phone: '',
        date: '',
        subject: '',
        message: ''
      },
      subjects: [
        'General Inquiry',
        'Human Resources',
        'Technical Support',
      ],
      errors: []
    }),
    methods: {
      maskPhone(e) {
        const x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
      },
      isEmailValid(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      },
      isPhoneValid(phone) { // (000) 000-0000 or (000)000-0000
        const re = /^\(\d{3}\)\s?\d{3}-\d{4}$/
        return re.test(phone)
      },
      isDateValid(dateString) { // yyyy-mm-dd
        const regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateString.match(regEx)) return false;  // Invalid format
        const d = new Date(dateString);
        const dNum = d.getTime();
        if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
        return d.toISOString().slice(0,10) === dateString;
      },
      validateForm() {

        let valid = true
        this.errors = [] // reset the errors array on each submit so we don't keep adding messages

        const reqFields = document.querySelectorAll(`.required`)
        reqFields.forEach( field => {

          if( !field.value ) {
            valid = false
            this.errors.push('Please fill all required fields indicated by *')
          }
          if( field.type === 'email' && !this.isEmailValid(field.value)) {
            valid = false
            this.errors.push('The email entered isn\'t valid. Emails are formatted as name@domain.com')
          }
          if( field.type === 'tel' && !this.isPhoneValid(field.value)) {
            valid = false
            this.errors.push('The phone number entered isn\'t valid. Phone numbers are formatted as (000) 000-0000')
          }
          if( field.type === 'date' && !this.isDateValid(field.value)) {
            valid = false
            this.errors.push('The date entered isn\'t valid. Dates are formatted as yyyy-mm-dd')
          }
        });

        if( valid ) {
          // submit the form to your API
        }

        return valid
      }
    }
  }
</script>
```