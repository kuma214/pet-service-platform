<template>
    <div id="app">
        <div class="container">
            <router-view />
            <!-- 라우팅된 컴포넌트를 이곳에 렌더링 -->
        </div>
    </div>
</template>

<script>
export default {
    name: 'App',
};
</script>

<style>
@font-face {
    font-family: 'HancomMalangMalang-Regular';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2406-1@1.0/HancomMalangMalang-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
}
@font-face {
    font-family: 'GmarketSansMedium';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
}

#app {
    display: flex;
    justify-content: center;
    font-family: 'GmarketSansMedium', 'HancomMalangMalang-Regular', Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.container {
    padding: 0 !important;
    width: 100%;
    height: 100%;
    /* min-width: 500px; */
    max-width: 600px;
    margin: 0 auto;
    background-color: white;
    /* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); */
    /* border-radius: 10px; */
    min-height: 811px;
    overflow: hidden;
}

@media screen and (max-width: 600px) {
    .container {
        width: 500px;
        justify-items: center;
    }
}
</style>
