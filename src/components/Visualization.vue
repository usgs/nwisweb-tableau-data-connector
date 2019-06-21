<template>
  <div id="visualization">
    <img alt="USGS Logo" src="../assets/USGS_logo_green.svg" />
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: "Visualization",
  props: {
    msg: String
  }
};
</script>

<style scoped lang="scss"></style>
