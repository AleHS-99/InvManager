chrome.app.runtime.onLaunched.addListener(function() {
    // Obtener el tamaño de la pestaña actual
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      var width = tab.width;
      var height = tab.height;
      // Crear la ventana de la aplicación con el mismo tamaño
      chrome.app.window.create('index.html', {
        id: 'main',
        bounds: {
          width: width,
          height: height
        }
      });
    });
  });
  