<template lang="">
    <button class="item__container" @click="toggleSelection">
        <div class="item__container-inner">
            <div class="item__container-inner-image" :style="{ backgroundImage: 'url(' + item.image + ')' }"></div>
            <div class="item__container-inner-details">
                <div class="detail__name">
                    <span>{{ item.name }}</span>
                    <IonIosCheckmarkCircle :class="{'active' : item.selected === true}"/>
                </div>
            </div>
        </div>
    </button>
</template>
<script setup>
import { defineEmits } from 'vue'
import IonIosCheckmarkCircle from '@/assets/icons/IonIosCheckmarkCircle.vue'

const { item } = defineProps(['item']);
const emits = defineEmits(['toggleSelection', 'item-selected', 'item-clicked'])

const toggleSelection = () => {
  // Emit a custom event to notify the
  // parent component about the selection
  const url = new URL(window.location)
  console.log(url.pathname)

  url.pathname == '/dashboard' ? emits('item-selected', { category: item.name, value: item.value }) : emits('item-clicked', item.value);

};
</script>
<style lang="sass" scoped>

</style>