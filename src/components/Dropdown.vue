<template>
  <div>
    <select>
      <!--option v-for="(option, name) in options" :values="option"
        >{{ name }}
      </option-->
    </select>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      required: true
    }
  }
};
</script>
