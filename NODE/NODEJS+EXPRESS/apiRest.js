const express = require('express');
const helmet = require('helmet')
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const port = 5001;
const cluster = require('cluster');
const totalCPUs = require('os').cpus().length;
var Firebird = require('node-firebird');
var bodyParser = require('body-parser');

const csrfMiddleware = csurf({
  cookie: true
});

var FirebirdConfig = {};
 
FirebirdConfig.host = '127.0.0.1';
FirebirdConfig.port = 3050;
FirebirdConfig.database = 'D:\\ZREDE\\TestesDesenvolvimento\\TestePerformance\\DelphiMormot\\AGRO.FDB';
FirebirdConfig.user = 'SYSDBA';
FirebirdConfig.password = 'masterkey';
FirebirdConfig.lowercase_keys = false; // set to true to lowercase keys
FirebirdConfig.role = null;            // default
FirebirdConfig.pageSize = 4096;        // default when creating database
 
// 5 = the number is count of opened sockets
var pool = Firebird.pool(5, FirebirdConfig); 

if (cluster.isMaster) {
  console.log('Numero de nucleos do CPU ' + totalCPUs);
  console.log('Master ' + process.pid + ' está funcionando');

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log('Worker PID:' + worker.process.pid + ' Morreu');
    console.log("Um novo worker será criado!");
    cluster.fork();
  });

} else {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(csrfMiddleware);
  console.log('Worker PID:' + process.pid + ' Iniciou');

  app.get('/', (req, res) => {
    res.send('Hello World!');
  })

  app.get('/api/ping', function (req, res) {
    res.send('pong');
  })
  
  app.get('/api/clientes', function (req, res) {
	pool.get(function(err, db) {	 
		if (err)
			throw err;	 
		db.query('SELECT * FROM clientefb', function(err, result) {
			res.send(result);
			db.detach();
		});
	});
  })

  app.post('/api/clientes', function (req, res) {
    //console.log(req.body);
	pool.get(function(err, db) {	 
		if (err)
			throw err;	 
	    db.query('INSERT INTO clientefb (NOME, CPF, ENDERECO) VALUES(?, ?, ?)', [req.body.nome, req.body.cpf, req.body.endereco], function(err, result) {		
        db.detach();
        });
		res.send('Inserido');
	});
  })


  app.listen(port, () => {
    console.log('Aplicativo iniciado na porta: ' + port);
  })

}
