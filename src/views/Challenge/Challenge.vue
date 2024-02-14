<template>
    <div class="challenge__container">
        <div class="challenge__container-inner">
            <div class="challenge__header">
                <h2>Create Challenge</h2>
                <span>Forge a path of friendly competition among friends, where tackling challenges not only <br>tests your knowledge but also boosts your confidence to new heights.</span>
            </div>
            <div class="challenge__body">
                <div class="challenge__body-category">
                    <div class="category__header">
                        <h2>Choose Category</h2>
                    </div>
                    <!-- Slider -->
                    <div class="slider">
                        <swiper-container navigation="true" :slides-per-view="4" :space-between="15" :breakpoints="swiperOptions.breakpoints">
                            <swiper-slide v-for="item in gameTypes" :key="item">
                                <gameItem :item="item" @click.prevent="handleClick(item.value)" @item-clicked="handleItemClicked" />
                            </swiper-slide>
                        </swiper-container>
                    </div>
                </div>
                <div class="challenge__body-difficulty">
                    <div class="difficulty__header">
                        <h2>Choose Difficulty Level</h2>
                        <div class="difficulty__body">
                            <div>
                                <label for="easy">
                                    <input type="radio" v-model="difficulty" name="difficulty" id="easy" value="easy">
                                    <span>Easy</span>
                                </label>
                            </div>
                            <div>
                                <label for="medium">
                                    <input type="radio" v-model="difficulty" name="difficulty" id="medium" value="medium">
                                    <span>Medium</span>
                                </label>
                            </div>
                            <div>
                                <label for="hard">
                                    <input type="radio" v-model="difficulty" name="difficulty" id="hard" value="hard">
                                    <span>Hard</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="challenge__body-max">
                    <label>
                        <div>
                            <span>Set number of participants: </span> <br />
                            <small>Maximum number participants allowed is 15</small>
                        </div>
                        <input type="number" name="maxParticipants" id="maxParticipants" v-model="maxParticipants" min="3" max="15">
                    </label>
                </div>
                <div class="challenge__body-wager">
                    <div class="wager__header">
                        <div class="title">
                            <h2>Wager Settings</h2>
                        </div>
                        <div class="mode__button">
                            <label for="mode">
                                <input class="toggler" type="checkbox" name="mode" id="mode">
                                <div class="button__toggle" @click="handleCheck">
                                    <div class="handle"></div>
                                    <div class="bars"></div>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div class="wager__body" v-if="wagerActive">
                        <input type="number" v-model="wagerAmount" placeholder="Enter wager amount..." name="wagerAmount" id="wagerAmount"/>
                    </div>
                </div>
                <div class="button__container">
                    <div class="link__display">
                        <input disabled v-on:focus="$event.target.select()" ref="generatedTextRef" placeholder="https://quizbuds.com?join=345678" type="text" v-model="gameCodeValue"/>
                        <div class="copy__btn">
                            <button :disabled="isDisabled" class="copy" @click="copyToClipboard">
                                <span>Copy</span>
                                <IonCopy />
                            </button>
                        </div>
                    </div>
                    <button class="cta" @click.prevent="generateCode" v-show="!showCreateButton">Get game code</button>
                    <button class="cta" @click.prevent="createChallenge" v-if="showCreateButton">
                        <SvgSpinners12DotsScaleRotate v-if="isLoading"/>
                        <span v-if="!isLoading">Create Challenge</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebase.config'
import { v4 as uuidv4 } from 'uuid'
import { register } from 'swiper/element/bundle'
import { Swiper, SwiperSlide} from 'swiper/vue'
import { useToast } from 'vue-toastification'
import { useStore } from 'vuex'
import gameItem from '@/components/GameItem/GameItem.vue'
import IonCopy from '@/assets/icons/IonCopy.vue'
// import IonIosCheckmarkCircle from '../../assets/icons/IonIosCheckmarkCircle.vue'
import SvgSpinners12DotsScaleRotate from '@/assets/icons/SvgSpinners12DotsScaleRotate.vue'

register()

const wagerActive = ref(false)
const quizCategory = ref('')
const difficulty = ref('easy')
const showCreateButton = ref(false)
const gameCodeURL = ref('')
const gameCodeValue = ref('')
const generatedTextRef = ref(null)
const wagerAmount = ref(null)
const maxParticipants = ref('')
const isDisabled = ref(true)
const isLoading = ref(false)

const toast = useToast()
const route = useRouter()
const store = useStore()

const swiperOptions = {
    breakpoints: {
        320: {
            slidesPerView: 2,
            spaceBetween: 15
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

const handleCheck = () => {
    wagerActive.value = !wagerActive.value
    console.log(wagerActive.value)
}

const handleClick = (value, activeStatus) => {
    quizCategory.value = value
    activeStatus = !activeStatus
    console.log(activeStatus)
}

const handleItemClicked = (selectedValue) => {
    gameTypes.value.forEach(item => {
        item.selected = item.value === selectedValue
        console.log(item.selected)
    })
}

// Generate game code
const generateCode = () => {
    if (quizCategory.value === '') {
        toast.error('Please select a quiz category')
        throw new Error('Please select a quiz category')
    } else if (maxParticipants.value === '') {
        toast.error('Please add number of participants!')
        throw new Error('Please add a defined number of participants')
    }
    console.log(quizCategory.value)
    // Generate Game code
    const gameCode = uuidv4()

    // Game code
    gameCodeValue.value = gameCode

    // Modify value of input box
    gameCodeURL.value = `http://localhost:5173/challenge-view/${gameCode}`
    
    // Activate copy button
    isDisabled.value = false

    // Activate create button
    showCreateButton.value = !showCreateButton.value
}

// Copy url to clipboard
const copyToClipboard = async() => {
    try {
        generatedTextRef.value.select()

        await navigator.clipboard.writeText(gameCodeValue.value)

        toast.success('Copied')
    } catch (err) {
        toast.error('Unable to copy text.')
    }
}

// Fetch questions
const handleFetch = async () => {
        const url = `https://opentdb.com/api.php?amount=15&category=${quizCategory.value}&difficulty=${difficulty.value}&type=multiple`
        let response = ''

        try {
            response = await fetch(url)


            if (!response.ok) throw new Error('Response is defective')

            const data = await response.json()

            console.log(data)
            if (data.response_code !== 0) {
                toast.error('Error retrieving question data 😢. Please retry or pick another difficulty level.')
                isLoading.value = false
            } else {
                response = data
                isLoading.value = false
            }
        } catch (err) {
            toast.error(err)
            isLoading.value = false
        }

    return response
}

const createChallenge = async() => {
    isLoading.value = true
    const gameStatus = 'is_pending'
    // Route client to challenge game interface
    // Destructure URL string to get the appropriate path
    const urlString = gameCodeURL.value
    const url = new URL(urlString)
    const path = url.pathname
    const pathParts = path.split('/')
    const gameCode = pathParts[pathParts.length - 1]

    try {
        // Fetch questions from opentdb api
        const questionData = await handleFetch()
        console.log(questionData)

        // Create game room in user's database
        await setDoc(doc(db, 'challenges', gameCode), {
            challengeID: gameCode,
            questionData: questionData,
            challengeCreator: store.state.user.displayName,
            wagerAmount: wagerAmount.value !== null ? wagerAmount.value : null,
            maxParticipants: maxParticipants.value,
            bounty: 0,
            participants: [{
                id: store.state.user.uid,
                avatar: store.state.user.photoURL,
                name: store.state.user.displayName.split(' ')[0],
                score: 0
            }],
            status: gameStatus
        })

        // Redirect user
        route.push(`${path}`)
        console.log('Challenge room created')
    } catch (err) {
        isLoading.value = false
        console.log(err)
        toast.error(err.message)
    }
}


</script>

<style lang="scss">
    
</style>