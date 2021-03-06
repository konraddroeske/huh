import { fetchContent } from "@/utils/api"

export const state = () => ({
  posts: null,
})

export const actions = {
  async getPosts({ commit, state }) {
    try {
      const { data } = await fetchContent(`{
        posts(first: 1000, orderBy: date_DESC) {
            id
            title
            headline
            slug
            blueTitle
            curated
            excerpt
            date
            featured
            featuredImages {
              id
              url
              fileName
            }
            content {
                html
                markdown
                raw
                text
            }
            coverImage {
                url
            }
            sense {
                name
            }
            mood {
                moodCategory
                mood
            }
            artist {
                name
                city {
                  name
                }
                about
                website
                social
                socialUrl
            }
            city {
                name
            }
        }
      }`)

      const { posts } = data.data
      commit("setPosts", posts)
      // commit("setCollabs", posts)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  },
}

export const mutations = {
  setPosts(state, payload) {
    state.posts = payload
  },
}
