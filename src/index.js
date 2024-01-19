const Web3 = require('web3')
const web3 = new Web3('https://artio.rpc.berachain.com')

const hash = web3.utils.soliditySha3(web3.eth.abi.encodeParameter('uint256', '0'))
console.log(hash)