import { reactive } from "vue"

export const store = reactive({
  pangeaSession: undefined,
  setSession(pangeaSession) {
    this.pangeaSession = pangeaSession
  },
  unsetSession() {
    this.pangeaSession = undefined
  }
})