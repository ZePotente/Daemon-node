const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

//Paths estándar de logs
const logpath = {'dir':'/var/log/daemond/', 'file':'daemond.log'};
const logfullpath = path.join(logpath.dir, logpath.file);
//Paths estándar de pidfiles
const pidpath = {'dir':'/var/run/daemond/', 'file':'daemond.pid'};
const pidfullpath = path.join(pidpath.dir, pidpath.file);

//Crea un pidfile en el lugar correcto, y escribe el pid del proceso
//process.pid.toString() porque sólo acepta strings, no números
function crearPidfile(fullpath) {
	fs.writeFile(fullpath, process.pid.toString(), function (err) {
  		if (err) throw err;
	});
}

//Verifica si el proceso es el padre o el daemon
if (process.argv[2] !== 'daemon') {
	// Es el padre
	// Verificación del pidfile para saber si ya hay un daemon corriendo
	if (!fs.existsSync(pidpath.dir)) {
		fs.mkdirSync(pidpath.dir, { recursive: true });
	} 
	if (fs.existsSync(pidfullpath)) {
		process.exit();
	}
	//else, fork (revisar)
	// Hace un fork para el daemon y termina
	const child = childProcess.execFile(process.argv[0], [__filename, 'daemon']);
	//const child = childProcess.fork(__filename, ['daemon']);
	process.exit();
} else{
	//--Handler de señales--
	function handle(codigo) {
		fs.unlinkSync(pidfullpath);
    	process.exit();
	}
	process.on('SIGINT', handle);
  	process.on('SIGTERM', handle);
  	process.on('SIGHUP', handle);
  	//-- --

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
