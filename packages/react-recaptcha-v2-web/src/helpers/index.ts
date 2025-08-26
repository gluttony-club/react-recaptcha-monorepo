// ref: https://github.com/jsardev/reaptcha/pull/184/files
export async function listenRecaptchaClose(onClose?: () => void) {
  const count = 0
  return new Promise<void>((resolve) => {
    const task = () => {
      const frames = Array.from(document.getElementsByTagName('iframe')).filter(
        (frame) =>
          frame.src.includes('google.com/recaptcha/api2/bframe')
          || frame.src.includes('recaptcha.net/recaptcha/api2/bframe'),
      )

      if (!frames.length) {
        if (count <= 5) {
          setTimeout(() => {
            task()
          }, 10)
        }
        return resolve()
      }

      const recaptchaWindow = frames[0].parentNode?.parentNode

      if (!recaptchaWindow || !(recaptchaWindow instanceof HTMLDivElement)) {
        return resolve()
      }

      // and now we are listening on CSS changes on it
      // when the opacity has been changed to 0 we know that
      // the window has been closed

      const closeObserver = new MutationObserver(() => {
        if (recaptchaWindow.style.opacity === '0') {
          onClose?.()
          closeObserver.disconnect()
          return resolve()
        }
      })

      closeObserver.observe(recaptchaWindow, {
        attributes: true,
        attributeFilter: ['style'],
      })
    }

    setTimeout(() => {
      task()
    }, 10)
  })
}
