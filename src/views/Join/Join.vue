<template>
    <div class="join__container">
        <div class="join__container-inner">
            <div>
                <h3>Join Challenge</h3>
                <input type="text" v-model="gameCode" placeholder="Enter challenge code">
                <button :disabled="isDisabled" @click="handleJoin">Join</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router';

const gameCode = ref('')
const isDisabled = ref(true)

const route = useRouter()

// Watch for changes in the gameCode
watch(gameCode, (newValue) => {
    isDisabled.value = newValue.trim() === ''
})

const handleJoin = (e) => {
    e.preventDefault()

    route.push(`/challenge-interface/${gameCode.value}`)
}
</script>

<style lang="scss" scoped>
    
</style>