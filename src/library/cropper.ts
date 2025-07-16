import * as cropper from 'cropperjs'


class Cropper extends cropper.default {
  getCropperShade(): cropper.CropperShade | void {
    return this.getCropperCanvas()?.querySelector('cropper-shade') as cropper.CropperShade
  }
}

function useCropper(opts: {container: string, template: string}) {
  let cropper: Cropper

  return {
    load(file: File): Promise<Cropper> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        const img = new Image()
  
        const container = document.querySelector(opts.container)
  
        if (container == null) {
          throw new Error(`Container "${opts.container}" not found`)
        }
  
        reader.onload = () => {
          img.src = reader.result as string
  
          cropper = new Cropper(img, {
            container,
            template: opts.template,
          })

          // NOTE: don't use CropperImage.$ready
          const image = cropper.getCropperImage()

          if (image?.$image.complete) {
            resolve(cropper)
          } else {
            image?.$image.addEventListener('load', () => {
              resolve(cropper)
            })
          }
        }
  
        reader.readAsDataURL(file)
      })
    },

    save(width: number, height: number) {
      if (cropper == null) {
        throw new Error()
      }

      const selection = cropper.getCropperSelection()

      if (selection == null) {
        throw new Error()
      }

      return selection.$toCanvas({
        width,
        height,
      })
    },

    refresh() {
      if (cropper == null) {
        return
      }

      const image = cropper.getCropperImage()

      if (image == null) {
        return
      }

      const { scalable, translatable } = image

      image.scalable = true
      image.translatable = true

      image.$center('contain')

      image.scalable = scalable
      image.translatable = translatable

      cropper.getCropperSelection()?.$center().$render()
    },

  }
}


export {
  useCropper,
}
