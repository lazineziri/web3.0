//https://eth-ropsten.alchemyapi.io/v2/9Rg5GQ0GKRTkE-hJ0tLwxAeZVEa_Qloz

require("@nomiclabs/hardhat-waffle");

module.exports={
  solidity:'0.8.0',
  networks:{
    ropsten:{
      url:"https://eth-ropsten.alchemyapi.io/v2/9Rg5GQ0GKRTkE-hJ0tLwxAeZVEa_Qloz",
      accounts:['bd9f2e8a4d6e288a45eb9cadf2ba31296e85093492525bf00f82b038fdd74191']
    }
  }
}