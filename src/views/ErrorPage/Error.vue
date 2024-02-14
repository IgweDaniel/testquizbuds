<template>
    <div class="not__found__container">
        <div class="not__found__container-inner">
            <h1>404 <br />Page not found!</h1>
            <router-link to="/dashboard">
                Go To Dashboard
            </router-link>
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>

<script setup>
import { RouterLink } from 'vue-router'
</script>