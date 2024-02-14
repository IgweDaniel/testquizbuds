<template>
    <div v-if="loader" class="loading__screen">
        <div class="loading__screen-inner">
            <SvgSpinners12DotsScaleRotate />
            <p>Fetching questions...</p>
        </div>
    </div>
    <div class="dashboard__wrapper">
        <div class="dashboard__wrapper-inner">
            <div class="left__pane">
                <div class="left__pane-inner">
                    <ul>
                        <li>
                            <router-link to="/game">
                                <IonPlayCircleSharp />
                                <span>Play Game</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/challenge">
                                <IonIosGameControllerB />
                                <span>Create Challenge</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/join">
                                <IonIosGameControllerB />
                                <span>Join Challenge</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/editprofile">
                                <IonMdSettings />
                                <span>Settings</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="middle__pane">
                <div class="middle__pane-welcome">
                    <div class="middle__pane-welcome-left">
                        <div class="intro">
                            <h2>Good {{ timeOfDay() }}, <span v-if="authIsReady && user">{{ username }}</span></h2>
                            <span class="animated__span">
                                <span>Ready to unleash your inner quiz whiz? Dive in!</span>
                            </span>
                        </div>
                        <div class="progress__blocks">
                            <!-- <div class="progress__blocks-block">
                                <h3>Ranking</h3>
                                <span class="badge"></span>
                            </div> -->
                            <div class="progress__blocks-block">
                                <h3>Available Funds</h3>
                                <span>
                                    <SvgSpinners12DotsScaleRotate v-if="walletBalance == null"/>
                                    <span v-else>$<span v-if="authIsReady && user">{{ walletBalance }}</span> </span>
                                </span>
                            </div>
                            <div class="progress__blocks-block">
                                <h3>Buds Progress</h3>
                                <div class="progress__path">
                                    <div class="progress__num">
                                        <span>Total Games Played: <span v-if="authIsReady && user">{{ totalGamesPlayed }}</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>

                <!-- Previous played quiz -->
                <div class="picker previous__attempts__block">
                    <div class="picker__header previous__attempts__block-header">
                        <h2>Previous Attempts</h2>
                        <span>Make another attempt</span>
                    </div>
                    <!-- Slider -->
                    <div class="slider">
                        <swiper-container
                            navigation="true"
                            :slides-per-view="4"
                            :space-between="30"
                            @swiper="onSwiper"
                            @slideChange="onSlideChange"
                            :breakpoints="swiperOptions.breakpoints"
                            >
                            <swiper-slide v-for="item in gameTypes" :key="item">
                                <GameItem :item="item" @click.prevent="handleClick(item)" @item-selected="handleItemClicked"/>
                            </swiper-slide>
                        </swiper-container>
                    </div>
                </div>                
                
                <!-- Choose new quiz -->
                
            </div>
            <div class="right__pane">
                <div class="right__pane-top">
                    <div class="right__pane-top-inner">
                        <div class="user__info">
                            <div class="user__info-avatar" :style="{ 'background-image': 'url(' + user__avatar + ')' }" v-if="authIsReady && user"></div>
                            <div class="user__info-details">
                                <h4 v-if="authIsReady && user">{{ username }}</h4>
                                <router-link to="/editprofile">
                                    <IonEdit />
                                    <span>Edit Profile</span>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bottom__nav">
            <div class="bottom__nav-inner">
                <button @click="toggleLeftPane">
                    <IonNavigate />
                </button>
                <button @click="toggleRightPane">
                    <IonPerson />
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref, computed, watch, onMounted } from 'vue'
    import { gsap } from 'gsap'
    import { db } from '../../../firebase.config'
    import { collection, doc, getDoc } from 'firebase/firestore'
    import { RouterLink } from 'vue-router'
    import { register } from 'swiper/element/bundle'
    import { Swiper, SwiperSlide} from 'swiper/vue'
    import IonPlayCircleSharp from '@/assets/icons/IonPlayCircleSharp.vue'
    import IonIosGameControllerB from '@/assets/icons/IonIosGameControllerB.vue'
    import IonCash from '@/assets/icons/IonCash.vue'
    import IonNavigate from '../../assets/icons/IonNavigate.vue'
    import IonPerson from '@/assets/icons/IonPerson.vue'
    import IonMdSettings from '@/assets/icons/IonMdSettings.vue'
    import IonEdit from '@/assets/icons/IonEdit.vue'
    import SvgSpinners12DotsScaleRotate from '@/assets/icons/SvgSpinners12DotsScaleRotate.vue'
    import { useStore } from 'vuex'

    import GameItem from '@/components/GameItem/GameItem.vue'
    
    register()

    const store = useStore()

    const user = computed(() => store.state.user)

    console.log(user.value)

    const authIsReady = computed(() => store.state.authIsReady)

    const user__avatar = computed(() => store.state.user.photoURL)

    const username = ref('')

    const walletBalance = ref(null)

    const totalGamesPlayed = ref(0)

    const selectedCategory = ref('')

    const loader = ref(false)

    // const difficulty = ref('easy')

    const isLeftPaneActive = ref(false);
    const isRightPaneActive = ref(false);

    const swiperOptions = {
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 40
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 30
            }
        }
    }

    const animateLeftPane = (show) => {
      gsap.to('.left__pane', { y: show ? 0 : '-1000%', opacity: show ? 1 : 0, display: show ? 'block' : 'none', duration: 0.3, ease: 'power3.in' });
    };

    const animateRightPane = (show) => {
      gsap.to('.right__pane', {y: show ? 0 : '-1000%', opacity: show ? 1 : 0, display: show ? 'block' : 'none', duration: 0.3, ease: 'power3.in' });
    };

    const toggleLeftPane = () => {
      animateLeftPane(!isLeftPaneActive.value);
      isLeftPaneActive.value = !isLeftPaneActive.value;
    };

    const toggleRightPane = () => {
      animateRightPane(!isRightPaneActive.value);
      isRightPaneActive.value = !isRightPaneActive.value;
    };


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

    const getWalletBalance = async () => {
        const docRef = doc(db, 'users', store.state.user.uid)
        const docSnap = await getDoc(docRef)
        let response = null;

        if (docSnap.exists()) {
            response = docSnap.data()
        } else {
            console.log('Document does not exist')
        }
        console.log(response.walletBalance)
        walletBalance.value = response.walletBalance
    }

    const totalGames = async () => {
        const docRef = doc(db, 'users', store.state.user.uid)
        const docSnap = await getDoc(docRef)
        let response = null;

        if (docSnap.exists()) {
            response = docSnap.data()
        } else {
            console.log('Document does not exist')
        }
        
        totalGamesPlayed.value = response.totalGamesPlayed
    }

    // Get time of day
    const timeOfDay = () => {
        let myDate = new Date()
        let hours = myDate.getHours()
        let daytime;

        if (hours < 12) {
            daytime = 'Morning'
        } else if (hours >= 12 && hours <= 17) {
            daytime = 'Afternoon'
        } else {
            daytime ='Evening'
        }

        return daytime
    }

    const gameTypes = ref([{
                   name: 'Japanese Anime & Manga',
                   image: '../../../public/naruto.jpg',
                   value: 31,
                   selected: false
               }, {
                    name: 'Music',
                   image: '../../../public/architecture.jpg',
                   value: 12,
                   selected: false
               }, {
                    name: 'Television',
                   image: '../../../public/video-games.jpg',
                   value: 14,
                   selected: false
               }, {
                    name: 'Science & Nature',
                   image: '../../../public/sports.jpg',
                   value: 17,
                   selected: false
               },  {
                    name: 'History',
                   image: '../../../public/politics.jpg',
                   value: 23,
                   selected: false
               }, 
                {
                    name: 'General knowledge',
                   image: '../../../public/politics.jpg',
                   value: 9,
                   selected: false
               }, {
                    name: 'Books',
                    image: '../../../public/nature-science.jpg',
                    value: 10,
                    selected: false
                }, {
                    name: 'Film',
                    image: '../../../public/nature-science.jpg',
                    value: 11,
                    selected: false
                }, {
                    name: 'Video Games',
                    image: '../../../public/nature-science.jpg',
                    value: 15,
                    selected: false
                }, {
                    name: 'Computers',
                    image: '../../../public/nature-science.jpg',
                    value: 18,
                    selected: false
                }, {
                    name: 'Mythology',
                    image: '../../../public/nature-science.jpg',
                    value: 20,
                    selected: false
                }, {
                    name: 'Sports',
                    image: '../../../public/nature-science.jpg',
                    value: 21,
                    selected: false
                }, {
                    name: 'Geography',
                    image: '../../../public/nature-science.jpg',
                    value: 22,
                    selected: false
                }, {
                    name: 'Comics',
                    image: '../../../public/nature-science.jpg',
                    value: 29,
                    selected: false
                }, {
                    name: 'Gadgets',
                    image: '../../../public/nature-science.jpg',
                    value: 30,
                    selected: false
                }, {
                    name: 'Cartoons & Animations',
                    image: '../../../public/nature-science.jpg',
                    value: 32,
                    selected: false
    }])

    const handleClick = (item, activeStatus) => {
        selectedCategory.value = item
        activeStatus = !activeStatus
        console.log(activeStatus)
        console.log(selectedCategory.value)
    }

    const handleItemClicked = (selectedValue, selectedName) => {
        gameTypes.value.forEach(item => {
            item.selected = item.value === selectedValue
            
        })
    }

    // Initialize User Data
    const initializeUserData = async () => {
        if (authIsReady && store.state.user && store.state.user.uid) {
            await getUsername()
            await getWalletBalance()
            await totalGames()
        }
    }

    // Watch for changes in the user state
    watch(() => store.state.user, () => {
        initializeUserData();
    }, { immediate: true });

</script>
<style lang="scss" scoped></style>