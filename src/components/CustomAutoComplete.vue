<script>
/*
MIT License

Copyright (c) 2017 Charlie Kassel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
Due to the style of override used here, some small fragments from 
the npm package vuejs-auto-complete had to be included to fully specify behavior of
overriden functions. As such, the original MIT License for this code is included in this file. 
*/
import AutoComplete from "vuejs-auto-complete";

export default {
  name: "CustomAutoComplete",
  mixins: [AutoComplete],
  props: {
    refresh: Boolean //flipping this will cause the Autocomplete to refresh
  },
  methods: {
    updateToID: function(id) {
      this.display = id;
    },
    getID: function(value) {
      let result = false;
      this.source.forEach(element => {
        if (element["name"] === value) result = element["id"];
      });
      return result;
    },
    emitValue: function() {
      this.$emit("valueupdate", this.display);
    },
    close: function() {
      let id = this.getID(this.display);
      if (!(id === false)) {
        this.updateToID(id);
      }
      this.emitValue();
      this.results = null;
      this.error = null;
      this.removeEventListener();
      this.$emit("close");
    },

    arrayLikeSearch() {
      this.setEventListener();

      if (!this.display || this.display === null) {
        this.results = this.source;
        this.$emit("results", { results: this.results });
        this.loading = false;
        return true;
      }

      // this is so the search function stays out of the user's way when they are inputting codes
      // with the current list sizes, this measure is not necesarry but  in the event a very long
      //suggestion list is necesarry to support, this measure, in conjunction with a display limit of
      //10 results, will allow the autocomplete functionality to remain performant.
      let regex = /^(\d){5},.*$/;
      if (this.display.replace(/\s/g, "").match(regex)) {
        this.results = [];
        this.$emit("results", { results: this.results });
        this.loading = false;
        return true;
      }

      let results = [];
      this.source.forEach(element => {
        if (
          element["name"].toLowerCase().includes(this.display.toLowerCase())
        ) {
          results.push(element);
        }
      });
      this.results = results;
      this.$emit("results", { results: this.results });
      this.loading = false;
    }
  },
  watch: {
    refresh: function() {
      this.display = "";
    }
  }
};
</script>

<style lang="scss">
.autocomplete__results__item--error {
  color: red;
  text-align: left;
}

.autocomplete__results__item {
  padding: 7px 10px;
  cursor: pointer;
  text-align: left;
}
</style>
