<template>
  <div class="home row justify-center q-mx-md">
    <div
      class="shadow-6 bg-white q-pa-xl q-mt-md full-width"
      style="max-width: 900px">
      <Landing />
    </div>
  </div>
</template>

<style lang="scss">
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
