<template>
    <div class="paf__container">
        <div class="paf__container-inner">
            <div class="paf__avatar__container">
                <div class="paf__avatar" :style="{'background-image': 'url(' + response[0].avatar + ')'}"></div>
            </div>
            <div class="paf__message">{{ response[0].name }} thinks it's {{ response[1] }}</div>
            <div class="paf__close" @click="closeIcon = true">
                <IonIosCloseCircle />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue'
import IonIosCloseCircle from '@/assets/icons/IonIosCloseCircle.vue'

const { friendResponse } = defineProps(['friendResponse'])

const response = [...friendResponse]

const closeIcon = ref(false)

console.log(closeIcon.value)
const emits = defineEmits(['closeWindow'])

watch(closeIcon, () => {
    emits('closeWindow')
})

</script>

<styles lang="scss" scoped>

</styles>