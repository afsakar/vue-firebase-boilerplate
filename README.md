# VueJS Boilerplate with Firebase

This is a boilerplate for a VueJS application with Firebase.

>INFO: This is a work in progress. I will update this README as I go along.

## Features

- [Vue JS](https://vuejs.org/): The Progressive JavaScript Framework
- [Firebase](https://firebase.google.com/): Authentication, Firestore, Storage
- [Vue Router](https://router.vuejs.org/): Routing
- [Pinia](https://pinia.vuejs.org/): State management
- [Vite](https://vitejs.dev/): Build tool
- [Tailwind CSS](https://tailwindcss.com/): CSS framework
- [daisyUI](https://daisyui.com/): UI components
- [VueUse](https://vueuse.org/): Collection of useful composition APIs

## Getting Started

### Installing and Running

```sh
# Clone the repository
git clone

# Install dependencies
npm install

# Run the application
npm run dev

# Build for production with minification
npm run build
```

Change the Firebase configuration in `src/plugins/firebase.js` to your own.

You can create your own middleware in `src/middleware`.

Page Meta information can be set, and you can add more meta tags in `src/components/MetaInfo.vue`.

```vue
<script setup>
import {computed} from "vue";

const metaInfo = computed(() => {
  return {
    title: "Login",
  }
});

</script>

<template>
  <teleport to="head">
    <MetaInfo :meta="metaInfo"/> <!-- MetaInfo is global component -->
  </teleport>
  <div>
    <h1>Login</h1>
  </div>
</template>
```

## Project Structure

```
├── src
│   ├── assets
│   ├── components
│       ├── layout
│   ├── middleware
│   ├── pages
│   ├── plugins
│   ├── stores
|-- App.vue
|-- main.js
|-- styles.css
```


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
