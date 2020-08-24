<template>
  <div ref="container" :class="`category-${variant}`">
    <div v-if="variant === 'gradient'" class="explore">Explore</div>
    <nuxt-link ref="link" :event="disabled ? '' : 'click'" :to="to">{{
      name
    }}</nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      required: true,
      validator(value) {
        return ['light', 'dark', 'gradient'].includes(value)
      },
    },
    to: {
      type: [String, Object],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    startGradient() {
      this.$refs.container.classList.add('largeGradient')
    },
    endGradient() {
      this.$refs.container.classList.remove('largeGradient')
    },
  },
}
</script>

<style lang="scss" scoped>
.explore {
  color: $accent;
  text-transform: uppercase;
  text-align: center;
  font-weight: $medium;
  font-size: 1rem;
  margin-bottom: 0.5rem;

  @media (min-width: $bp-desktop) {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
}

.category-dark {
  font-family: $font-display;
  text-transform: uppercase;
  font-weight: $extrabold;
  font-size: 4rem;
  line-height: 1;

  a,
  a:visited {
    color: $white;
    text-decoration: none;

    &:hover,
    &:focus {
      color: $accent;
    }
  }
}

.category-light {
  font-family: $font-display;
  text-transform: uppercase;
  font-weight: $extrabold;
  font-size: 4rem;
  line-height: 1;

  a,
  a:visited {
    color: $black;
    text-decoration: none;

    &:hover,
    &:focus {
      color: $accent;
    }
  }

  @media (min-width: $bp-desktop) {
    font-size: 5rem;
  }

  @media (min-width: $bp-lg-desktop) {
    font-size: 6rem;
  }
}

.category-gradient {
  font-family: $font-display;
  text-transform: uppercase;
  font-weight: $extrabold;
  font-size: 4rem;
  line-height: 1;
  position: relative;

  ::before {
    content: '';
    position: absolute;
    z-index: -1;
    height: 2.5rem;
    width: 2.5rem;
    left: calc(50% - 1.25rem);
    top: calc(50% - 1.25rem);
    border-radius: 180px;
    background: $accent;
    box-shadow: 0 0 6rem 6rem $accent;
    transition: all 0.6s;
    opacity: 0.3;
    filter: blur(10px);
  }

  &:hover {
    ::before {
      box-shadow: 0 0 9rem 9rem $accent;
      opacity: 0.4;
    }
  }

  a,
  a:visited {
    color: $black;
    text-decoration: none;
  }

  @media (min-width: $bp-tablet) {
    font-size: 7rem;
    ::before {
      box-shadow: 0 0 10.5rem 10.5rem $accent;
    }

    &:hover {
      ::before {
        box-shadow: 0 0 15.5rem 15.5rem $accent;
        opacity: 0.4;
      }
    }
  }

  @media (min-width: $bp-desktop) {
    font-size: 8rem;
    ::before {
      box-shadow: 0 0 12rem 12rem $accent;
    }

    &:hover {
      ::before {
        box-shadow: 0 0 18rem 18rem $accent;
        opacity: 0.4;
      }
    }
  }
}
</style>