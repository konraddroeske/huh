<template>
  <div class="curator">
    <div class="upper">
      <LazyImage
        class="artistImage"
        :src="artist.picture.url"
        :alt="artist.name"
        :max-width="1000"
      />
    </div>
    <div class="lower">
      <h3 class="name sectionHeadline">{{ artist.name }}</h3>
      <p class="city">{{ artist.city.name }}</p>
      <div class="links">
        <div class="website">
          <h4 class="accentText">Website</h4>
          <a
            :href="artist.website"
            target="_blank"
            rel="canonical noopener noreferrer"
            >{{ websiteFormatted }}</a
          >
        </div>
        <div class="social">
          <h4 class="accentText">Social</h4>
          <a
            :href="artist.socialUrl"
            target="_blank"
            rel="canonical noopener noreferrer"
            >@{{ artist.social }}</a
          >
        </div>
      </div>
      <div v-if="moodsFormatted.length > 0">
        <h4 class="accentText">Moods</h4>
        <ul class="moods">
          <li v-for="(mood, index) of moodsFormatted" :key="index" class="mood">
            <nuxt-link
              :to="`/categories?filters=${mood.toLowerCase()}`"
              @click.native="routeFilter(mood.toLowerCase())"
              >{{ mood }}</nuxt-link
            >
          </li>
        </ul>
      </div>
      <div>
        <h4 class="accentText">About</h4>
        <p class="bodyText">
          {{ artist.about }}
        </p>
      </div>
      <Button @clicked="routeFilter(artist.name)"
        >Show {{ artist.name.replace(/ .*/, "") }}'s posts</Button
      >
    </div>
  </div>
</template>

<script>
import Button from "@/components/Button"
import categoryRouteReset from "~/mixins/categoryRouteReset"

export default {
  components: {
    Button,
  },
  mixins: [categoryRouteReset],
  props: {
    artist: {
      type: Object,
      default: () => {
        return {
          name: {
            type: String,
            required: true,
          },
          website: {
            type: String,
            required: false,
            default: null,
          },
          social: {
            type: String,
            required: false,
            default: null,
          },
          socialUrl: {
            type: String,
            required: false,
            default: null,
          },
          about: {
            type: String,
            required: true,
          },
          city: {
            type: Object,
            required: true,
          },
          posts: {
            type: Array,
            required: false,
          },
        }
      },
    },
  },

  computed: {
    websiteFormatted() {
      return this.artist.website.replace(/^https?:\/\//i, "")
    },
    moodsFormatted() {
      return this.artist.posts
        ? this.artist.posts.reduce(this.getMoods, [])
        : null
    },
  },
  methods: {
    getMoods(acc, post) {
      if (!post?.mood?.mood || acc.includes(post.mood.mood)) {
        return acc
      }

      return [...acc, post.mood.mood]
    },
  },
}
</script>

<style lang="scss" scoped>
.curator {
  width: 100%;
  display: flex;
  flex-direction: column;
  word-break: break-word;

  .upper {
    width: 100%;
    height: 20rem;
    position: relative;
  }

  img {
    display: block;
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .lower {
    padding: 2rem 1.5rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .name {
    text-align: left;
  }

  .city {
    display: block;
    width: 100%;
    font-size: $font-sm-md;
    font-weight: $medium;
    text-align: left;
    text-transform: uppercase;
    margin: 0;
  }

  .links {
    display: flex;
    flex-wrap: wrap;
  }

  .website,
  .social {
    flex-grow: 1;
  }

  button {
    margin: auto auto 0 auto;
    display: block;
  }

  .bodyText {
    margin-top: 0;
    margin-bottom: 2rem;
  }

  a,
  span {
    font-family: $font-display;
    font-size: 1.1rem;
    font-weight: $semibold;
  }

  a,
  a:visited {
    color: $black;
    text-decoration: none;

    &:hover,
    &:focus {
      color: $accent;
    }
  }

  .moods {
    list-style: none;
    padding-left: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
  }

  .mood {
    text-transform: capitalize;
    margin-right: 1.5rem;
    position: relative;

    &::before {
      content: "•";
      font-size: 1.1rem;
      position: absolute;
      right: -1rem;
      top: 0;
    }

    a,
    a:visited {
      color: $black;
      text-decoration: none;

      &:hover,
      &:focus {
        color: $accent;
      }
    }
  }

  .mood:last-child {
    &::before {
      content: "";
    }
  }

  .mood:last-child {
    margin-right: 0;
  }

  @media (min-width: $bp-tablet) {
    a,
    span {
      font-size: 1.25rem;
    }

    .mood {
      &::before {
        font-size: 1.25rem;
      }
    }
  }
}
</style>
