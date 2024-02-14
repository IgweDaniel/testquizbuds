<template>
    <nav>
        <div class="logo">
            <router-link to="/">
                Q
            </router-link>
        </div>
        <ul class="nav__list">
            <li>
                <router-link to="/">
                    <IonHome />
                    <span>Home</span>
                </router-link>
                
            </li>
            <li v-if="authIsReady && user">
                <router-link to="/dashboard">
                    <IcRoundSpaceDashboard />
                    <span>Dashboard</span>
                </router-link>
            </li>
            <li v-if="authIsReady && !user">
                <router-link to="/signup">
                    <IonMdKey />
                    <span>Sign up</span>
                </router-link>
            </li>
            <li v-if="authIsReady && user">
                <button @click.prevent="handleLogout">
                    <IonPower />
                    <span>Log out</span>
                </button>
            </li>
            <!-- <div class="user__avatar" :style="{ 'background-image': 'url(' + user__avatar + ')' }"></div> -->
        </ul>
        <ul class="nav__list-mobile">
            <li>
                <router-link to="/">
                    <IonHome />
                    <span>Home</span>
                </router-link>
                
            </li>
            <li v-if="authIsReady && user">
                <router-link to="/dashboard">
                    <IcRoundSpaceDashboard />
                    <span>Dashboard</span>
                </router-link>
            </li>
            <li v-if="authIsReady && !user">
                <router-link to="/signup">
                    <IonMdKey />
                    <span>Sign up</span>
                </router-link>
            </li>
            <li v-if="authIsReady && user">
                <button @click.prevent="handleLogout">
                    <IonPower />
                    <span>Log out</span>
                </button>
            </li>
            <!-- <div class="user__avatar" :style="{ 'background-image': 'url(' + user__avatar + ')' }"></div> -->
        </ul>
        <div class="trigger" @click="toggleNav">
            <IonMenu />
        </div>
    </nav>
</template>

<script setup>
    import { ref, computed } from 'vue'
    import { gsap } from 'gsap'
    import { RouterLink, useRouter } from 'vue-router';
    import { useStore } from 'vuex'
    import IonHome from '@/assets/icons/IonHome.vue'
    import IcBaselineDoorFront from '@/assets/icons/IcBaselineDoorFront.vue'
    import IcRoundSpaceDashboard from '@/assets/icons/IcRoundSpaceDashboard.vue'
    import IonMdKey from '@/assets/icons/IonMdKey.vue'
    import IonPower from '@/assets/icons/IonPower.vue'
    import IonMenu from '@/assets/icons/IonMenu.vue'

    const store = useStore()

    const user = computed(() => store.state.user)

    const authIsReady = computed(() => store.state.authIsReady)

    // const user__avatar = ref(store.state.user.photoURL)
    
    const router = useRouter()

    const isNavActive = ref(false);

    const animateNav = (show) => {
      gsap.to('.nav__list-mobile', { x: show ? 0 : '100%', opacity: show ? 1 : 0, duration: 0.3, ease: 'power3.in' });
    };

    const toggleNav = () => {
      animateNav(!isNavActive.value);
      isNavActive.value = !isNavActive.value;
    };
    
    const handleLogout = () => {
        store.dispatch('logout')

        router.push('/')
    }
</script>

<style lang="sass" scoped></style>
