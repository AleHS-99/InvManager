function llenarTablaMixta(){
    var request = indexedDB.open("miBaseDeDatos", 1);
    var fecha = new Date();
    var year = fecha.getFullYear();
    var month = ("0" + (fecha.getMonth() + 1)).slice(-2);
    var day = ("0" + fecha.getDate()).slice(-2);
    var fechaFormateada = year + "-" + month + "-" + day;
    request.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction(["entradas"], "readonly");
        var objectStore = transaction.objectStore("entradas");
        
        var entradas = [];
        var entradas_hoy = [];
        
        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.fecha==fechaFormateada){
                    entradas_hoy.push(cursor.value);
                }else{
                    entradas.push(cursor.value)
                }
                cursor.continue();
            } else {
                // Aquí puedes hacer uso de los datos almacenados en la variable "datos"
                var transaction2 = db.transaction(["salidas"], "readonly");
                var objectStore2 = transaction2.objectStore("salidas");
                
                var salidas = [];
                var salidas_hoy = [];

                objectStore2.openCursor().onsuccess = function(event) {
                    var cursor2 = event.target.result;
                    if (cursor2) {
                        if (cursor2.value.fecha==fechaFormateada){
                            salidas_hoy.push(cursor2.value);
                        }else{
                            salidas.push(cursor2.value)
                        }
                        cursor2.continue();
                    } else {
                        var datos_agrupados = {};
                        var datos_agrupados2 = {};
                        var datos_agrupados3 = {};
                        var datos_agrupados4 = {};
                        entradas.forEach(function(dato) {
                            var clave = dato.t_producto + '-' + dato.producto + '-' + dato.u_medida;
                            if (!datos_agrupados[clave]) {
                                datos_agrupados[clave] = {
                                't_producto': dato.t_producto,
                                'producto': dato.producto,
                                'u_medida': dato.u_medida,
                                'cantidad': 0
                                };
                            }
                            datos_agrupados[clave].cantidad += parseFloat(dato.cantidad);
                            });
                        salidas.forEach(function(dato) {
                                var clave = dato.t_producto + '-' + dato.producto + '-' + dato.u_medida;
                                if (!datos_agrupados2[clave]) {
                                    datos_agrupados2[clave] = {
                                    't_producto': dato.t_producto,
                                    'producto': dato.producto,
                                    'u_medida': dato.u_medida,
                                    'cantidad': 0
                                    };
                                }
                                datos_agrupados2[clave].cantidad += parseFloat(dato.cantidad);
                                });
                        entradas_hoy.forEach(function(dato) {
                                    var clave = dato.t_producto + '-' + dato.producto + '-' + dato.u_medida;
                                    if (!datos_agrupados3[clave]) {
                                        datos_agrupados3[clave] = {
                                        't_producto': dato.t_producto,
                                        'producto': dato.producto,
                                        'u_medida': dato.u_medida,
                                        'cantidad': 0
                                        };
                                    }
                                    datos_agrupados3[clave].cantidad += parseFloat(dato.cantidad);
                                    });
                        salidas_hoy.forEach(function(dato) {
                                        var clave = dato.t_producto + '-' + dato.producto + '-' + dato.u_medida;
                                        if (!datos_agrupados4[clave]) {
                                            datos_agrupados4[clave] = {
                                            't_producto': dato.t_producto,
                                            'producto': dato.producto,
                                            'u_medida': dato.u_medida,
                                            'cantidad': 0
                                            };
                                        }
                                        datos_agrupados4[clave].cantidad += parseFloat(dato.cantidad);
                                        });
                        console.log(salidas_hoy)
                        var datos_concatenados = Object.assign({}, datos_agrupados);

                        // Iterar sobre los datos agregados1
                        for (var clave in datos_agrupados) {
                        // Verificar si la clave existe en los datos agregados2
                        if (datos_agrupados2.hasOwnProperty(clave)) {
                        // Restar la cantidad de datos agregados2 a la cantidad de datos agregados1
                            datos_concatenados[clave].cantidad -= datos_agrupados2[clave].cantidad;
                        }
                        }
                       // Concatenar datos_concatenados, datos_agrupados3 y datos_agrupados4
                        var datos_concatenados_final = Object.assign({}, datos_concatenados);
                        for (var clave in datos_agrupados3) {
                            // Verificar si la clave no existe en datos_concatenados
                            if (!datos_concatenados_final.hasOwnProperty(clave)) {
                            // Agregar el producto con cantidad 0 a datos_concatenados
                                datos_concatenados_final[clave] = {
                                    't_producto': datos_agrupados3[clave].t_producto,
                                    'producto': datos_agrupados3[clave].producto,
                                    'u_medida': datos_agrupados3[clave].u_medida,
                                    'cantidad': 0
                                };
                            }
                        }
                        // Iterar sobre los datos_concatenados
                        for (var clave in datos_concatenados_final) {
                        // Verificar si la clave existe en datos_agrupados3 y datos_agrupados4
                            if (datos_agrupados3.hasOwnProperty(clave) && datos_agrupados4.hasOwnProperty(clave)) {
                                // Agregar la cantidad de datos_agrupados3 como 'entradas_hoy'
                                datos_concatenados_final[clave].entradas_hoy = datos_agrupados3[clave].cantidad;
                                // Agregar la cantidad de datos_agrupados4 como 'salidas_hoy'
                                datos_concatenados_final[clave].salidas_hoy = datos_agrupados4[clave].cantidad;
                                // Calcular la cantidad final o total
                                datos_concatenados_final[clave].final = datos_concatenados_final[clave].cantidad + datos_agrupados3[clave].cantidad - datos_agrupados4[clave].cantidad;
                            }else if(datos_agrupados3.hasOwnProperty(clave)){
                                // Agregar la cantidad de datos_agrupados3 como 'entradas_hoy'
                                datos_concatenados_final[clave].entradas_hoy = datos_agrupados3[clave].cantidad;
                                // Agregar la cantidad de datos_agrupados4 como 'salidas_hoy'
                                datos_concatenados_final[clave].salidas_hoy = 0;
                                // Calcular la cantidad final o total
                                datos_concatenados_final[clave].final = datos_concatenados_final[clave].cantidad + datos_agrupados3[clave].cantidad;
                            }else if (datos_agrupados4.hasOwnProperty(clave)){
                                datos_concatenados_final[clave].entradas_hoy = 0;
                                // Agregar la cantidad de datos_agrupados4 como 'salidas_hoy'
                                datos_concatenados_final[clave].salidas_hoy = datos_agrupados4[clave].cantidad;
                                // Calcular la cantidad final o total
                                datos_concatenados_final[clave].final = datos_concatenados_final[clave].cantidad - datos_agrupados4[clave].cantidad;
                            
                            }else{
                                datos_concatenados_final[clave].entradas_hoy = 0;
                                // Agregar la cantidad de datos_agrupados4 como 'salidas_hoy'
                                datos_concatenados_final[clave].salidas_hoy = 0;
                                // Calcular la cantidad final o total
                                datos_concatenados_final[clave].final = datos_concatenados[clave].cantidad;
                            
                            }
                        }
                        //Aqui va el codigo
                        var count = 1
                        var row = document.querySelector('.row');

                        for (clave in datos_concatenados_final) {
                        // Crear el elemento col
                        var col = document.createElement('div');
                        col.className = 'col-12 col-sm-6 col-md-3';

                        // Crear el elemento info-box
                        var infoBox = document.createElement('div');
                        infoBox.className = 'info-box';

                        // Crear el elemento info-box-icon
                        var infoBoxIcon = document.createElement('span');
                        infoBoxIcon.className = 'info-box-icon bg-info elevation-1';
                        infoBoxIcon.innerHTML = '<i class="fas fa-glass-cheers"></i>';

                        // Crear el elemento info-box-content
                        var infoBoxContent = document.createElement('div');
                        infoBoxContent.className = 'info-box-content';

                        // Crear el elemento info-box-text
                        var infoBoxText = document.createElement('span');
                        infoBoxText.className = 'info-box-text';
                        infoBoxText.innerHTML = datos_concatenados_final[clave].t_producto+" "+datos_concatenados_final[clave].producto;

                        // Crear el elemento info-box-number
                        var infoBoxNumber = document.createElement('span');
                        infoBoxNumber.className = 'info-box-number';
                        infoBoxNumber.innerHTML = "En existencia: "+datos_concatenados_final[clave].final + '<small> '+datos_concatenados_final[clave].u_medida+'</small>';

                        // Agregar los elementos al info-box-content
                        infoBoxContent.appendChild(infoBoxText);
                        infoBoxContent.appendChild(infoBoxNumber);

                        // Agregar los elementos al info-box
                        infoBox.appendChild(infoBoxIcon);
                        infoBox.appendChild(infoBoxContent);

                        // Agregar el info-box al col
                        col.appendChild(infoBox);

                        // Agregar el col al row
                        row.appendChild(col);

                        // Incrementar el contador
                        count++;

                        // Crear una nueva columna y reiniciar el contador cuando count llega a 4
                        if (count > 4) {
                            count = 1;
                        }
                        }
                    }
                }
                
            }
        };
    };
    request.onerror = function(event) {
        console.log("Error al abrir la base de datos: " + event.target.errorCode);
    };
}