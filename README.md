# Valex
- API de cartões de benefícios
- Criação, recarga, ativação, e processamento das compras

## Usage

```bash
$ git clone https://github.com/kethlynsara/Valex.git

$ cd Valex

$ npm install

$ npm run dev
```
## Technologies

<div align="center">
	<img src="https://img.shields.io/badge/Node.js-430098?style=for-the-badge&logo=nodedotjs&logoColor=white" >
  <img src="https://img.shields.io/badge/git-000000.svg?style=for-the-badge&logo=git&logoColor=white" >
	<img src="https://img.shields.io/badge/TypeScript-316192?style=for-the-badge&logo=typescript&logoColor=323330" >
	<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" >
	<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" >
	<img src="https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white" >
</div>

API:

```
- POST /card
    - Rota para cadastrar um novo cartão
    - headers: {
        "apiKey": "zadKLNx.Dz"
    }
    - body: {
        "employeeId": 1,
        "type": "education"
    }
- POST /card-activate
    - Rota para ativar um cartão
    - headers: {}
    - body: {
        "cardId": 2,
        "CVC": 452,
        "password": "8751"
    }
- GET /card-transactions/:id
    - Rota para visualizar saldo e transações
    - headers: {}
    - body: {}
- POST /card-block/:id 
    - Rota para bloquear um cartão
    - headers: {}
    - body: {
        "password": "7458"
    }
- POST /card-unlock/:id 
    - Rota para desbloquear um cartão
    - headers: {}
    - body: {
        "password": "7458"
    }
- POST /recharge
    - Rota para recarregar um cartão
    - headers: {}
    - body: {
        "id": 4,
        "value": 1200
    }
- POST /buy
    - Rota para realizar um pagamento
    - headers: {}
    - body: {
        "cardId": 4,
        "password": "8421",
        "businessId": 2,
        "amount": 65
    }
```
