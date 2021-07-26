#Instalar aplicação:
Instale o node pelo site oficial: https://nodejs.org/en/
Modulos usados(rodar no cmd como admin):
npm install node-firebird
npm install pm2
npm install cluster
npm install express
npm install body-parser --save

#Iniciar aplicaão
pm2 start apiRest.js

#Parar
pm2 stop apiRest.js

#Referencias:
https://ezdevs.com.br/comecando-uma-api-rest-com-node-js/

https://stackoverflow.com/questions/44126688/using-clusters-for-node-js-rest-api

https://www.npmjs.com/package/node-firebird

https://codesamplez.com/programming/using-json-in-node-js-javascript
