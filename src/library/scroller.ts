// Scroll has various behaviour when DOM elements changed
// and scroll container height changed.
// 
// 1: When elements that visible in scroll container is changed scroll will move to top
// but when invisible elements changed - scroll position will not move from current position
// 
// 2: When scroll alredy on top of container - scroll position always will move to top
// it the reason for `offset="0"` for `QInfiniteScroll` bacause this component implementation
// consider that scroll after content changed will move always move to top. In `QInfiniteScroll`
// we can see code that always return scroll back to position was before call `done` callback
// 
// This scroll behaviour can controll with css rule `overflow-anchor: none` but it not support
// in all browsers (Safari on iOS)


class Scroller {
  private index: number
  private reverse: boolean
  private offset: number
  private target?: Element
  private debounceTimeout: number

  private debounceTimer: number = 0
  private loading?: boolean
  private listener?: (event?: any) => void

  constructor(reverse: boolean = true, offset = 500, debounceTimeout = 250) {
    this.index = 0
    this.reverse = reverse
    this.offset = offset
    this.debounceTimeout = debounceTimeout
  }

  private get height(): number {
    if (this.target == undefined) {
      throw new Error()
    }

    return this.target.getBoundingClientRect().height
  }

  private get scrollHeight(): number {
    return this.target?.scrollHeight || 0
  }

  private get scrollTop(): number {
    return this.target?.scrollTop || 0
  }

  private set scrollTop(value: number) {
    if (this.target == undefined) {
      throw new Error('Target element undefined')
    }

    this.target.scrollTop = value
  }

  attach(target: Element, watcher: (start: () => ((stop: boolean) => void), index: number) => void) {
    this.target = target

    const onScroll = () => {
      if (this.loading || this.target == undefined) {
        return
      }

      if (this.verlap && this.reverse) {
        this.loading = true

        watcher(() => {
          const scrollHeight = this.scrollHeight
          const scrollTop = this.scrollTop

          return stop => {
            const targetScrollTop = scrollTop + this.scrollHeight - scrollHeight

            if (Math.abs(targetScrollTop - this.scrollTop) > 2) {
              this.scrollTop = targetScrollTop
            }

            if (stop) {
              this.detach()
            }

            this.loading = false
          }
        }, ++this.index)
      } else if (this.verlap) {}
    }

    this.listener = (event?: Event) => {
      window.clearTimeout(this.debounceTimer)

      this.debounceTimer = window.setTimeout(() => {
        onScroll()
      }, this.debounceTimeout)
    }

    // DOIT: move to bottom scroll here!

    target.addEventListener('scroll', this.listener)
    onScroll()
  }

  force() {
    this.listener ? this.listener() : null
  }

  private get verlap() {
    if (this.reverse) {
      return this.scrollTop <= this.offset
    }

    return this.scrollHeight - this.scrollTop - this.height < this.offset
  }

  get attached() {
    return this.target != undefined
  }

  detach() {
    window.clearTimeout(this.debounceTimer)

    if (this.listener) {
      this.target?.removeEventListener('scroll', this.listener)
    }

    delete this.listener
    delete this.target
    delete this.loading
  }
}

export {
  Scroller,
}
