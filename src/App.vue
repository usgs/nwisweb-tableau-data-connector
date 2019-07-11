<template>
  <div id="app">
    <HeaderUSWDSBanner></HeaderUSWDSBanner>
    <HeaderUSGS></HeaderUSGS>
    <HeaderUSWDSSelections
      titleForSelectionHeader="NWISWeb Tableau Web Data Connector"
    ></HeaderUSWDSSelections>
    <router-view style="min-height: 500px;"> </router-view>
    <FooterUSGS></FooterUSGS>
    <notifications group="Error" />
  </div>
</template>

<script>
// @ is an alias to /src
import HeaderUSWDSBanner from "@/components/HeaderUSWDSBanner";
import HeaderUSWDSSelections from "@/components/HeaderUSWDSSelections";
import HeaderUSGS from "@/components/HeaderUSGS";
import FooterUSGS from "@/components/FooterUSGS";

export default {
  name: "app",
  components: {
    HeaderUSWDSBanner,
    HeaderUSWDSSelections,
    HeaderUSGS,
    FooterUSGS
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  min-height: 500px;
}
</style>
