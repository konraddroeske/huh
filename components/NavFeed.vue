<template>
  <button class="downArrow" @click="onClick">
    <div class="explore">Explore</div>
    <slot />
  </button>
</template>

<script>
export default {
  methods: {
    onClick(event) {
      this.$emit("clicked")
    },
  },
}
</script>

<style lang="scss" scoped>
.downArrow {
  border: none;
  background-color: transparent;
  padding: 0;

  font-family: $font-display;
  text-transform: uppercase;
  font-weight: $extrabold;
  font-size: 2.5rem;
  line-height: 1;
  position: relative;

  .explore {
    color: $accent;
    text-transform: uppercase;
    text-align: center;
    font-weight: $medium;
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
  }
}
</style>
