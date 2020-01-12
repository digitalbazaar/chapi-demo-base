<template>
  <div class="home row justify-center">
    <div
      class="shadow-6 q-mx-md bg-white q-pa-xl q-mt-md">
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
