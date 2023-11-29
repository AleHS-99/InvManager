// Abre la conexión con la base de datos
var request = indexedDB.open("miBaseDeDatos", 1);

// Manejador de evento para crear o actualizar la base de datos
request.onupgradeneeded = function(event) {
  var db = event.target.result;

  // Crea la tabla "productos" si no existe
  if (!db.objectStoreNames.contains("productos")) {
    db.createObjectStore("productos", { keyPath: "id" });
  }

  // Crea la tabla "t_productos" si no existe
  if (!db.objectStoreNames.contains("t_productos")) {
    db.createObjectStore("t_productos", { keyPath: "id" });
  }

  // Crea la tabla "entradas" si no existe
  if (!db.objectStoreNames.contains("entradas")) {
    db.createObjectStore("entradas", { keyPath: "id" });
  }

  // Crea la tabla "salidas" si no existe
  if (!db.objectStoreNames.contains("salidas")) {
    db.createObjectStore("salidas", { keyPath: "id" });
  }
};

// Manejador de evento para la apertura exitosa de la base de datos
request.onsuccess = function(event) {
  console.log("Base de datos creada exitosamente");
};

// Manejador de evento para errores en la apertura de la base de datos
request.onerror = function(event) {
  console.log("Error al crear la base de datos: " + event.target.errorCode);
};
