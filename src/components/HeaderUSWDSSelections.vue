<template>
  <div id="uswdsHeader">
    <div class="usa-overlay"></div>
    <header class="usa-header usa-header--basic" role="banner">
      <div class="usa-nav-container">
        <div class="usa-navbar">
          <div class="usa-logo" id="basic-logo">
            <em class="usa-logo__text"
              ><h1 href="/" title="Home" aria-label="Home">
                {{ titleForSelectionHeader }}
              </h1></em
            >
          </div>
          <button class="usa-menu-btn">Menu</button>
        </div>
        <nav role="navigation" class="usa-nav">
          <button class="usa-nav__close">
            <img src="~uswds/src/img/close.svg" alt="close" />
          </button>
          <ul class="usa-nav__primary usa-accordion">
            <li class="usa-nav__primary-item">
              <button
                class="usa-accordion__button usa-nav__link  usa-current"
                aria-expanded="false"
                aria-controls="basic-nav-section-one"
              >
                <span>Menu</span>
              </button>
              <ul id="basic-nav-section-one" class="usa-nav__submenu">
                <li class="usa-nav__submenu-item">
                  <router-link to="/">Query Builder</router-link>
                </li>
                <li class="usa-nav__submenu-item">
                  <router-link to="/about">About</router-link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <div class="usa-overlay"></div>
    <main id="main-content"></main>
  </div>
</template>

<script>
export default {
  name: "HeaderUSWDS",
  props: {
    titleForSelectionHeader: String
  }
};
</script>

<style scoped lang="sass">
@import '~uswds/dist/css/uswds.css'
</style>
