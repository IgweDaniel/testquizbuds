<template lang="">
    <!-- <ErrorToast /> -->
    <div class="edit__container">
        <div class="edit__container-inner">
            <div class="top">
                <div class="top__inner">
                    <div class="display__image" :style="{ 'background-image': 'url(' + user__avatar + ')' }"></div>
                    <div class="user__details">
                        <form>
                            <!-- Username -->
                            <div class="user__name">
                                <label for="username">
                                    <span>Change Display Name:</span>
                                    <input type="text" v-model="username" name="username" id="username" placeholder="Enter new display name">
                                </label>
                            </div>

                            <!-- Gender -->
                            <div class="gender">
                                <span>Select Gender</span>
                                <div>
                                    <label for="male">
                                        <input type="radio" v-model='gender' name="gender" id="male" value="male">
                                        <span>Male</span>
                                    </label>
                                    <label for="female">
                                        <input type="radio" v-model="gender" name="gender" id="female" value="female">
                                        <span>Female</span>
                                    </label>
                                </div>
                            </div>

                            <button :disabled="isDisabled" @click.prevent='handleUpdate' class="s__button">
                                <SvgSpinners12DotsScaleRotate v-if="isLoading"/>
                                <span v-if="!isLoading">Update Details</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="bottom__header">
                    <h2>Pick a new Avatar</h2>
                    <span>Studies reveal looks guarantees firmer confidence!</span>
                </div>
                <div class="avatar__picker__container">
                    <div class="avatar__picker__container-inner">
                        <!-- <button @click.prevent='addPhoto' class="avatar avatar__1" data-photoURL="https://res.cloudinary.com/doqyk8frz/image/upload/v1700571403/Quizbuds%20Images/boy_1_dsdncg.jpg"></button> -->
                        <button v-for="imageURL in imageURLs" class="avatar" @click.prevent="addPhoto" :style="{ 'background-image': 'url(' + imageURL + ')' }" :data-photoURL="imageURL"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { db } from '../../../firebase.config'
import { updateProfile } from 'firebase/auth'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { useStore } from 'vuex'
import ErrorToast from '@/components/ErrorToast/ErrorToast.vue'
import SvgSpinners12DotsScaleRotate from '../../assets/icons/SvgSpinners12DotsScaleRotate.vue'

const store = useStore()

const toast = useToast()

const router = useRouter()

const imageURLs = ref([
    'https://res.cloudinary.com/doqyk8frz/image/upload/v1700571983/Quizbuds%20Images/Boy_x_pp3lgs.jpg',
    'https://res.cloudinary.com/doqyk8frz/image/upload/v1700571403/Quizbuds%20Images/boy_1_dsdncg.jpg',
    'https://res.cloudinary.com/doqyk8frz/image/upload/v1700566442/Quizbuds%20Images/boy_6_j8pbbi.jpg',
    'https://res.cloudinary.com/doqyk8frz/image/upload/v1700566435/Quizbuds%20Images/girl_4_rfitb9.jpg',
    'https://res.cloudinary.com/doqyk8frz/image/upload/v1700566413/Quizbuds%20Images/girl_5_xj1joe.jpg',
    'https://res.cloudinary.com/doqyk8frz/image/upload/v1700566410/Quizbuds%20Images/girl_3_gw2tbu.jpg',
    'https://res.cloudinary.com/doqyk8frz/image/upload/v1700566407/Quizbuds%20Images/boy_4_gjhkks.jpg',
    'https://res.cloudinary.com/doqyk8frz/image/upload/v1700566405/Quizbuds%20Images/boy_5_yje5p3.jpg',
    'https://res.cloudinary.com/doqyk8frz/image/upload/v1700566404/Quizbuds%20Images/girl_7_ldjrrv.jpg',
    'https://res.cloudinary.com/doqyk8frz/image/upload/v1700566404/Quizbuds%20Images/boy_2_i74ywz.jpg',
    'https://res.cloudinary.com/doqyk8frz/image/upload/v1700566403/Quizbuds%20Images/man_2_a163ex.jpg',
    'https://res.cloudinary.com/doqyk8frz/image/upload/v1700566403/Quizbuds%20Images/girl_9_a7czcu.jpg',
    'https://res.cloudinary.com/doqyk8frz/image/upload/v1700566402/Quizbuds%20Images/girl_2_i567l0.jpg',
    'https://res.cloudinary.com/doqyk8frz/image/upload/v1700566400/Quizbuds%20Images/man_3_ap7hk8.jpg',
    'https://res.cloudinary.com/doqyk8frz/image/upload/v1700566399/Quizbuds%20Images/man_1_ppbmwx.jpg',
])

const authIsReady = computed(() => store.state.authIsReady)

const username = ref('')
const gender = ref('')
const user__avatar = ref(store.state.user.photoURL)
const isDisabled = ref(false)
const isLoading = ref(false)


const getUsername = async () => {
    const docRef = doc(db, 'users', store.state.user.uid)
    const docSnap = await getDoc(docRef)
    let response = null

    if (docSnap.exists()) {
        response = docSnap.data()
    } else {
        console.log('Document does not exist')
    }
    
    console.log(response.username)

    username.value = response.username
}

const getGender = async () => {
    const docRef = doc(db, 'users', store.state.user.uid)
    const docSnap = await getDoc(docRef)
    let response = null

    if (docSnap.exists()) {
        response = docSnap.data()
    } else {
        console.log('Document does not exist')
    }
    
    console.log(response.gender)

    gender.value = response.gender
}

getUsername()

const initializeUserData = async () => {
    if (authIsReady && store.state.user && store.state.user.uid) {
        await getUsername()
        await getGender()
    }
}

const addPhoto = (e) => {
    user__avatar.value = e.target.getAttribute('data-photoURL')
    console.log(user__avatar.value)
}

const handleUpdate = async (e) => {
    e.preventDefault();
    isLoading.value = true
    isDisabled.value = true
    const docRef = doc(db, 'users', store.state.user.uid)
    
    try {
        await updateDoc(docRef, {'username': username.value})
        await updateProfile(store.state.user, {
            photoURL: user__avatar.value,
        })
        await updateDoc(docRef, {'gender': gender.value})
        toast.success('Profile successfully updated!')
        router.push('/dashboard')
    } catch (err) {
        toast.error('Profile not updated')
    }

    isLoading.value = false
    isDisabled.value = false
}

// Watch for changes in the user state
watch(() => store.state.user, () => {
    initializeUserData();
}, { immediate: true });

onMounted(() => {
    initializeUserData()
})
</script>
<style lang="scss" scoped>
    
</style>