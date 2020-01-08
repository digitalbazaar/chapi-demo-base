<template>
  <div class="home">
    <div class="box shadow-6">
      <Landing />
    </div>
  </div>
</template>

<style lang="scss">
.box {
  margin-top: 50px;
  margin-left: 20%;
  margin-right: 20%;
  padding: 50px;
  background-color: white;
}
</style>

<script>
// @ is an alias to /src
import Landing from '@/components/Landing.vue';

export default {
  name: 'Home',
  components: {
    Landing
  }
};
</script>
