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



// Use requestAnimationFrame?

class Scroller {
  private index: number
  private reverse: boolean
  private offset: number
  private target?: Element
  private debounceTimeout: number

  private debounceTimer: number = 0
  private loading?: boolean
  private active?: boolean
  private listener?: (event?: any) => void

  constructor(reverse: boolean = true, offset = 300, debounceTimeout = 250) {
    this.index = 0
    this.reverse = reverse
    this.offset = offset
    this.debounceTimeout = debounceTimeout
  }

  private get height(): number {
    if (this.target == undefined) {
      throw new Error()
    }

    const { height } = this.target.getBoundingClientRect()

    return height
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


  attach(target: Element, onOverlap: (start: () => void, stop: (stop: boolean) => void, index: number) => void, onScroll?: (scrollTop: number, scrollBottom: number) => void) {
    this.active = true
    this.target = target

    const apply = () => {
      if (this.loading || !this.active) {
        return
      }

      if (this.verlap && this.reverse) {
        this.loading = true

        let scrollHeight = 0
        let scrollTop = 0

        onOverlap(() => {
          scrollHeight = this.scrollHeight
          scrollTop = this.scrollTop
        }, stop => {
          const targetScrollTop = scrollTop + this.scrollHeight - scrollHeight

          if (Math.abs(targetScrollTop - this.scrollTop) > 2) {
            this.scrollTop = targetScrollTop
          }

          this.loading = false

          if (stop) {
            this.active = false
          }
        }, ++this.index)
      }
    }

    this.listener = (immediate: boolean = false) => {
      window.clearTimeout(this.debounceTimer)

      this.debounceTimer = window.setTimeout(() => {
        apply()

        if (onScroll) {
          onScroll(this.scrollTop, this.scrollHeight - this.scrollTop - this.height)
        }
      }, immediate ? 0 : this.debounceTimeout)
    }

    if (this.reverse) {
      this.toStartPosition()
    }

    target.addEventListener('scroll', this.listener)
    this.listener(true)
  }

  private get verlap() {
    if (this.reverse) {
      return this.scrollTop <= this.offset
    }

    return this.scrollHeight - this.scrollTop - this.height < this.offset
  }

  toStartPosition() {
    this.scrollTop = this.scrollHeight - this.height
  }

  detach() {
    window.clearTimeout(this.debounceTimer)

    if (this.listener && this.target) {
      this.target.removeEventListener('scroll', this.listener)
    }

    delete this.target
  
    this.active = false
    this.loading = false
  }
}

export {
  Scroller,
}
