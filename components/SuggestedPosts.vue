<template>
  <section class="featuredCollabs">
    <h2 class="title">Featured Collabs</h2>

    <div class="buttonContainer">
      <ButtonArrow class="leftArrow" @clicked="handleSlide(-1)"
        ><LeftArrow
      /></ButtonArrow>
      <ButtonArrow class="rightArrow" @clicked="handleSlide(1)"
        ><RightArrow
      /></ButtonArrow>
      <ul class="collabsList">
        <li
          v-for="(post, index) of posts"
          :key="post.title"
          :ref="'post' + index"
          class="collab"
        >
          <div class="leftImage">
            <img
              class="postImage"
              :src="post.coverImage.url"
              :alt="post.title"
            />
          </div>
          <div class="rightImage">
            <img
              class="postImage"
              :src="post.coverImage.url"
              :alt="post.title"
            />
          </div>
          <div class="collabsContent">
            <div class="content">
              <div class="headline">
                <p>
                  Something something
                </p>
              </div>
              <div class="collabsTitle">
                <h3>
                  John + Kim
                  {{ post.title }}
                </h3>
              </div>
              <div class="buttonContainer">
                <Button @clicked="onClick(post.slug)">Explore</Button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import gsap from 'gsap'
import { Draggable, InertiaPlugin } from 'gsap/all'
import { debounce } from 'vue-debounce'
import { fetchContent } from '@/utils/api'
import ButtonArrow from '@/components/ButtonArrow'
import LeftArrow from '~/assets/icons/leftArrow.svg?inline'
import RightArrow from '~/assets/icons/rightArrow.svg?inline'

export default {
  components: {
    ButtonArrow,
    LeftArrow,
    RightArrow,
  },
  data() {
    return {
      posts: [],
      slideDuration: 1,
      dragInstance: null,
      proxyRef: null,
      transform: null,
      slideWidth: null,
      slideHeight: null,
      imageHeight: null,
      wrapWidth: null,
      slideAnimation: gsap.to({}, 0.1, {}),
      switchPosition: null,
    }
  },
  computed: {
    wrap() {
      return this.wrapPartial(-100, (this.posts.length - 1) * 100)
    },
    numSlides() {
      return this.posts.length
    },
    numChars() {
      return this.posts.map((post) => {
        const string = `${post.artist[0].name} + ${post.artist[1].name} ${post.title}`
        return string.length
      })
    },
    maxCharIndex() {
      return this.numChars.indexOf(Math.max(...this.numChars))
    },
  },
  async created() {
    const { data } = await fetchContent(`{
      posts(orderBy: date_DESC, first: 6) {
        title
        slug
        coverImage {
          url
        }
        date
        excerpt
        city {
          latitude
          longitude
        }
        sense
        mood
      }
      collabPosts(orderBy: date_DESC, first: 6) {
        title
        slug
        coverImage {
          url
        }
        date
        excerpt
        city {
          latitude
          longitude
        }
        sense
        mood
      }
    }`)

    const { posts, collabPosts } = data.data

    // Sorted in random order
    this.posts = posts.concat(collabPosts).sort((a, b) => 0.5 - Math.random())
  },
  mounted() {
    gsap.registerPlugin(Draggable, InertiaPlugin)

    this.proxyRef = document.createElement('div')
    gsap.set(this.proxyRef, {
      x: '+=0',
    })
    this.transform = this.proxyRef._gsap

    // SET POSITION

    this.setPosition()
    this.updateAnimation()

    const that = this

    this.dragInstance = Draggable.create(this.proxyRef, {
      trigger: '.collabsList',
      type: 'x',
      // edgeResistance: 0.65,
      inertia: true,
      onPress() {
        that.slideAnimation.kill()
        this.update()
      },
      onDrag: this.updateProgress,
      onThrowUpdate: this.updateProgress,
      snap: {
        x: this.snapX,
      },
    })

    this.animation = gsap.to('.collab', 0.8, {
      xPercent: '+=' + this.numSlides * 100,
      ease: 'none',
      paused: true,
      repeat: -1,
      modifiers: {
        xPercent: this.wrap,
      },
    })

    this.resize()

    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    onClick(slug) {
      this.$router.push(`/post/${slug}`)
    },
    wrapPartial(min, max) {
      const r = max - min

      return function (value) {
        const v = value - min

        return ((r + (v % r)) % r) + min
      }
    },
    setPosition() {
      for (let i = 0; i < this.numSlides; i++) {
        gsap.set(this.$refs[`post${i}`][0], {
          xPercent: i * 100,
          modifiers: {
            xPercent: this.wrap,
          },
        })
      }
    },
    animateSlides(direction) {
      this.slideAnimation.kill()

      const xVal = parseFloat(
        this.transform.x.substring(0, this.transform.x.length - 2)
      )

      const x = this.snapX(xVal + direction * this.slideWidth)

      this.slideAnimation = gsap.to(this.proxyRef, this.slideDuration, {
        x,
        onUpdate: this.updateProgress,
      })
    },
    snapX(x) {
      return Math.round(x / this.slideWidth) * this.slideWidth
    },
    updateProgress() {
      const xVal = parseFloat(
        this.transform.x.substring(0, this.transform.x.length - 2)
      )

      const xPercentage = xVal / this.wrapWidth

      const trans =
        xPercentage < 0
          ? Math.ceil(xPercentage * -1) + xPercentage
          : xPercentage

      this.animation.progress(trans)
    },
    getMaxHeight(eleArr) {
      const heights = eleArr.map((post) => {
        return post.clientHeight
      })

      return heights
    },
    resize() {
      const resizeDebounced = debounce(() => {
        const xVal = parseFloat(
          this.transform.x.substring(0, this.transform.x.length - 2)
        )

        const norm = xVal / this.wrapWidth || 0

        this.slideWidth = this.$refs.post0[0].getBoundingClientRect().width
        this.wrapWidth = this.slideWidth * this.numSlides

        // List Height

        this.slideHeights = this.getMaxHeight(
          Object.values(this.$refs).map((ele) => ele[0])
        )

        const maxHeight = Math.max(...this.slideHeights)

        gsap.set('.collabsList', {
          height: maxHeight,
        })

        // Content Height

        const textElements = Array.from(document.querySelectorAll('.content'))
        const textHeight = textElements[this.maxCharIndex].offsetHeight

        for (let i = 0; i < this.posts.length; i += 1) {
          if (i !== this.maxCharIndex) {
            gsap.set(textElements[i], {
              height: textHeight,
            })
          }
        }

        // Set Position of Posts

        gsap.set(this.proxyRef, {
          x: norm * this.wrapWidth,
        })

        this.animateSlides(0)
        this.slideAnimation.progress(1)
      }, 400)

      resizeDebounced()
    },
    handleSlide(direction) {
      this.animateSlides(-direction)
    },
    updateAnimation() {
      this.animation = gsap.to('.collab', 0.8, {
        xPercent: '+=' + this.numSlides * 100,
        ease: 'none',
        paused: true,
        repeat: -1,
        modifiers: {
          xPercent: this.wrap,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.featuredCollabs {
  position: relative;
}

.buttonContainer {
  position: relative;
}

.leftArrow,
.rightArrow {
  position: absolute;
  top: calc(58vw / 2);
  transform: translateY(-50%);
  z-index: 10;
}

.leftArrow {
  left: 1rem;
}

.rightArrow {
  right: 1rem;
}

h2,
h3,
p {
  text-align: center;
}

h2 {
  margin: 2rem 0;
}

h2,
h3 {
  text-transform: uppercase;
}

h3,
p {
  margin: 0;
}

p {
  font-size: 1.15rem;
}

h2,
h3 {
  font-size: 2rem;
  line-height: 1;
}

ul {
  margin: 0;
  padding: 0;
  position: relative;
}

.collab {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.collab {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  .leftImage,
  .rightImage {
    width: 50%;
    position: relative;
    height: 58vw;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .collabsContent {
    margin: 0 auto;
    display: flex;
  }

  .content {
    width: 85%;
    margin: 2rem auto 0 auto;
  }

  .collabsTitle {
    margin: 0.5rem 0 1.5rem 0;
  }

  .buttonContainer {
    display: flex;
    justify-content: center;
  }
}

.headline {
  font-weight: $semibold;
}

@media (min-width: $bp-tablet) {
  .leftArrow,
  .rightArrow {
    top: calc(58vh / 2);
  }

  .collab {
    .leftImage,
    .rightImage {
      height: 58vh;
    }
  }
}

@media (min-width: $bp-desktop) {
  .leftArrow,
  .rightArrow {
    top: 50%;
  }

  h2 {
    margin: 1.5rem 0;
  }

  h2,
  h3 {
    font-size: 3rem;
  }

  .collabsList {
    border-top: 1px solid $black;
    border-bottom: 1px solid $black;
    margin-bottom: 8rem;
  }

  .collab {
    flex-wrap: nowrap;

    .leftImage {
      order: 1;
      width: 35%;
    }

    .collabsContent {
      order: 2;
      width: 30%;
    }

    .rightImage {
      order: 3;
      width: 35%;
    }

    .leftImage,
    .rightImage {
      height: auto;
    }

    .content {
      min-width: 280px;
      width: 70%;
      padding: 4rem 0;
      margin: 0 auto;
    }

    .collabsTitle {
      margin: 2.5rem 0 3rem 0;
    }
  }
}

@media (min-width: $bp-lg-desktop) {
  h2,
  h3 {
    font-size: 3.5rem;
  }

  p {
    font-size: 1.25rem;
  }

  .collab {
    .content {
      min-width: 325px;
    }
  }
}
</style>