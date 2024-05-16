async function reqAPI (url, method, header, body) {
  var formData = new FormData()
  if (body) {
    Object.keys(body).forEach(key => formData.append(key, body[key]))
  }
  try {
    let response = await fetch(url, {
      method: method,
      body: body ? formData : null,
      headers: header
    })
    let html = await response.text().then(res => res)
    return html
  } catch (error) {
    return '{"error": {"message": "Faild to fetch reqAPI"}}'
  }
}

async function reqAPIhandleCore (url, method) {
  try {
    let response = await fetch(url, {
      method: method
    })
    const arrayBuffer = await response.arrayBuffer()
    const byteArray = new Uint8Array(arrayBuffer)
    const base64String = btoa(
      new Uint8Array(byteArray).reduce(function (data, byte) {
        return data + String.fromCharCode(byte)
      }, '')
    )
    return base64String
  } catch (error) {
    return error
  }
}

chrome.runtime.onMessageExternal.addListener(
  async (request, sender, sendResponse) => {
    if (request.url) {
      if (request.handleCors) {
        var res = await reqAPIhandleCore(request.url, request.method)
        sendResponse(res)
      } else {
        var res = await reqAPI(
          request.url,
          request.method,
          request.header,
          request.body
        )
        sendResponse(res)
      }
    } else {
      sendResponse('{ "success": "true" }')
    }

    if (request.message) {
      sendResponse('{ "success": "true" }')
      return
    }
  }
)

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  if (changeInfo.url) {
    if (
      changeInfo.url.includes('billing_hub/payment_settings') ||
      changeInfo.url.includes('billing_hub/accounts/details')
    ) {
      try {
        chrome.tabs.sendMessage(tabId, {
          message: 'message',
          url: changeInfo.url
        })
      } catch (error) {}
    }
  }
})

chrome.runtime.onInstalled.addListener(() => {
  console.log('caidatthanhco g')
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1,2],
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          responseHeaders: [
            {
              header: 'Access-Control-Allow-Origin',
              operation: 'set',
              value: 'https://business.facebook.com'
            }
          ],
          requestHeaders: [
            {
              header: 'origin',
              operation: 'set',
              value: 'https://business.facebook.com'
            }
          ]
        },
        condition: {
          urlFilter: 'https://business.facebook.com',
          resourceTypes: ['main_frame', 'xmlhttprequest']
        }
      },
      {
        id: 2,
        priority: 2,
        action: {
          type: 'modifyHeaders',
          responseHeaders: [
            {
              header: 'Access-Control-Allow-Origin',
              operation: 'set',
              value: 'https://www.facebook.com/api/graphql'
            }
          ],
          requestHeaders: [
            {
              header: 'origin',
              operation: 'set',
              value: 'https://www.facebook.com/api/graphql'
            }
          ]
        },
        condition: {
          urlFilter: 'https://www.facebook.com/api/graphql',
          resourceTypes: ['main_frame', 'xmlhttprequest']
        }
      }
    ]
  })
})
