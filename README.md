Requerimentos:
- MySQL
- NodeJS

fazer o clone do repositório e executar o comando "npm install" na pasta raiz.

Após a instalação executar o comando "npm start" para subir a aplicação

A documentação dos path está na pasta "docs" no arquivo swagger.yml, está descrito para swagger o comportamento dos paths.

O que eu uso de variáveis de ambiente está no arquivo ".env.example" podendo ser alterado, assim criando um arquivo ".env".

Também criei uma collection do postman para ajudar nos testes e na visualização da implementação, que está na pasta "docs" no arquivo "teste_dock.postman_collection.json"

--- Importando o schema do banco de dados

o schema do banco de dados esta na pasta "database" no arquivo "schema.sql", para importar basta acessar o cli do mysql no console de sua preferência.

e executar os seguintes passos:

sudo mysql -u root -p

// Criando um usuário para uso da API
create user 'suporte'@'localhost' identified by '123#Mudar';

// Concedendo privilégios
grant all privileges on db_tarefas.* to 'suporte'@'localhost';

// Saindo do SGDB
exit

// Importando o schema do banco de dados
mysql -u suporte -p < database/schema.sql