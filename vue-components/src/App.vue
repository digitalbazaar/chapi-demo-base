<template>
  <div
    id="app"
    style="max-width: 1200px"
    class="q-mx-auto">
    <img
      alt="Demo Header"
      class="full-width"
      :src="`${publicPath}assets/mock_nav_1200_width.png`">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Source Sans Pro', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>
export default {
  data() {
    return {
      publicPath: process.env.BASE_URL
    };
  }
};
</script>
