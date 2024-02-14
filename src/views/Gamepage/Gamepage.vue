<template lang="">
    <Modal v-if="showModal" :amount='winningAmount'/>
    <div v-if="loader" class="loading__screen">
        <div class="loading__screen-inner">
            <SvgSpinners12DotsScaleRotate />
            <p>Fetching questions...</p>
        </div>
    </div>
    <div class="game__wrapper">
        <div class="game__wrapper-inner">
            <div class="left__pane">
                <div class="left__pane-header">
                    <h2>Game Settings</h2>
                    <span>Set preferred game modes</span>
                </div>
                <div class="left__pane-body">
                    <form>
                        <!-- Difficulty Level -->
                        <div class="difficulty__container">
                            <h2>Set difficulty level</h2>
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

                        <!-- Quiz type -->
                        <div class="set__quiz__type">
                            <h2>Choose quiz type</h2>
                            <select name="quiz__type" v-model="quizCategory" id="quiz__type">
                                <option value="Select preferred quiz type" disabled>Select preferred quiz type</option>
                                <option value="31">Japanese Anime</option>
                                <option value="12">Music</option>
                                <option value="14">Television</option>
                                <option value="17">Science & Nature</option>
                                <option value="23">History</option>
                                <option value="9">General Knowledge</option>
                                <option value="10">Books</option>
                                <option value="11">Film</option>
                                <option value="15">Video Games</option>
                                <option value="18">Computers</option>
                                <option value="20">Mythology</option>
                                <option value="21">Sports</option>
                                <option value="22">Geography</option>
                                <option value="29">Comics</option>
                                <option value="30">Gadgets</option>
                                <option value="32">Cartoons & Animations</option>
                            </select>
                        </div>
                        <button :disabled="isPlaying" @click.prevent="handleFetch" class="cta">
                            <SvgSpinners12DotsScaleRotate v-if="loader"/>
                            <span v-if="!loader">Start Game</span>
                        </button>
                    </form>
                </div>
            </div>
            <div class="middle__pane">
                <div class="middle__pane-inner">
                    <!-- Gameboard Component -->
                    <GameBoard v-if="isPlaying" :gameData="gameData" @endGame="endGame" @incrementAmount="incrementAmount"/>
                    <!-- Placeholder Component -->
                    <Placeholder v-else :placeholderMessage="placeholderMessage"/>
                </div>
            </div>
            <div class="right__pane">
                <div class="cash__reward__container">
                    <div class="cash__reward__container-inner">
                        <ul>
                            <li v-for="(cash, index) in cashReward" :key="cash.id">
                                <span>{{ cash.id }}</span>
                                <span :class="{'active' : index === currentAmountIndex}">${{ cash.amount }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="bottom__nav">
            <div class="bottom__nav-inner">
                <button>
                    <IonCog @click="toggleLeftPane" />
                </button>
                <button>
                    <IonCash @click="toggleRightPane"/>
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { gsap } from 'gsap'
import { db } from '../../../firebase.config'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { useToast } from 'vue-toastification'
import Modal from '@/components/Modal/Modal.vue'
import GameBoard from '@/components/GameBoard/GameBoard.vue'
import Placeholder from '@/components/Placeholder/Placeholder.vue'
import SvgSpinners12DotsScaleRotate from '@/assets/icons/SvgSpinners12DotsScaleRotate.vue'
import IonCog from '@/assets/icons/IonCog.vue'
import IonCash from '@/assets/icons/IonCash.vue'
import { useStore } from 'vuex'


    const cashReward = ref([{
            id: 1, amount: 100
        },{
            id: 2, amount: 500
        },{
            id:3, amount: 1000
        },{
            id: 4, amount: 10000
        },{
            id: 5, amount: 50000
        },{
            id: 6, amount: 100000
        },{
            id: 7, amount: 150000
        },{
            id: 8, amount: 200000
        },{
            id: 9, amount: 250000
        },{
            id: 10, amount: 300000
        },{
            id: 11, amount: 400000
        },{
            id: 12, amount: 640000
        },{
            id: 13, amount: 750000
        },{
            id: 14, amount: 800000
        },{
            id: 15, amount: 1000000
    },].reverse())

    const store = useStore()

    const toast = useToast()

    const gameData = ref([])
    const showModal = ref(false)
    const loader = ref(false)
    const isPlaying = ref(false)
    const difficulty = ref('easy')
    const quizCategory = ref('Select preferred quiz type')
    const winningAmount = ref(0)
    let currentAmountIndex = ref(cashReward.value.length - 1)
    let categoryText = quizCategory.value
    const placeholderMessage = 'Setup game to play!'
    const isLeftPaneActive = ref(false);
    const isRightPaneActive = ref(false);



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

    // Update Current Quiz in firebase
    const updateQuiz = async (gameData) => {
        const docRef = doc(db, 'users', store.state.user.uid)
            
        try {
            // Get current state of the game
            // const questionIndex = currentQuestionIndex.value
            // const lifeLineValues = {...lifelines.value}
            // const question = currentQuestion.value
            await updateDoc(docRef, {'currentQuiz': gameData})
        } catch (err) {
            toast.error('Unable to update quiz in database.')
        }
    }

    // Get participants from firebase
    const getPrevious = async () => {
        const userRef = doc(db, 'users', store.state.user.uid)
        const docSnap = await getDoc(userRef)
        let response = null

        if (docSnap.exists()) {
            response = docSnap.data()
        } else {
            console.log('Document does not exist')
        }
        
        console.log(response.previousAttempts)

        return response.previousAttempts
        
    }

    // Update previous attempts data in firebase
    const updatePrevious = async () => {
        const userRef = doc(db, 'users', store.state.user.uid)

        try {
            // Get previous attempts data
            const previousList = await getPrevious();

            // Check if the attempt is already in the list
            const isNewAttempt = previousList.some(user => user.id === store.state.user.uid);

            // If the attempt is not in the list, add it
            if (!isNewAttempt) {
            previousList.push({
                name: quizCategory.value,
                image: '',
                value: quizCategory.value,
                difficulty: difficulty.value,
                selected: false,
            });

            // Update firestore with new data
            await updateDoc(docRef, {'participants': previousList})
    
            console.log('previousList sent!')
            } else {
                console.log('Category exists');
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Fetch function
    const handleFetch = async () => {
        const url = `https://opentdb.com/api.php?amount=15&category=${quizCategory.value}&difficulty=${difficulty.value}&type=multiple`
        console.log(categoryText)
        console.log(quizCategory.value)
        loader.value = true
        try {
            const response = await fetch(url)

            if (!response.ok) throw new Error('Response is defective')
            const data = await response.json()
            console.log(data)
            if (data.response_code !== 0) {
                toast.error('Error retrieving question data 😢. Please retry or pick another difficulty level.')
                loader.value = false
                isPlaying.value = false
            } else {
                gameData.value = {...data}

                await updateQuiz(gameData.value)

                loader.value = false
                isPlaying.value = true
            }
        } catch (err) {
            loader.value = false
            isPlaying.value = false
            toast.error('Unable to fetch questions. Try again')
        }
    }

    // Get current funds from firestore
    const getWalletBalance = async () => {
        const docRef = doc(db, 'users', store.state.user.uid)
        let response = null;
        
        try {
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                response = docSnap.data()
            } else {
                console.log('Document does not exist')
            }
        } catch (err) {
            toast.error('Unable to retrive wallet balance.')
        }

        return response.walletBalance
    }

    // Fetch total games value
    const getTotalGames = async () => {
        const docRef = doc(db, 'users', store.state.user.uid)
        let response = null;
        
        try {
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                response = docSnap.data()
            } else {
                toast.error('Document does not exist')
            }
        } catch (err) {
            toast.error('Unable to retrive data')
        }

        return response.totalGamesPlayed
    }

    // Update firestore Doc (update user's game money)
    const updateFunds = async (amount) => {
        const docRef = doc(db, 'users', store.state.user.uid)
        
        try {
            const currentFunds = await getWalletBalance()
            
            updateDoc(docRef, {'walletBalance': currentFunds + amount})
        } catch (err) {
            toast.error('Fund update failed')
        }
    }

    // Update total games played
    const updateTotal = async () => {
        const docRef = doc(db, 'users', store.state.user.uid)
        
        try {
            const currentAmount = await getTotalGames()
            
            updateDoc(docRef, {'totalGamesPlayed': currentAmount + 1})
            console.log('Done')
        } catch (err) {
            toast.error('Total Games update failed')
        }
    }

    // Emit functions
    const incrementAmount = () => {
        console.log('emit: ' + currentAmountIndex.value--)
        // return currentAmountIndex--
    }

    const endGame = async () => {
        const finalPrizeIndex = currentAmountIndex.value
        currentAmountIndex.value >= cashReward.value.length - 1 ? winningAmount.value = 0 : winningAmount.value = cashReward.value[finalPrizeIndex].amount

        // Update user's funds in firestore
        await updateFunds(winningAmount.value)
        await updateTotal()
        showModal.value = true
    }

    watch(quizCategory, () => {
        categoryText = quizCategory.value
    })

    console.log('curentAmountIndex: ' + currentAmountIndex.value)
</script>
<style lang="scss" scoped>
    
</style>