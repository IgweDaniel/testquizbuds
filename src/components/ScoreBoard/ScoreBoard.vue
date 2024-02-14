<template lang="">
  <div class="leaderboard__container-inner">
    <ul>
      <SvgSpinners12DotsScaleRotate v-if="!isReady" />
      <transition-group
        name="leaderboard-slide"
        class="transition-group-li"
        tag="li"
        v-else
      >
        <li v-for="(player, index) in sortedPlayers" :key="index">
          <span class="image__position">
            <span
              class="image"
              :style="{ 'background-image': 'url(' + player.avatar + ')' }"
            ></span>
            <span class="position">
              <span>{{ index + 1 }}</span>
            </span>
          </span>
          <span class="name">{{ player.name }}</span>
          <span class="prize">${{ player.score }}</span>
        </li>
      </transition-group>
    </ul>
  </div>
</template>
<script setup>
import { ref, watchEffect } from "vue";
import { db } from "../../../firebase.config";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import SvgSpinners12DotsScaleRotate from "@/assets/icons/SvgSpinners12DotsScaleRotate.vue";

const players = ref([]);
const isReady = ref(false);
const sortedPlayers = ref([]);

// Extract game code from url
const url = new URL(window.location);
const path = url.pathname;
const pathParts = path.split("/");
const gameCode = pathParts[pathParts.length - 1];

// Realtime participants update
const docRef = doc(db, "challenges", gameCode);
const thisData = [];

onSnapshot(docRef, (snapshot) => {
  players.value = snapshot.data()?.participants || [];
  isReady.value = true;
});

// Computed property to return sorted copy of players

watchEffect(() => {
  sortedPlayers.value = [...players.value].sort((a, b) => b.score - a.score);
});

// watchEffect(() => {
//   if (participants !== undefined) {
//     isReady.value = true
//   }
// })
</script>
<style lang="scss" scoped>
.leaderboard-slide-enter-active,
.leaderboard-slide-leave-active {
  transition: transform 0.5s;
}

.transition-group-li {
  display: block;
}

.leaderboard-slide-enter,
.leaderboard-slide-leave-to {
  transform: translateY(50px);
  opacity: 0;
}
</style>
