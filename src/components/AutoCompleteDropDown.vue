<template>
  <div>
    <br />
    <label class="autocomplete-dropdown">State or Territory</label>
    <input
      class="usa-input"
      type="text"
      v-model="searchText"
      @input="onChange"
      list="states"
      style="width: 300px; margin: auto;"
    />
    <datalist id="states">
      <option value>- Select -</option>
      <option value="al">Alabama</option>
      <option value="ak">Alaska</option>
      <option value="aq">American Samoa</option>
      <option value="az">Arizona</option>
      <option value="ar">Arkansas</option>
      <option value="ca">California</option>
      <option value="co">Colorado</option>
      <option value="ct">Connecticut</option>
      <option value="de">Delaware</option>
      <option value="dc">Dist. of Columbia</option>
      <option value="fl">Florida</option>
      <option value="ga">Georgia</option>
      <option value="gu">Guam</option>
      <option value="hi">Hawaii</option>
      <option value="id">Idaho</option>
      <option value="il">Illinois</option>
      <option value="in">Indiana</option>
      <option value="ia">Iowa</option>
      <option value="ks">Kansas</option>
      <option value="ky">Kentucky</option>
      <option value="la">Louisiana</option>
      <option value="me">Maine</option>
      <option value="md">Maryland</option>
      <option value="ma">Massachusetts</option>
      <option value="mi">Michigan</option>
      <option value="mn">Minnesota</option>
      <option value="ms">Mississippi</option>
      <option value="mo">Missouri</option>
      <option value="mt">Montana</option>
      <option value="ne">Nebraska</option>
      <option value="nv">Nevada</option>
      <option value="nh">New Hampshire</option>
      <option value="nj">New Jersey</option>
      <option value="nm">New Mexico</option>
      <option value="ny">New York</option>
      <option value="nc">North Carolina</option>
      <option value="nd">North Dakota</option>
      <option value="mp">Northern Mariana Islands</option>
      <option value="oh">Ohio</option>
      <option value="ok">Oklahoma</option>
      <option value="or">Oregon</option>
      <option value="pa">Pennsylvania</option>
      <option value="pr">Puerto Rico</option>
      <option value="ri">Rhode Island</option>
      <option value="sc">South Carolina</option>
      <option value="sd">South Dakota</option>
      <option value="tn">Tennessee</option>
      <option value="tx">Texas</option>
      <option value="ut">Utah</option>
      <option value="vt">Vermont</option>
      <option value="vi">Virgin Islands</option>
      <option value="va">Virginia</option>
      <option value="wa">Washington</option>
      <option value="wv">West Virginia</option>
      <option value="wi">Wisconsin</option>
      <option value="wy">Wyoming</option>
    </datalist>

    <ul v-show="isOpen" class="autocomplete-results">
      <li
        v-for="(result, i) in results"
        :key="i"
        @click="setResult(result)"
        class="autocomplete-result"
      >
        {{ result }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DropDownUSWDS",
  data() {
    return {
      searchText: "",
      results: [],
      isOpen: false
    };
  },
  methods: {
    // computed: function() {
    //     var optionArray = []
    //         for (var key in this.options) {
    //             if (has(this.options, key) && isEnumerable(this.options, key)) {
    //                 optionArray.push([key, this.options[key]]);
    //             }
    //         }
    //     return Object.entries(this.options).filter((option) => {
    //         var optionText = option[0].toUpperCase()
    //         return optionText.match(this.searchText.toUpperCase())
    //     })
    // },
    // onChange() {
    //     this.isOpen = true;
    //     this.filterResults();
    // },
    // setResult(result) {
    //     this.searchText = result;
    //     this.isOpen = false;
    // },
  }
};
</script>
