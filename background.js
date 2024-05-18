let popupWindowId = null

browser.browserAction.onClicked.addListener(() => {
  if (popupWindowId) {
    browser.windows.get(popupWindowId).then(windowInfo => {
      if (windowInfo && windowInfo.state === 'normal') {
        browser.windows.update(popupWindowId, { state: 'minimized' })
      } else {
        activatePopupWindow()
      }
    })
  } else {
    createPopupWindow()
  }
})

function createPopupWindow () {
  console.log('create')
  browser.windows
    .create({
      url: 'https://smeta.vn/app',
      type: 'popup',
      height: 600,
      width: 1200,
      top: 200,
      left: 200
    })
    .then(window => {
      popupWindowId = window.id
    })
}

function activatePopupWindow () {
  browser.windows.update(popupWindowId, { focused: true })
}

browser.windows.onRemoved.addListener(windowId => {
  if (windowId === popupWindowId) {
    popupWindowId = null
  }
})

// Lắng nghe tin nhắn từ content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('a message')
  if (message.greeting === 'hello') {
    console.log('Received message from React app:', message.messageFromReact)
    // Xử lý tin nhắn ở đây
  }
})

window.addEventListener('message', function (event) {
  console.log(event)
  console.log('a messs')
  if (
    event.source === window &&
    event.data &&
    event.data.type === 'FROM_REACT_APP'
  ) {
    // Xử lý tin nhắn từ ứng dụng React ở đây
    console.log('Received message from React app:', event.data.message)
  }
})
