# NExt.js Open Jira APP
Para correr localmente, se necesita la base de datos
...
docker-compose up -d
...

* El -d, significa __detached__

* MongoBD URL Local: 
...
mongodb://localhost:27017/entriesdb
...

#Llenar la base de datos con información de pruebas

Llamara:
```
    http://localhost:3000/api/seed
```
