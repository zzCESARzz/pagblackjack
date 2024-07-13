document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Variables y constantes
  let baraja = [];
  const palos = ['C', 'D', 'H', 'S'];
  const cartasEspeciales = ['A', 'J', 'Q', 'K'];
  const botonPedir = document.querySelector('#btnPedir');
  const botonDetener = document.querySelector('#btnDetener');
  const botonNuevoJuego = document.querySelector('#btnNuevo');
  const numJugadoresSelect = document.querySelector('#numJugadores');
  const divCartasComputadora = document.querySelector('#computadora-cartas');
  const jugadoresDiv = document.querySelector('#jugadores');
  let puntosJugadores = [];
  let puntosComputadora = 0;
  let turnoActual = 0;

  // Función para crear la baraja
  const crearBaraja = () => {
    baraja = [];
    for (let i = 2; i <= 10; i++) {
      for (const palo of palos) {
        baraja.push(i + palo);
      }
    }
    for (const palo of palos) {
      for (const especial of cartasEspeciales) {
        baraja.push(especial + palo);
      }
    }
    barajar(baraja); // Barajar la baraja inicialmente
  };

  // Función para barajar la baraja
  const barajar = (array) => {
    let indiceActual = array.length, indiceAleatorio;
    while (indiceActual !== 0) {
      indiceAleatorio = Math.floor(Math.random() * indiceActual);
      indiceActual--;
      [array[indiceActual], array[indiceAleatorio]] = [array[indiceAleatorio], array[indiceActual]];
    }
    return array;
  };

  // Función para pedir una carta
  const pedirCarta = () => {
    if (baraja.length === 0) {
      throw new Error('No hay cartas en la baraja');
    }
    const carta = baraja.pop();
    return carta;
  };

  // Función para obtener el valor de una carta
  const valorCarta = (carta) => {
    const valor = carta.substring(0, carta.length - 1);
    return isNaN(valor) ? (valor === 'A' ? 11 : 10) : parseInt(valor);
  };

  // Función para el turno de la computadora
  const turnoComputadora = (puntosMinimos) => {
    do {
      const carta = pedirCarta();
      puntosComputadora += valorCarta(carta);
      document.querySelector('#computadora-puntos').innerText = puntosComputadora;
      const imgCarta = crearImagenCarta(carta);
      divCartasComputadora.append(imgCarta);
      if (puntosMinimos > 21) {
        break;
      }
    } while (puntosComputadora < puntosMinimos && puntosMinimos <= 21);

    setTimeout(() => {
      if (puntosComputadora === puntosMinimos) {
        alert('Empate');
      } else if (puntosComputadora > 21 || puntosComputadora < puntosMinimos) {
        alert('Jugador Gana');
        document.body.classList.add('ganar-animacion'); // Añadir clase de animación
      } else {
        alert('Computadora Gana');
      }
      // Reiniciar el juego después de 3 segundos
      setTimeout(() => {
        iniciarJuego();
      }, 400);
    }, 500);
  };

  // Función para crear la imagen de una carta
  const crearImagenCarta = (carta) => {
    const img = document.createElement('img');
    img.src = `assets/cartas/${carta}.jpg`;
    img.classList.add('carta', 'carta-animada-izquierda'); // Añadir clase de animación
    return img;
  };

  // Función para iniciar el juego
  const iniciarJuego = () => {
    crearBaraja();
    puntosJugadores = Array.from({ length: parseInt(numJugadoresSelect.value) }, () => 0);
    puntosComputadora = 0;
    turnoActual = 0;
    jugadoresDiv.innerHTML = '';

    for (let i = 0; i < puntosJugadores.length; i++) {
      const jugadorDiv = document.createElement('div');
      jugadorDiv.classList.add('col');
      jugadorDiv.innerHTML = `
        <h2>Jugador ${i + 1} - <small id="jugador-puntos-${i}">0</small></h2>
        <div id="jugador-cartas-${i}" class="cartas"></div>
      `;
      jugadoresDiv.append(jugadorDiv);
    }

    document.querySelector('#computadora-puntos').innerText = '0';
    divCartasComputadora.innerHTML = '';
    botonDetener.disabled = false;
    botonPedir.disabled = false;
    document.body.classList.remove('ganar-animacion'); // Remover clase de animación al iniciar un nuevo juego

    barajar(baraja); // Barajar la baraja después de crearla
  };

  // Eventos
  botonPedir.addEventListener('click', () => {
    const carta = pedirCarta();
    puntosJugadores[turnoActual] += valorCarta(carta);
    document.querySelector(`#jugador-puntos-${turnoActual}`).innerText = puntosJugadores[turnoActual];
    const imgCarta = crearImagenCarta(carta);
    document.querySelector(`#jugador-cartas-${turnoActual}`).append(imgCarta);

    if (puntosJugadores[turnoActual] > 21 || puntosJugadores[turnoActual] === 21) {
      turnoActual++;
      if (turnoActual >= puntosJugadores.length) {
        botonPedir.disabled = true;
        botonDetener.disabled = true;
        turnoComputadora(Math.max(...puntosJugadores));
      }
    }
  });

  botonDetener.addEventListener('click', () => {
    turnoActual++;
    if (turnoActual >= puntosJugadores.length) {
      botonPedir.disabled = true;
      botonDetener.disabled = true;
      turnoComputadora(Math.max(...puntosJugadores));
    }
  });

  botonNuevoJuego.addEventListener('click', () => {
    iniciarJuego();
  });

  // Inicializar el juego
  iniciarJuego();

});