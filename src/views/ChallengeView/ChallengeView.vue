<template>
  <Modal v-if="showModal" :amount="winningAmount" />
  <div v-if="loader" class="loading__screen">
    <div class="loading__screen-inner">
      <SvgSpinners12DotsScaleRotate />
      <p>Confirming game details...</p>
    </div>
  </div>
  <div class="challenge__wrapper">
    <div class="challenge__wrapper-inner">
      <div class="left__pane">
        <div class="cash__reward__container">
          <div class="cash__reward__container-inner">
            <ul>
              <li v-for="(cash, index) in cashReward" :key="cash.id">
                <span>{{ cash.id }}</span>
                <span :class="{ active: index === currentAmountIndex }"
                  >${{ cash.amount }}</span
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="middle__pane">
        <div class="middle__pane-inner">
          <!-- Gameboard Component -->
          <GameBoard
            v-if="isPlaying"
            :gameData="gameData"
            @endGame="endGame"
            @incrementAmount="incrementAmount"
          />
          <!-- Placeholder Component -->
          <Placeholder v-else :placeholderMessage="placeholderMessage" />
        </div>
      </div>
      <div class="right__pane">
        <!-- Leaderboard -->
        <div class="leaderboard__container">
          <h2>Leaderboard</h2>
          <ScoreBoard />
        </div>
      </div>
    </div>

    <div class="bottom__nav">
      <div class="bottom__nav-inner">
        <button @click="toggleLeftPane">
          <IonCash />
        </button>
        <button @click="toggleRightPane">
          <Fa6SolidRankingStar />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeMount } from "vue";
import { gsap } from "gsap";
import { useRouter } from "vue-router";
import { db } from "../../../firebase.config";
import { doc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";
import { useToast } from "vue-toastification";
import Modal from "@/components/Modal/Modal.vue";
import GameBoard from "@/components/GameBoard/GameBoard.vue";
import Placeholder from "@/components/Placeholder/Placeholder.vue";
import ScoreBoard from "@/components/ScoreBoard";

import SvgSpinners12DotsScaleRotate from "@/assets/icons/SvgSpinners12DotsScaleRotate.vue";
import IonCash from "@/assets/icons/IonCash.vue";
import Fa6SolidRankingStar from "@/assets/icons/Fa6SolidRankingStar.vue";
import { useStore } from "vuex";

const cashReward = ref(
  [
    {
      id: 1,
      amount: 100,
    },
    {
      id: 2,
      amount: 500,
    },
    {
      id: 3,
      amount: 1000,
    },
    {
      id: 4,
      amount: 10000,
    },
    {
      id: 5,
      amount: 50000,
    },
    {
      id: 6,
      amount: 100000,
    },
    {
      id: 7,
      amount: 150000,
    },
    {
      id: 8,
      amount: 200000,
    },
    {
      id: 9,
      amount: 250000,
    },
    {
      id: 10,
      amount: 300000,
    },
    {
      id: 11,
      amount: 400000,
    },
    {
      id: 12,
      amount: 640000,
    },
    {
      id: 13,
      amount: 750000,
    },
    {
      id: 14,
      amount: 800000,
    },
    {
      id: 15,
      amount: 1000000,
    },
  ].reverse()
);

const store = useStore();

const toast = useToast();

const router = useRouter();

const placeholderMessage = "Kindly wait while the game is being setup...";

const gameData = ref([]);
const showModal = ref(false);
const loader = ref(true);
const isPlaying = ref(false);
const winningAmount = ref(0);
let currentAmountIndex = ref(cashReward.value.length - 1);
console.log(store.state.user);
const players = ref([]);

const isLeftPaneActive = ref(false);
const isRightPaneActive = ref(false);

const animateLeftPane = (show) => {
  gsap.to(".left__pane", {
    y: show ? 0 : "-1000%",
    opacity: show ? 1 : 0,
    display: show ? "block" : "none",
    duration: 0.3,
    ease: "power3.in",
  });
};

const animateRightPane = (show) => {
  gsap.to(".right__pane", {
    y: show ? 0 : "-1000%",
    opacity: show ? 1 : 0,
    display: show ? "block" : "none",
    duration: 0.3,
    ease: "power3.in",
  });
};

const toggleLeftPane = () => {
  animateLeftPane(!isLeftPaneActive.value);
  isLeftPaneActive.value = !isLeftPaneActive.value;
};

const toggleRightPane = () => {
  animateRightPane(!isRightPaneActive.value);
  isRightPaneActive.value = !isRightPaneActive.value;
};

// Extract game code from url
const url = new URL(window.location);
const path = url.pathname;
const pathParts = path.split("/");
const gameCode = pathParts[pathParts.length - 1];

// Get participants from firebase
const getPlayers = async (gameCode) => {
  const docRef = doc(db, "challenges", gameCode);
  const docSnap = await getDoc(docRef);
  let response = null;

  if (docSnap.exists()) {
    response = docSnap.data();
  } else {
    console.log("Document does not exist");
  }

  console.log(response.participants);

  return response.participants;
  // username.value = response.username
};

// Get challenge details
const challengeDetails = async () => {
  const docRef = doc(db, "challenges", gameCode);
  const docSnap = await getDoc(docRef);
  let response = null;

  if (docSnap.exists()) {
    response = docSnap.data();
  } else {
    console.log("Document does not exist");
  }

  return response;
};

// Add new user to the list of participants
const addUser = async () => {
  // const userRef = doc(db, 'users', store.state.user.uid)
  const docRef = doc(db, "challenges", gameCode);

  try {
    // Get participants data
    const previousList = await getPlayers(gameCode);

    // Check if the new user is already in the list
    const isNewUser = previousList.some(
      (user) => user.id === store.state.user.uid
    );

    // If the new user is not in the list, add them
    if (!isNewUser) {
      previousList.push({
        id: store.state.user.uid,
        avatar: store.state.user.photoURL,
        name: store.state.user.displayName.split(" ")[0],
        score: 0,
      });

      // Update firestore with new data
      await updateDoc(docRef, { participants: previousList });

      console.log("previousList sent!");
    } else {
      console.log("User already exists in the list");
    }
  } catch (error) {
    console.log(error);
  }
};

// Fetch questions
const fetchQuestions = async () => {
  const docRef = doc(db, "challenges", gameCode);
  let response = null;

  if (isPlaying) {
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        response = docSnap.data();
      } else {
        console.log("Document does not exist");
      }
    } catch (err) {
      console.log(err.message);
    }
  } else {
    return;
  }

  gameData.value = { ...response.questionData };

  setTimeout(() => {
    isPlaying.value = true;
    console.log(gameData.value);
    console.log("Active");
  }, 5000);
};

/******************
Challenge Logic
******************/

// If it is a challenge, update user details
// in the challenge collection firebase
const updateChallengeDetails = async (amount) => {
  // Challenge Document Reference
  const docRef = doc(db, "challenges", gameCode);
  let player = null;
  try {
    // Get & update player details
    const playersList = await getPlayers(gameCode);

    player = playersList.filter((player) => player.id == store.state.user.uid);
    player[0].score = amount;

    // Inject Player back into List
    await updateDoc(docRef, { participants: playersList });
  } catch (error) {
    console.log(error);
  }
};

// Deduct wager amount from player
const deductWager = async () => {
  const challengeRef = doc(db, "challenges", gameCode);
  const docRef = doc(db, "users", store.state.user.uid);

  try {
    let { wagerAmount, bounty } = await challengeDetails();

    if (wagerAmount == null) {
      return;
    } else {
      let participantWalletBalance = await getWalletBalance();

      if (wagerAmount > participantWalletBalance) {
        toast.error("Insufficient funds!");
        router.push("/dashboard");
      } else {
        // Subtract wagerAmount from participant wallet balance
        participantWalletBalance = participantWalletBalance - wagerAmount;

        // Add wager to bounty
        bounty += wagerAmount;

        // Update challenge bounty
        await updateDoc(challengeRef, { bounty: bounty });

        // Update participant balance
        // const currentFunds = await getWalletBalance()
        await updateDoc(docRef, { walletBalance: participantWalletBalance });

        // Add user
        addUser();
      }

      console.log(wagerAmount, bounty, participantWalletBalance);
    }
  } catch (err) {
    console.log(err);
  }
};

// Get current funds from firestore
const getWalletBalance = async () => {
  const docRef = doc(db, "users", store.state.user.uid);
  let response = null;

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      response = docSnap.data();
    } else {
      console.log("Document does not exist");
    }
  } catch (err) {
    toast.error("Unable to retrive wallet balance.");
  }

  return response.walletBalance;
};

// Fetch total games value
const getTotalGames = async () => {
  const docRef = doc(db, "users", store.state.user.uid);
  let response = null;

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      response = docSnap.data();
    } else {
      toast.error("Document does not exist");
    }
  } catch (err) {
    toast.error("Unable to retrive data");
  }

  return response.totalGamesPlayed;
};

// Update firestore Doc (update user's game money)
const updateFunds = async (amount) => {
  const docRef = doc(db, "users", store.state.user.uid);

  try {
    const currentFunds = await getWalletBalance();
    updateDoc(docRef, { walletBalance: currentFunds + amount });
  } catch (err) {
    toast.error("Fund update failed");
  }
};

// Update total games played
const updateTotal = async () => {
  const docRef = doc(db, "users", store.state.user.uid);

  try {
    const currentAmount = await getTotalGames();

    updateDoc(docRef, { totalGamesPlayed: currentAmount + 1 });
    console.log("Done");
  } catch (err) {
    toast.error("Total Games update failed");
  }
};

// Initialize game logic
const initialize = async () => {
  try {
    // Extract
    // Fetch participants
    players.value = await getPlayers(gameCode);
    console.log(players.value);
  } catch (err) {
    console.log(err.message);
    toast.error(err.message);
  }
};

// Emit functions
const incrementAmount = () => {
  console.log("emit: " + currentAmountIndex.value--);
  updateChallengeDetails(cashReward.value[currentAmountIndex.value].amount);
  console.log(cashReward.value[currentAmountIndex.value].amount);
};

const endGame = async () => {
  const finalPrizeIndex = currentAmountIndex.value;
  currentAmountIndex.value >= cashReward.value.length - 1
    ? (winningAmount.value = 0)
    : (winningAmount.value = cashReward.value[finalPrizeIndex].amount);

  // Update user's funds in firestore
  await updateFunds(winningAmount.value);
  await updateTotal();
  showModal.value = true;
};

const checkGameCode = async () => {
  // Check if the game code exists in Firestore
  const docRef = doc(db, "challenges", gameCode);

  try {
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      // Redirect to the dashboard if the game code is not found
      toast.error("Invalid game code. Please enter a valid game code!");
      router.push("/dashboard");
    } else {
      // Run all relevant functions
      initialize();
      deductWager();
      fetchQuestions();
      loader.value = false;
    }
  } catch (err) {
    toast.error(err.message);
  }
};

onBeforeMount(() => checkGameCode());
</script>

<style lang="scss" scoped></style>
