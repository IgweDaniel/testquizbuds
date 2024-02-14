<template>
    <div class="modal__container">
        <div class="modal__container-inner">
            <div class="image">
                Trophy Image
            </div>
            <h2>Game over!</h2>
            <p>You won ${{ amount }}</p>
            <router-link to="/dashboard">
                Go to Dashboard
            </router-link>
        </div>
    </div>
</template>
<script setup>
import { RouterLink } from 'vue-router'
defineProps(['amount'])

</script>
<style lang="scss" scoped></style>