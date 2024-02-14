<template lang="">
    <div class='landing__container'>
        <div class="landing__container-inner">
            <div class="landing__container-inner-left">
                <div class="title">
                    <h1>
                        Unleash <br> Your <span class="gradient">Intellectual </span> Capabilities...
                        <!-- <span class="c__line">
                            <span class="c__line-inner">
                                Unleash
                            </span>
                        </span> -->
                    </h1>
                    <span class="caption">Explore the world's most specialized <br>quizzes.</span>
                    <router-link to="/signup" v-if="!authIsReady && !user">
                        <span>Sign up</span>
                        <IonArrowForwardCircle />
                    </router-link>
                </div>
            </div>
            <div class="landing__container-inner-right">
                <div class="landing__hero"> 
                    <div class="landing__images">
                        <div class="landing__images-pad">
                            <!-- <img src="../../assets/images/game-pad.png" alt=""> -->
                        </div>
                        <div class="landing__images-engineer">
                            <!-- <img src="../../assets/images/engineer.png" alt=""> -->
                        </div>  
                        <div class="landing__images-nature">
                            <!-- <img src="../../assets/images/nature-and-science.png" alt=""> -->
                        </div>  
                        <div class="landing__images-literature">
                            <!-- <img src="../../assets/images/literature.png" alt=""> -->
                        </div>  
                    </div>       
                </div>
            </div>
        </div>

        <!-- Features -->
        <section class="landing__container__features">
            <div class="landing__container__features-inner">
                <div class="feature__blocks">
                    <div class="feature__blocks-inner">
                        <div class="feature__block feature__block-1">
                            <div class="feature__block__left">
                                <div class="title">
                                    <h1>Discover Unique Topics</h1>
                                    <!-- <IonSearchSharp /> -->
                                    
                                </div>
                                <div class="body">
                                    <p>Unearth hidden gems and indulge your curiosities from arcane
                                        <br>arts to futuristic tech, our niche quizzes challenge even the most
                                        <br>passionate aficionados.
                                    </p>
                                    <router-link to='/'>
                                        <span class="line transition__line">
                                        </span>
                                        <span>Play now</span>
                                    </router-link>
                                </div>
                            </div>
                            <div class="feature__block__right">
                                <div class="image__container">
                                    <div class="image__container-image"></div>
                                </div>
                            </div>
                        </div>
                        <div class="feature__block feature__block-2">
                            <div class="feature__block__left">
                                <div class="title">
                                    <h1>Personalized Quizzing <br>Experience</h1>
                                    <!-- <IonSearchSharp /> -->
                                    
                                </div>
                                <div class="body">
                                    <p>Crafted with precision, every quiz feels tailor-made for you. <br />Dive deep, expand your knowledge, and conquer challenges <br />designed specifically for the enthusiast in you.</p>
                                    <router-link to='/'>
                                        <span class="line transition__line">
                                            <span class="line__inner"></span>
                                        </span>
                                        <span>Play now</span>
                                    </router-link>
                                </div>
                            </div>
                            <div class="feature__block__right">
                                <div class="image__container">
                                    <div class="image__container-image"></div>
                                </div>
                            </div>
                        </div>
                        <div class="feature__block feature__block-3">
                            <div class="feature__block__left">
                                <div class="title">
                                    <h1>Compete and connect</h1>
                                    <!-- <IonSearchSharp /> -->
                                    <div class="line transition__line">
                                        <div class="line__inner"></div>
                                    </div>
                                </div>
                                <div class="body">
                                    <p>Rise up the ranks on the leaderboard. Connect with fellow enthusiasts, <br />challenge friends, and showcase your expertise.</p>
                                    <router-link to='/'>
                                        <span class="line transition__line">
                                            <span class="line__inner"></span>
                                        </span>
                                        <span>Play now</span>
                                    </router-link>
                                </div>
                            </div>
                            <div class="feature__block__right">
                                <div class="image__container">
                                    <div class="image__container-image"></div>
                                </div>
                            </div>
                        </div>
                        <div class="feature__block feature__block-4">
                            <div class="feature__block__left">
                                <div class="title">
                                    <h1>Become a Quizmaster</h1>
                                    <div class="line transition__line">
                                        <div class="line__inner"></div>
                                    </div>
                                </div>
                                <div class="body">
                                    <p>Got a unique topic in mind? create & share your own quizzes. Gather followers <br>and leave your mark in the Quizbuds community.</p>
                                    <router-link to='/'>
                                        <span class="line transition__line">
                                            <span class="line__inner"></span>
                                        </span>
                                        <span>Create quiz</span>
                                    </router-link>
                                </div>
                            </div>
                            <div class="feature__block__right">
                                <div class="image__container">
                                    <div class="image__container-image"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup>
    import { onMounted, computed, ref } from 'vue'
    import { RouterLink } from 'vue-router';
    import { useStore } from 'vuex'
    import gsap from 'gsap'
    import { ScrollTrigger } from 'gsap/ScrollTrigger'
    import { TextPlugin } from 'gsap/TextPlugin'
    import IonArrowForwardCircle from '@/assets/icons/IonArrowForwardCircle.vue'
    import IonSearchSharp from '@/assets/icons/IonSearchSharp.vue'
    
    const store = useStore()

    const user = computed(() => store.state.user)

    const authIsReady = computed(() => store.state.authIsReady)
    
    gsap.registerPlugin(ScrollTrigger)
    
    // onMounted (() => {
    //     const blocks = document.querySelectorAll('.feature__block')

    //     blocks.forEach(block => {
    //         gsap.timeline({
    //             scrollTrigger: {
    //                 scrub: 1,
    //                 trigger: block,
    //                 start: 'top 50%',
    //                 end: 'bottom 30%',
    //                 scrub: true,
    //                 // markers: true
    //             }
    //         }).to('.feature__block .title', {
    //             ease: 'expo.in',
    //             duration: .2,
    //             yPercent: -150
    //         })
    //     })
        
    // })
</script>
<style lang="scss" scoped></style>