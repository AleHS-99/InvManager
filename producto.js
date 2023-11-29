function agregarProducto(t_producto,producto) {
    // Abre la conexión con la base de datos
    const ahora = Date.now();
    const id = ahora.toString().substring(6);
    var request = indexedDB.open("miBaseDeDatos", 1);
    
    // Manejador de evento para la apertura exitosa de la base de datos
    request.onsuccess = function(event) {
        var db = event.target.result;
        
        // Inicia una transacción de lectura en la tabla "t_productos"
        var transaction = db.transaction(["productos"], "readonly");
        var objectStore = transaction.objectStore("productos");
        
        // Comprueba si ya existe un producto con el mismo nombre
        var requestGetAll = objectStore.getAll();
        
        requestGetAll.onsuccess = function(event) {
            var existingProducts = event.target.result;
            var productExists = false;
            
            for (var i = 0; i < existingProducts.length; i++) {
                if (existingProducts[i].t_producto === t_producto &&existingProducts[i].producto == producto) {
                    productExists = true;
                    break;
                }
            }
            
            if (productExists) {
                // Muestra un toast indicando que el producto ya existe
                toastr.error("Ya existe este producto");
            } else {
                // Inicia una transacción de escritura en la tabla "t_productos"
                var writeTransaction = db.transaction(["productos"], "readwrite");
                var writeObjectStore = writeTransaction.objectStore("productos");
                
                // Crea un objeto con los datos del producto
                var producto_new = { id: id, t_producto: t_producto, producto: producto };
                
                // Agrega el producto a la tabla "t_productos"
                var requestAdd = writeObjectStore.add(producto_new);
                
                // Manejador de evento para el éxito de la operación de agregar
                requestAdd.onsuccess = function(event) {
                    toastr.success(producto + ' Agregado Correctamente')
                    location.reload(); 
                };
                
                // Manejador de evento para errores en la operación de agregar
                requestAdd.onerror = function(event) {
                    console.log("Error al agregar el producto: " + event.target.errorCode);
                };

            }
        };
        
        // Manejador de evento para errores en la operación de obtener
        requestGetAll.onerror = function(event) {
            console.log("Error al obtener los productos: " + event.target.errorCode);
        };
    };
    
    // Manejador de evento para errores en la apertura de la base de datos
    request.onerror = function(event) {
        console.log("Error al abrir la base de datos: " + event.target.errorCode);
    };
}

function cargarDatosTP(){
    // Obtener referencia al elemento select
    var selectElement = document.getElementById("tipoProductoInput");

    // Abre la conexión con la base de datos
    var request = indexedDB.open("miBaseDeDatos", 1);

    // Manejador de evento para la apertura exitosa de la base de datos
    request.onsuccess = function(event) {
        var db = event.target.result;

        // Inicia una transacción de lectura en la tabla "productos"
        var transaction = db.transaction(["t_productos"], "readonly");
        var objectStore = transaction.objectStore("t_productos");

        // Obtener todos los tipos de productos almacenados en la base de datos
        var requestGetAll = objectStore.getAll();

        requestGetAll.onsuccess = function(event) {
            var products = event.target.result;

            // Generar y agregar las opciones al elemento select
            for (var i = 0; i < products.length; i++) {
                var option = document.createElement("option");
                option.value = products[i].t_producto;
                option.textContent = products[i].t_producto;
                selectElement.appendChild(option);
            }
        };

        // Manejador de evento para errores en la operación de obtener
        requestGetAll.onerror = function(event) {
            console.log("Error al obtener los tipos de productos: " + event.target.errorCode);
        };
    };

    // Manejador de evento para errores en la apertura de la base de datos
    request.onerror = function(event) {
        console.log("Error al abrir la base de datos: " + event.target.errorCode);
    };
}

function crearFilasTabla() {
    var tabla = document.getElementById("example2");
    var tbody = document.getElementById("t_pr");
    tbody.innerHTML = "";
    var request = indexedDB.open("miBaseDeDatos", 1);
    request.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction(["productos"], "readonly");
        var objectStore = transaction.objectStore("productos");
        var datos = [];
        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                datos.push([cursor.value.t_producto,cursor.value.producto, '<a href="#" id="' + cursor.value.id + '"><i class="fas fa-trash-alt" style="color: red;"></i></a>']);
                cursor.continue();
            } else {
                $(tabla).DataTable().destroy();
                $(tabla).DataTable({
                    data: datos,
                    paging: true,
                    lengthChange: false,
                    searching: false,
                    ordering: true,
                    info: true,
                    autoWidth: false,
                    responsive: true,
                    language: {
                      "decimal": "",
                      "emptyTable": "No hay datos disponibles en la tabla",
                      "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                      "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
                      "infoFiltered": "(filtrado de _MAX_ entradas totales)",
                      "infoPostFix": "",
                      "thousands": ",",
                      "lengthMenu": "Mostrar _MENU_ entradas",
                      "loadingRecords": "Cargando...",
                      "processing": "Procesando...",
                      "search": "Buscar:",
                      "zeroRecords": "No se encontraron coincidencias",
                      "paginate": {
                          "first": "Primero",
                          "last": "Último",
                          "next": "Siguiente",
                          "previous": "Anterior"
                      },
                      "aria": {
                          "sortAscending": ": activar para ordenar la columna en orden ascendente",
                          "sortDescending": ": activar para ordenar la columna en orden descendente"
                      }
                    },
                                       
                }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
            }
        };
    };
    request.onerror = function(event) {
        console.log("Error al abrir la base de datos: " + event.target.errorCode);
    };
}
function eliminarElemento(id) {
    var request = indexedDB.open("miBaseDeDatos", 1);
    request.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction(["productos"], "readwrite");
        var objectStore = transaction.objectStore("productos");
        var deleteRequest = objectStore.delete(id);
        deleteRequest.onsuccess = function(event) {
            console.log("Elemento eliminado con éxito");
            location.reload();
        };
        deleteRequest.onerror = function(event) {
            console.log("Error al eliminar el elemento: " + event.target.errorCode);
        };
    };
    request.onerror = function(event) {
        console.log("Error al abrir la base de datos: " + event.target.errorCode);
    };
}