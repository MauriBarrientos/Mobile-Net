// Función para previsualizar la imagen seleccionada
function previsualizarImagen(event) {
    const divVistaPrevia = document.getElementById('vistaPreviaImagen');
    divVistaPrevia.innerHTML = ''; // Limpiar la vista previa anterior
    const imgElemento = document.createElement('img'); // Crear un elemento de imagen
    imgElemento.src = URL.createObjectURL(event.target.files[0]); // Asignar la imagen seleccionada al elemento de imagen
    divVistaPrevia.appendChild(imgElemento); // Añadir el elemento de imagen al div de vista previa
  }

  // Función para clasificar la imagen utilizando el modelo MobileNet
  async function clasificarImagen() {
    const inputElement = document.getElementById('inputImagen');
    const archivoImagen = inputElement.files[0]; // Obtener el archivo de imagen seleccionado
    const divResultados = document.getElementById('resultados');

    if (archivoImagen) {
      const lector = new FileReader(); // Crear un objeto FileReader
      lector.onload = async function(e) { // Cuando se cargue la imagen
        const datosImagen = e.target.result; // Obtener la URL de datos de la imagen
        const imgElemento = document.createElement('img'); // Crear un elemento de imagen
        imgElemento.src = datosImagen; // Asignar la imagen cargada al elemento de imagen
        
        imgElemento.onload = async function() { // Cuando se cargue la imagen
          // Cargar el modelo MobileNet
          const modelo = await mobilenet.load();
          // Clasificar la imagen y obtener predicciones
          const predicciones = await modelo.classify(imgElemento);

          // Mostrar los resultados en la interfaz
          divResultados.innerHTML = '<h2>Resultados:</h2>';
          predicciones.forEach(prediccion => {
            const porcentaje = Math.round(prediccion.probability * 100); // Calcular el porcentaje
            divResultados.innerHTML += `<p>${prediccion.className}: ${porcentaje}%</p>`;
          });

          divResultados.style.display = 'block'; // Mostrar los resultados
          console.log(predicciones); // Mostrar predicciones en la consola
        };
      };
      lector.readAsDataURL(archivoImagen); // Leer la imagen como URL de datos
    } else {
      alert('Por favor, seleccione un archivo de imagen.');
    }
  }