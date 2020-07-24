  chrome.runtime.onInstalled.addListener(function() {
    // will do stuff in the future
  });

  chrome.runtime.onMessage.addListener(
    function (request, sender)
    {
      if (request.type == 'native-host-ssh')
      {
        var port = chrome.runtime.connectNative("com.yourapp.centinel.pfsense")
        port.postMessage(request.value)

        port.onMessage.addListener(function (message)
        {
          console.log(message)
        })

        port.onDisconnect.addListener(function (error)
        {
          console.log(error)
          console.log("last error:" + chrome.runtime.lastError.message)
        })
      }
    }
  )