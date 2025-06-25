class FetchDebouncer {
  private sleep: number
  private limit: number
  private controller?: AbortController
  private requestTimeout? = 0
  private abortTimeout? = 0

  readonly onrequest: () => void
  readonly onresult: (result: any) => void
  readonly onerror: (error: Error) => void

  constructor({ sleep = 1000, limit = 10000, onrequest = () => { }, onresult = (result: any) => { }, onerror = (error: Error) => { } }) {
    this.sleep = sleep
    this.limit = limit
    this.onrequest = onrequest
    this.onresult = onresult
    this.onerror = onerror
  }

  request(url: string) {
    this.abort()
    this.onrequest()

    this.requestTimeout = window.setTimeout(() => {
      this.abortTimeout = window.setTimeout(() => {
        this.abort()
      }, this.limit)

      this.controller = new AbortController()

      fetch(url, { signal: this.controller.signal }).then(response => {
        if (response.ok) {
          response.json().then(value => this.onresult(value)).catch(error => this.onerror(error))
        } else {
          this.onerror(new Error())
        }
      }).catch(error => this.onerror(error)).finally(() => window.clearTimeout(this.abortTimeout))

    }, this.sleep)
  }

  abort(error = new Error()) {
    window.clearTimeout(this.requestTimeout)
    window.clearTimeout(this.abortTimeout)

    this.controller?.abort()

    if (error) {
      this.onerror(error)
    }
  }
}

export {
  FetchDebouncer,
}
