var turno = "J1";
var contadorJugador1 = 0;
var contadorJugador2 = 0;
var contadorJugador3 = 0;
var timer;
var seleccionado = null;

window.onload = function () {
  nuevaPartida();
  if (document.getElementById("btnModal")) {
    var modal = document.getElementById("tvesModal");
    var btn = document.getElementById("btnModal");
    var span = document.getElementsByClassName("close")[0];
    var body = document.getElementsByTagName("body")[0];
    btn.onclick = function () {
      modal.style.display = "block";
      body.style.position = "static";
      body.style.height = "100%";
      body.style.overflow = "hidden";
    }
    span.onclick = function () {
      modal.style.display = "none";

      body.style.position = "inherit";
      body.style.height = "auto";
      body.style.overflow = "visible";
    }
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";

        body.style.position = "inherit";
        body.style.height = "auto";
        body.style.overflow = "visible";
      }
    }
  }
}

function nuevaPartida() {
  document.formulario.opcionPartida.value = "nueva";
  document.getElementById("formulario").style.display = "block";
  document.getElementById("guardadas").style.display = "none";
  document.getElementById("jugadores").style.display = "block";
  inicializarTablero(document.formulario.cantJugadores.value);
  if (document.formulario.cantJugadores.value == 3) {
    document.getElementById("nombreJug3").style.display = "inline-flex";
  }
  else {
    document.getElementById("nombreJug3").style.display = "none";
  }
}

function inicializarTablero(cantJugadores) {
  var m, n;
  document.getElementById("resultado").innerText = "";
  turno = "J1";
  if (timer != null) { clearTimeout(timer); }
  tiempoJ1.innerText = "00:00";
  tiempoJ2.innerText = "00:00";
  tiempoJ3.innerText = "00:00";
  contadorJugador1 = 0;
  contadorJugador2 = 0;
  contadorJugador3 = 0;
  partidas = localStorage.getItem("partidas" + document.formulario.cantJugadores.value);
  partidas = JSON.parse(partidas);
  document.getElementById("comenzar").disabled = false;
  document.getElementById("reiniciar").disabled = true;
  document.getElementById("guardar").disabled = true;
  document.getElementById("jugador1").style.borderColor = document.formulario.colorJugador1.value;
  document.getElementById("jugador2").style.borderColor = "transparent";
  if (partidas == null || partidas.length == 0) {
    document.formulario.opcionPartida[1].disabled = true;
    document.formulario.opcionPartida[0].checked = true;
  }
  else {
    document.getElementById("opcionGuardadas").disabled = false;
  }
  if (cantJugadores == 3) {
    document.getElementById("jugador3").style.borderColor = "transparent";
    document.getElementById("jugador3").style.display = "block";
    m = 9;
    n = 10;
  }
  else {
    document.getElementById("jugador3").style.display = "none";
    m = 6;
    n = 7;
  }
  var encabezado = document.getElementById("flechas");
  var cuerpo = document.getElementById("tablero");
  var fila = document.createElement("tr");
  var celda, contenido, i, j;
  vaciar(encabezado);
  vaciar(cuerpo);
  for (j = 1; j <= n; j++) {
    celda = document.createElement("th");
    contenido = document.createElement("div");
    contenido.className = "flecha";
    contenido.id = "columna" + j;
    celda.appendChild(contenido);
    fila.appendChild(celda);
    encabezado.appendChild(fila);
  }
  for (i = 1; i <= m; i++) {
    fila = document.createElement("tr");
    for (j = 1; j <= n; j++) {
      celda = document.createElement("td");
      contenido = document.createElement("div");
      contenido.className = "hueco";
      contenido.id = "celda" + i + j;
      //contenido.innerText = i + "-" + j;
      celda.appendChild(contenido);
      fila.appendChild(celda);
      cuerpo.appendChild(fila);
    }
  }
}

function vaciar(elemento) {
  while (elemento.childNodes.length > 0)
    elemento.childNodes[0].remove();
}

function partidasGuardadas() {
  inicializarTablero(document.formulario.cantJugadores.value);
  var partidas;
  document.getElementById("guardadas").style.display = "block";
  document.getElementById("jugadores").style.display = "none";
  var columnas = document.getElementById('columnas');
  vaciar(columnas);
  var fila = document.createElement('tr');
  var celda = document.createElement('th');
  celda.innerText = "Fecha";
  fila.appendChild(celda);
  celda = document.createElement('th');
  celda.innerText = "Jugador 1";
  fila.appendChild(celda);
  celda = document.createElement('th');
  celda.innerText = "Jugador 2";
  fila.appendChild(celda);
  if (document.formulario.cantJugadores.value == 3) {
    celda = document.createElement('th');
    celda.innerText = "Jugador 3";
    fila.appendChild(celda);
  }
  celda = document.createElement('th');
  celda.innerText = "Turno";
  fila.appendChild(celda);
  columnas.appendChild(fila);
  partidas = localStorage.getItem("partidas" + document.formulario.cantJugadores.value);
  partidas = JSON.parse(partidas);
  if (partidas != null) {
    var cuerpo = document.getElementById('detalle');
    vaciar(cuerpo);
    partidas.forEach(partida => {
      var fila = document.createElement('tr');
      fila.onclick = onclickHandler;
      fila.className = (cuerpo.childNodes.length % 2) ? '' : 'alt';
      var celda = document.createElement('td');
      fila.className = "tGuardadas";
      celda.appendChild(document.createTextNode(partida.fecha));
      fila.appendChild(celda);
      celda = document.createElement('td');
      celda.appendChild(document.createTextNode(partida.jugador1));
      fila.appendChild(celda);
      celda = document.createElement('td');
      celda.appendChild(document.createTextNode(partida.jugador2));
      fila.appendChild(celda);
      if (document.formulario.cantJugadores.value == 3) {
        celda = document.createElement('td');
        celda.appendChild(document.createTextNode(partida.jugador3));
        fila.appendChild(celda);
      }
      celda = document.createElement('td');
      celda.appendChild(document.createTextNode(partida.turno));
      fila.appendChild(celda);
      celda = document.createElement('td');
      var btn = document.createElement("button");
      btn.innerHTML = "X";
      btn.type = "button";
      btn.addEventListener("click", function (e) { eliminar(this.parentElement.parentElement) });
      celda.appendChild(btn);
      fila.appendChild(celda);
      cuerpo.appendChild(fila);
    });
  }
}

function comenzarPartida() {
  if ((document.formulario.nombreJugador1.value.length > 0 && document.formulario.nombreJugador1.value.length < 3) ||
      (document.formulario.nombreJugador2.value.length > 0 && document.formulario.nombreJugador2.value.length < 3) ||
      (document.formulario.cantJugadores.value == 3 && (document.formulario.nombreJugador3.value.length > 0 && document.formulario.nombreJugador3.value.length <3))) {
    alert("El nombre de jugador debe contener entre 3 y 14 caracteres (si es vacío toma por defecto el nro de jugador).");
  }
  else {
    var botones = document.getElementsByClassName("flecha");
    document.getElementById("comenzar").disabled = true;
    document.getElementById("reiniciar").disabled = false;
    document.getElementById("guardar").disabled = false;
    /*   if (document.formulario.cantJugadores.value == 3) {
    
      } */
    for (boton of botones) {
      boton.addEventListener("click", function (e) { insertarFicha(e) });
    }
    document.getElementById("formulario").style.display = "none";
    timer = setInterval(incrementarTiempo, 1000);
  }
}

function agregarCero(nro) {
  return (nro < 10) ? "0" + nro : nro;
}

function guardarPartida() {
  var partidas = [];
  var partida = new Object;
  var f = new Date;
  partida.fecha = f.getFullYear() + "-" + agregarCero(f.getMonth() + 1) + "-" + agregarCero(f.getDate()) + " " + agregarCero(f.getHours()) + ":" + agregarCero(f.getMinutes()) + ":" + agregarCero(f.getSeconds());
  partida.jugador1 = (document.formulario.nombreJugador1.value == "") ? "Jugador 1" : document.formulario.nombreJugador1.value;
  partida.jugador2 = document.formulario.nombreJugador2.value;
  partida.tiempoJugador1 = contadorJugador1;
  partida.tiempoJugador2 = contadorJugador2;
  partida.colorJugador1 = document.formulario.colorJugador1.value;
  partida.colorJugador2 = document.formulario.colorJugador2.value;
  partida.turno = turno;
  partida.jugadasJugador1 = obtenerFichas("J1");
  partida.jugadasJugador2 = obtenerFichas("J2");
  if (document.formulario.cantJugadores.value == 3) {
    partida.jugador3 = document.formulario.nombreJugador3.value;
    partida.tiempoJugador3 = contadorJugador3;
    partida.colorJugador3 = document.formulario.colorJugador3.value;
    partida.jugadasJugador3 = obtenerFichas("J3");
  }
  partidas = (localStorage.getItem("partidas" + document.formulario.cantJugadores.value) ? JSON.parse(localStorage.getItem("partidas" + document.formulario.cantJugadores.value)) : []);
  partidas.push(partida);
  localStorage.setItem("partidas" + document.formulario.cantJugadores.value, JSON.stringify(partidas));
  alert("La partida fue guardada con éxito.");
  nuevaPartida();
}

function obtenerFichas(jugador) {
  var jugadas = document.getElementsByClassName(jugador);
  var fichasJugador = [];
  for (ficha of jugadas) {
    fichasJugador.push(ficha.id)
  }
  return fichasJugador;
}

function insertarFicha(e) {
  if (document.getElementById("resultado").innerHTML == "") {
    var columna = e.target.id.substring(7);
    var hueco, celda;
    var i = (document.formulario.cantJugadores.value == 2) ? 6 : 9;
    for (i; i > 0; i--) {
      var celda = "celda" + i + columna;
      var hueco = document.getElementById(celda);
      if (hueco.className == "hueco") {
        hueco.className = turno;
        hueco.style.backgroundColor = document.getElementById("colorJugador" + turno.substring(1)).value;
        if (verificar(i, columna)) {
          document.getElementById("resultado").innerHTML = "Ganador " + document.getElementById("nombre" + turno).innerText + "!!!";
          clearTimeout(timer);
          break;
        }
        var huecos = document.getElementsByClassName("hueco");
        if (huecos.length == 0) {
          document.getElementById("resultado").innerHTML = "No quedan fichas disponibles. Empate!";
          clearTimeout(timer);
          break;
        }
        asignarTurno(turno);
        break;
      }
    }
  }
}

function asignarTurno(t) {
  if (t == "J1") {
    turno = "J2";
  }
  else if ((t == "J2" && document.formulario.cantJugadores.value == 2) || t == "J3") {
    turno = "J1";
  }
  else {
    turno = "J3";
  }
  document.getElementById("jugador1").style.borderColor = (turno == "J1") ? document.formulario.colorJugador1.value : "transparent";
  document.getElementById("jugador2").style.borderColor = (turno == "J2") ? document.formulario.colorJugador2.value : "transparent";
  document.getElementById("jugador3").style.borderColor = (turno == "J3") ? document.formulario.colorJugador3.value : "transparent";
}

function verificar(fila, columna) {
  var cantidad = 0;
  var i, j, celda;
  for (var i = 1; i <= ((document.formulario.cantJugadores.value == 2) ? 7 : 10) && cantidad < 4; i++) {
    celda = "celda" + fila + i;
    if (document.getElementById(celda).className == turno) {
      cantidad++;
    }
    else {
      cantidad = 0;
    }
  }
  //Sino termino horizontal verificar vertical:
  if (cantidad != 4) {
    cantidad = 0;
    for (var i = 1; i <= ((document.formulario.cantJugadores.value == 2) ? 6 : 9) && cantidad < 4; i++) {
      celda = "celda" + i + columna;
      if (document.getElementById(celda).className == turno) {
        cantidad++;
      }
      else {
        cantidad = 0;
      }
    }
  }
  //Sino termino vertical verificar diagonal abajo:
  if (cantidad != 4) {
    cantidad = 0;
    i = fila - 3;
    j = columna - 3;
    while (i < fila + 4 && j < columna + 4 && cantidad < 4) {
      if (i > 0 && i <= ((document.formulario.cantJugadores.value == 2) ? 6 : 9) && j > 0 && j <= ((document.formulario.cantJugadores.value == 2) ? 7 : 10)) {
        if (document.getElementById("celda" + i + j).className == turno) {
          cantidad++;
        }
        else {
          cantidad = 0;
        }
      }
      i++;
      j++;
    }
  }
  //Sino termino diagonal abajo verificar diagonal arriba:
  if (cantidad != 4) {
    cantidad = 0;
    i = fila + 3;
    j = columna - 3;
    while (i > fila - 4 && j < columna + 4 && cantidad < 4) {
      if (i > 0 && i <= ((document.formulario.cantJugadores.value == 2) ? 6 : 9) && j > 0 && j <= ((document.formulario.cantJugadores.value == 2) ? 7 : 10)) {
        if (document.getElementById("celda" + i + j).className == turno) { cantidad++; }
        else { cantidad = 0; }
      }
      i--;
      j++;
    }
  }
  return (cantidad == 4) ? true : false;
}

function onclickHandler() {
  if (seleccionado == this) {
    this.style.backgroundColor = "transparent";
    seleccionado = null;
  }
  else {
    if (seleccionado != null)
      seleccionado.style.backgroundColor = "transparent";
    this.style.backgroundColor = "#32637a";
    seleccionado = this;
  }
  inicializarTablero(document.formulario.cantJugadores.value);
  partidas = localStorage.getItem("partidas" + document.formulario.cantJugadores.value);
  partidas = JSON.parse(partidas);
  if (partidas != null) {
    partidas.forEach(partida => {
      if (partida.fecha == this.childNodes[0].innerText) {
        turno = partida.turno;
        document.getElementById("nombreJugador1").value = partida.jugador1;
        document.getElementById("nombreJugador2").value = partida.jugador2;
        document.getElementById("nombreJ1").innerText = partida.jugador1;
        document.getElementById("nombreJ2").innerText = partida.jugador2;
        document.getElementById("tiempoJ1").innerText = partida.tiempoJugador1;
        document.getElementById("tiempoJ2").innerText = partida.tiempoJugador2;
        contadorJugador1 = partida.tiempoJugador1;
        contadorJugador2 = partida.tiempoJugador2;
        var minutos = parseInt(contadorJugador1 / 60);
        var segundos = contadorJugador1 % 60;
        document.getElementById("tiempoJ1").innerHTML = agregarCero(minutos) + ":" + agregarCero(segundos);
        minutos = parseInt(contadorJugador2 / 60);
        segundos = contadorJugador2 % 60;
        document.getElementById("tiempoJ2").innerHTML = agregarCero(minutos) + ":" + agregarCero(segundos);
        document.getElementById("colorJugador1").value = partida.colorJugador1;
        document.getElementById("colorJugador2").value = partida.colorJugador2;
        document.getElementById("jugador1").style.borderColor = (turno == "J1") ? partida.colorJugador1 : "transparent";
        document.getElementById("jugador2").style.borderColor = (turno == "J2") ? partida.colorJugador2 : "transparent";
        if (document.formulario.cantJugadores.value == 3) {
          document.getElementById("nombreJugador3").value = partida.jugador3;
          document.getElementById("nombreJ3").innerText = partida.jugador3;
          contadorJugador3 = partida.tiempoJugador3;
          minutos = parseInt(contadorJugador3 / 60);
          segundos = contadorJugador3 % 60;
          document.getElementById("tiempoJ3").innerHTML = agregarCero(minutos) + ":" + agregarCero(segundos);
          document.getElementById("colorJugador3").value = partida.colorJugador3;
          document.getElementById("jugador3").style.borderColor = (turno == "J3") ? partida.colorJugador3 : "transparent";
          for (celda of partida.jugadasJugador3) {
            document.getElementById(celda).className = "J3";
            document.getElementById(celda).style.backgroundColor = partida.colorJugador3;
          }
        }
        for (celda of partida.jugadasJugador1) {
          document.getElementById(celda).className = "J1";
          document.getElementById(celda).style.backgroundColor = partida.colorJugador1;
        }
        for (celda of partida.jugadasJugador2) {
          document.getElementById(celda).className = "J2";
          document.getElementById(celda).style.backgroundColor = partida.colorJugador2;
        }
      }
    });
  }
}

function eliminar(fila) {
  var fecha = fila.childNodes[0].innerText;
  fila.parentNode.removeChild(fila);
  partidas = localStorage.getItem("partidas" + document.formulario.cantJugadores.value);
  partidas = JSON.parse(partidas);
  partidas.forEach(partida => {
    if (partida.fecha == fecha) {
      partidas.splice(partidas.indexOf(partida), 1);
    }
  });
  localStorage.setItem("partidas" + document.formulario.cantJugadores.value, JSON.stringify(partidas));
}

function incrementarTiempo() {
  var contador;
  switch (turno) {
    case "J1":
      contadorJugador1++;
      contador = contadorJugador1;
      break;
    case "J2":
      contadorJugador2++;
      contador = contadorJugador2;
      break;
    case "J3":
      contadorJugador3++;
      contador = contadorJugador3;
      break;
  }
  var minutos = parseInt(contador / 60);
  var segundos = contador % 60;
  document.getElementById("tiempo" + turno).innerHTML = agregarCero(minutos) + ":" + agregarCero(segundos);
}

function enviarEmail() {
  document.location = "mailto:" + "maximedina@gmail.com" + "?cc=" + document.getElementById("email").value + "&subject=" + "Contacto" + "&body=" + document.getElementById("mensaje").value;
}