const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const pidfilename = 'daemond.pid';

/*
console.log(__dirname  + '/' + filename);
console.log(__dirname + '/' + 'daemon.log');
console.log(process.argv);
fs.writeFile(__dirname + '/' + 'daemon.log', 'hola\n', function (err) {
  	if (err) throw err;
	});
*/

// Define la función que se ejecutará en el daemon
function daemonFunction() {
  	// Lógica del daemon
    fs.writeFile(__dirname + '/' + 'daemon.log', 'hola', function (err) {
  		if (err) throw err;
	});
}


// Verifica si el proceso actual es el daemon o el proceso padre
//console.log(process.argv);
if (process.argv[2] === 'daemon') {
	// Ejecuta la función del daemon en un bucle infinito
	fs.writeFile(__dirname + '/' + pidfilename, process.pid.toString(), function (err) {
  		if (err) throw err;
	});
	
	//setInterval(daemonFunction(), 1000);
} else {
	// Crea un archivo de marcador para indicar que el daemon está en ejecución
	//fs.writeFileSync(path.join(dirname, 'daemon.marker'), '');

	// Crea un nuevo proceso ejecutando el mismo script con la opción --daemon
	const child = childProcess.execFile(process.argv[0], [__filename, 'daemon']);
    //process.exit();
}
