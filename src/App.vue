<script setup>
  import { onMounted } from 'vue';
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { RouterView } from 'vue-router';
  import navbar from '@/components/Navbar/Navbar.vue'

  // onMounted(() => {
  //   const auth = getAuth()
  //   const user = auth.currentUser

  //   onAuthStateChanged(auth, (user) => {
  //     console.log(user)
  //   })

  //   console.log(user)
  // })
</script>

<template>
  <div class="app__container">
    <div class="nav__margin">
      <navbar />
    </div>
  </div>
  <RouterView />
</template>

<style lang="scss" scoped>
  .app__container {
    width: 100vw;
    padding: 1rem 2.5rem 0 2.5rem;

    @media screen and (max-width: 768px) {
      padding: .25rem 0;
      margin-top: .75rem;
    }
  }
</style>
