tf.ready().then(() => {
    const rutaModelo = 'model/ttt_model.json'; // Ruta al archivo del modelo
    tf.tidy(() => {
      tf.loadLayersModel(rutaModelo).then((modelo) => {
        let tablero = tf.zeros([9]).arraySync(); // Inicializa el tablero vacío
        let juegoTerminado = false; // Variable para verificar si el juego ha terminado
  
        const celdas = document.querySelectorAll('.celda');
        const mensajeDiv = document.querySelector('.mensaje');
        const botonReiniciar = document.querySelector('.reiniciar');
  
        // Función para renderizar el tablero
        function renderizarTablero() {
          celdas.forEach((celda, idx) => {
            if (tablero[idx] === 1) { // 1 representa a la IA
              celda.textContent = 'O'; // O es la ficha de la IA
              celda.classList.add('o'); // Añade la clase 'o' a la celda
            } else if (tablero[idx] === -1) { // -1 representa al usuario
              celda.textContent = 'X';
              celda.classList.add('x');
            } else { // 0 representa una celda vacía
              celda.textContent = ''; // Limpia el contenido de la celda
              celda.classList.remove('x', 'o'); // Elimina las clases 'x' y 'o' de la celda
            }
          });
        }
  
        // Función para verificar si hay un ganador
        function verificarGanador(tablero) {
          const combinacionesGanadoras = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
            [0, 4, 8], [2, 4, 6]             // Diagonales
          ];

          for (const combo of combinacionesGanadoras) { // Itera sobre las combinaciones ganadoras  
            const [a, b, c] = combo; // Extrae los índices de la combinación
            if (tablero[a] !== 0 && tablero[a] === tablero[b] && tablero[a] === tablero[c]) { // Verifica si hay un ganador
              return tablero[a];
            }
          }
  
          return tablero.includes(0) ? null : 'Empate';
        }
  
        // Función para que la IA realice su movimiento
        function movimientoIA(tablero) {
          const tableroTensor = tf.tensor(tablero); // Convierte el tablero en un tensor
          const resultado = modelo.predict(tableroTensor.reshape([1, 9])); // Realiza la predicción
          const probabilidades = resultado.dataSync(); // Obtiene las probabilidades de las celdas
          let maxProb = -Infinity; // Inicializa la probabilidad máxima
          let movimiento = -1; // Inicializa el movimiento
  
          probabilidades.forEach((prob, idx) => { // Itera sobre las probabilidades
            if (tablero[idx] === 0 && prob > maxProb) { // Verifica si la celda está vacía y si la probabilidad es mayor
              maxProb = prob; // Actualiza la probabilidad máxima
              movimiento = idx; // Actualiza el movimiento
            }
          });
  
          return movimiento;
        }
  
        // Función para manejar el movimiento del usuario
        function movimientoUsuario(posicion) {
          if (tablero[posicion] === 0) {
            tablero[posicion] = -1; // Movimiento del usuario
            renderizarTablero();
            let ganador = verificarGanador(tablero);
            if (ganador !== null) {
              mensajeDiv.textContent = ganador === 'Empate' ? '¡El juego es un empate!' : `¡Jugador ${ganador === 1 ? 'O' : 'X'} gana!`;
              botonReiniciar.style.display = 'block';
              return;
            }
  
            const posicionIA = movimientoIA(tablero);
            tablero[posicionIA] = 1; // Movimiento de la IA
            renderizarTablero();
            console.log("La IA se movió a la posición:", posicionIA);
            console.log("Tablero actual:", tablero);
  
            ganador = verificarGanador(tablero);
            if (ganador !== null) {
                juegoTerminado = true;
              mensajeDiv.textContent = ganador === 'Empate' ? '¡El juego es un empate!' : `¡Jugador ${ganador === 1 ? 'O' : 'X'} gana!`;
                botonReiniciar.style.display = 'block';
            }
          }
        }
  
        // Añade un evento de clic a cada celda del tablero
        celdas.forEach(celda => {
          celda.addEventListener('click', () => {
            const indice = parseInt(celda.getAttribute('data-index'));
            movimientoUsuario(indice);
          });
        });
              // Función para reiniciar el juego
      function reiniciarJuego() {
        tablero = tf.zeros([9]).arraySync(); // Reinicia el tablero vacío
        juegoTerminado = false; // Reinicia el estado del juego
        mensajeDiv.textContent = ''; // Limpia el mensaje
        botonReiniciar.style.display = 'none'; // Oculta el botón de reinicio
        renderizarTablero(); // Renderiza el tablero inicial
      }

      // Añade un evento de clic al botón de reinicio
      botonReiniciar.addEventListener('click', reiniciarJuego);
      });
    });
  });  