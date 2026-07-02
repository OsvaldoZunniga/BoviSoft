<template>
    <div class="app">
        <AppHeader/>
        <main class="app__container">
            <slot />
        </main>
        <AppFooter/>
    </div>
</template>
<style>
    .app {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100dvh;
    }
    .app__container {
        flex: 1;
    }

</style>