<template lang="">
    <div class="signup__container">
        <div class="form__container">
            <div class="form__container-inner">
                <div class="header">
                    <h2>Sign up!</h2>
                </div>
                <form>
                    <!-- Username -->
                    <div class="email__container">
                        <label for="name">Enter Full Name:</label>
                        <input type="text" name="name" id="name" placeholder="Enter full name" v-model="user__name">
                    </div>
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
                    <div class="confirm__password__container">
                        <label for="confirm password">Confirm password:</label>
                        <input type="password" name="confirm password" id="confirm password" placeholder="Confirm password" v-model="user__confirmpass">
                    </div>
                    <button :disabled="isDisabled" @click.prevent='handleSubmit' class="s__button">
                        <SvgSpinners12DotsScaleRotate v-if="isLoading"/>
                        <span v-if="!isLoading">Sign In</span>
                    </button>
                </form>
                <div>
                    <p>Already have an account? <router-link to='/signin'>Sign in</router-link> </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { db } from '../../../firebase.config'
    import { updateProfile } from 'firebase/auth'
    import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
    import { useStore } from 'vuex'
    import { RouterLink, useRouter } from 'vue-router';
    import ErrorToast from '@/components/ErrorToast/ErrorToast.vue'
    import SvgSpinners12DotsScaleRotate from '@/assets/icons/SvgSpinners12DotsScaleRotate.vue'

    const user__name = ref('')
    const user__email = ref('')
    const user__password = ref('')
    const user__confirmpass = ref('')
    const isLoading = ref(false)
    const isDisabled = ref(false)
    

    const store = useStore()

    const router = useRouter()

    // const validateCredentials = (email, password, confirmPassword) => {
    //     const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    //     const passwordRegex = /^(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/

    //     !email.match(emailRegex) ? 'Invalid email address' : ''
    //     !password.match(emailRegex) || password !== confirmPassword ? 'Invalid email address' : ''

    //     return null; // Validation passed
    // }

    const handleSubmit = async () => {
        const email = user__email.value
        const username = user__name.value
        const walletBalance = 0
        const gender = null
        const currentQuiz = null
        const currentGameState = null
        const previousAttempts = null
        const timestamp = serverTimestamp()
        

        isLoading.value = true
        isDisabled.value = true

        try {
            await store.dispatch('signup', {
                email: user__email.value,
                password: user__password.value,
                username: user__name.value
            })

            await updateProfile(store.state.user, {
                displayName: user__name.value,
                photoURL: 'https://res.cloudinary.com/doqyk8frz/image/upload/v1700577072/Quizbuds%20Images/3d-astronaut-falling-down-cosmos-flat-line-art-design-illustration_ofsxzf.jpg'
            })

            await setDoc(doc(db, 'users', store.state.user.uid), {email, username, walletBalance, gender, currentQuiz, currentGameState, timestamp, previousAttempts})

            router.push('/dashboard')
        } catch (err) {
            isLoading.value = false
            isDisabled.value = false
            console.log(err.message)
        }
    }
</script>