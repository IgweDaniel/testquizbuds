<template lang="">
    <div class="signup__container">
        <div class="form__container">
            <div class="form__container-inner">
                <div class="header">
                    <h2>Sign in!</h2>
                </div>
                <form>
                    <!-- Email -->
                    <div class="email__container">
                        <label for="email">Enter email:</label>
                        <input type="email" name="email" id="email" placeholder="Enter email" v-model="user__email">
                    </div>
                    <!-- Password -->
                    <div class="password__container">
                        <label for="password">Enter password:</label>
                        <input type="password" name="password" id="password" placeholder="Enter password" v-model="user__password">
                    </div>
                    <button :disabled="isDisabled" @click.prevent='handleSubmit' class="s__button">
                        <SvgSpinners12DotsScaleRotate v-if="isLoading"/>
                        <span v-if="!isLoading">Sign In</span>
                    </button>
                </form>
                <div>
                    <p>Don't have an account? <router-link to='/signup'>Sign up</router-link> </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { useToast } from 'vue-toastification'
    import { RouterLink, useRouter } from 'vue-router';
    import { useStore } from 'vuex'
    import SvgSpinners12DotsScaleRotate from '@/assets/icons/SvgSpinners12DotsScaleRotate.vue'

    const store = useStore()

    const toast = useToast()

    const router = useRouter()

    const isLoading = ref(false)
    const isDisabled = ref(false)
    const user__email = ref('')
    const user__password = ref('')

    const handleSubmit = async () => {
        const email = user__email.value
        const password = user__password.value
        // const redirect = router.query.redirect

        // console.log(redirect)

        isLoading.value = true
        isDisabled.value = true

        try {
            await store.dispatch('login', { email, password})
            toast.success('Sign in successful!')
            router.push('/dashboard')
        } catch (err) {
            isLoading.value = false
            isDisabled.value = false
            toast.error('Invalid credentials')
        }
    }
</script>
