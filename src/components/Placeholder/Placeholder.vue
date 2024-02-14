<template lang="">
    <div class="placeholder__container">
        <div class="placeholder__container-inner">
            <div class="gif__container">
                <div class="gif__container-gif"></div>
            </div>
            <div class="waiting__text">
                <span>{{ placeholderMessage }}</span> 
            </div>
        </div>
    </div>
</template>
<script setup>
defineProps(['placeholderMessage'])


</script>
<style lang="">
    
</style>