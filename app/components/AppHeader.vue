<template>
    <header class="header">
        <h1 class="header--title">BoviSoft</h1>
        <nav class="header__nav-container">
            <ul class="header__nav-container-list">
                <li><NuxtLink to="/">Home</NuxtLink></li>
                <li><NuxtLink to="/">About</NuxtLink></li>
                <li><NuxtLink to="/">Contact</NuxtLink></li>
            </ul>
        </nav>
    </header>
</template>
<style lang="scss">
    .header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        &--title{
            color: black; //fix
        }
        &__nav-container{
            &-list{
                display: flex;
                gap: 20px;
                list-style: none;
            }
        }
    }
</style>