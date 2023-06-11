const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const logpath = {'dir':'/var/log/daemond/', 'file':'daemond.log'};
const pidpath = {'dir':'/var/run/daemond/', 'file':'daemond.pid'};

const logfullpath = path.join(logpath.dir, logpath.file);
const pidfullpath = path.join(pidpath.dir, pidpath.file);

function crearPidfile(fullpath) {
	fs.writeFile(fullpath, process.pid.toString(), function (err) {
  		if (err) throw err;
	});
}

//TODO primero chequear si es daemon y saltear todo esto
if (process.argv[2] !== 'daemon') {
	//Es el padre
	// Verificación del pidfile para saber si ya hay un daemon corriendo
	if (!fs.existsSync(pidpath.dir)) {
		fs.mkdirSync(pidpath.dir, { recursive: true });
	} 
	if (fs.existsSync(pidfullpath)) {
		process.exit();
	}
	//else, fork (revisar)
	// Crea un nuevo proceso ejecutando el mismo script con la opción --daemon y sudoku
	const child = childProcess.execFile(process.argv[0], [__filename, 'daemon']);
	//const child = childProcess.fork(__filename, ['daemon']);
	process.exit();
} else{
	//El hijo crea el pidfile
	crearPidfile(pidfullpath);
	
	//Revisa la carpeta de log
	if (!fs.existsSync(logpath.dir)) {
		fs.mkdirSync(logpath.dir, { recursive: true });
	} 
	
	//Ejecuta el daemon en sí
	const ping = childProcess.spawn('/usr/bin/ping', ['www.google.com']);
	ping.stdout.on('data', (data) => {
		fs.appendFile(logfullpath, `${data}`, function (err) {
			if (err) throw err;
		});
	});
}

/*
// TODO: Si ya está corriendo uno, termina, sino crea el pidfile y sigue
fs.writeFile(pidfullpath, process.pid.toString(), function (err) {
  		if (err) throw err;
	});
*/


/*
const ping = childProcess.spawn('/usr/bin/ping', ['www.google.com']);
ping.stdout.on('data', (data) => {
	fs.appendFile(__dirname + '/' + logfn, `${data}`, function (err) {
		if (err) throw err;
	});
});
*/
/*
// Define la función que se ejecutará en el daemon
function daemonFunction() {
  	// Lógica del daemon
    fs.appendFile(__dirname + '/' + logfn, 'hola\n', function (err) {
  		if (err) throw err;
	});
}


// Verifica si el proceso actual es el daemon o el proceso padre
//console.log(process.argv);
if (process.argv[2] === 'daemon') {
	// Ejecuta la función del daemon en un bucle infinito
	//process.chdir('/');
	
	fs.writeFile(path.join(pidpath.dir, pidpath.file), process.pid.toString(), function (err) {
  		if (err) throw err;
	});
	//daemonFunction();
	setInterval(daemonFunction, 1000);
} else {
	// Crea un archivo de marcador para indicar que el daemon está en ejecución
	//fs.writeFileSync(path.join(dirname, 'daemon.marker'), '');

	// Crea un nuevo proceso ejecutando el mismo script con la opción --daemon
	const child = childProcess.execFile(process.argv[0], [__filename, 'daemon']);
	//const child = childProcess.fork(__filename, ['daemon']);
    process.exit();
}
*/