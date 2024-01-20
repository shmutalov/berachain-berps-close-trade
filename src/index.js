import { Web3 } from 'web3'
import { MetaMaskSDK } from '@metamask/sdk'
import qrcode from 'qrcode-terminal';

let web3

async function connectWallet() {
    const options = {
        shouldShimWeb3: false,
        dappMetadata: {
          name: 'BERPS Close Trade',
        },
        logging: {
          sdk: false,
        },
        checkInstallationImmediately: false,
        // Optional: customize modal text
        modals: {
          install: ({ link }) => {
            qrcode.generate(link, { small: true }, (qr) => console.log(qr));
            return {};
          },
          otp: () => {
            return {
              mount() {},
              updateOTPValue: (otpValue) => {
                if (otpValue !== '') {
                  console.debug(
                    `[CUSTOMIZE TEXT] Choose the following value on your metamask mobile wallet: ${otpValue}`,
                  );
                }
              },
            };
          },
        },
      };
      
    const sdk = new MetaMaskSDK(options)
    const accounts = await sdk.connect()

    console.log(accounts)

    web3 = new Web3(sdk.getProvider())
    //web3 = new Web3('https://artio.rpc.berachain.com')
}

async function getStorageOfOpenTradesMap() {
    const address = '0000000000000000000000007c0d876398E4b2990bDBa2eAF3CB8FaF94B273e2'
    const slot = web3.eth.abi.encodeParameter('uint256', '0')
    
    const mapAddr = address + slot.substring(2)
    console.log("storage addr: " + mapAddr)
    const hash = web3.utils.soliditySha3(mapAddr)
    
    console.log(hash)
    
    const contractAddress = "0x081285043B44c7C0292F732fea9D9D16EAD2B5DB"
    
    const storageAddr = await web3.eth.getStorageAt(contractAddress, hash)
    
    console.log(storageAddr)
}

async function getStorage(slot) {
    //const slotAddr = web3.eth.abi.encodeParameter('uint256', slot)
    const contractAddress = "0x081285043B44c7C0292F732fea9D9D16EAD2B5DB"
    const storage = await web3.eth.getStorageAt(contractAddress, slot)
    
    console.log(storage)
}

async function getStorageByAddress(address, slot) {
    const slotEx = web3.utils.padLeft(slot, 64)
    const addr = web3.utils.padLeft(address, 64)
    const hash = web3.utils.soliditySha3(addr, slotEx)
    console.log("Slot: " + addr + slotEx)
    console.log("Hash: " + hash)
    const contractAddress = "0x081285043B44c7C0292F732fea9D9D16EAD2B5DB"
    const storage = await web3.eth.getStorageAt(contractAddress, hash)
    
    console.log(storage)
}

async function storageTest(address, slot) {
    const slotEx = web3.utils.padLeft(slot, 64)
    const addr = web3.utils.padLeft(address, 64)
    const hash = web3.utils.soliditySha3(addr, slotEx)
    console.log("Slot: " + addr + slotEx)
    console.log("Hash: " + hash)

    const contractAddress = "0x820c3F475B46a9965cCC5d5A915193A2362ec4ba";

    const storage = await web3.eth.getStorageAt(contractAddress, hash)
    
    console.log(storage)
}

async function storageTest2() {
    const slot = "0xa0628181450c790ef557e21ff882f08730717f64522e5c407d1f5cf9e173a8d9";
    const contractAddress = "0x820c3F475B46a9965cCC5d5A915193A2362ec4ba";
    const storage = await web3.eth.getStorageAt(contractAddress, slot)
    
    console.log(storage)
}

async function storageTest2_1(address, pair, index, slot) {
    const addrEx = web3.utils.padLeft(address, 64)
    const pairIndexEx = web3.eth.abi.encodeParameter('uint256', pair)
    const indexEx = web3.eth.abi.encodeParameter('uint256', index)
    const slotEx = web3.utils.padLeft(slot, 64)
    
    const hash1 = web3.utils.soliditySha3(addrEx, slotEx)
    const hash2 = web3.utils.soliditySha3(pairIndexEx + hash1.substring(2))
    const hash = web3.utils.soliditySha3(indexEx + hash2.substring(2))
    
    console.log("Hash: " + hash)

    const contractAddress = "0x8c28e79E8CC452F97ab8516beF736B4f4F79Ec64";

    const storage = await web3.eth.getStorageAt(contractAddress, hash)
    
    console.log(storage)
}

async function getStorageOfNestedMaps(contract, address, pair, index, slot) {
    const addrEx = web3.utils.padLeft(address, 64)
    const pairIndexEx = web3.eth.abi.encodeParameter('uint256', pair)
    const indexEx = web3.eth.abi.encodeParameter('uint256', index)
    const slotEx = web3.utils.padLeft(slot, 64)
    
    const hash1 = web3.utils.soliditySha3(addrEx, slotEx)
    const hash2 = web3.utils.soliditySha3(pairIndexEx + hash1.substring(2))
    const hash = web3.utils.soliditySha3(indexEx + hash2.substring(2))
    
    console.log("Hash: " + hash)

    const storage = await web3.eth.getStorageAt(contract, hash)
    
    console.log(storage)
}

function hashIncrease(hash, inc) {
    let hashWithout3bytes = hash.substring(0, hash.length-3)
    let last3bytes = parseInt(hash.substring(hash.length-3), 16)

    last3bytes += inc
    return hashWithout3bytes + last3bytes.toString(16).padStart(3, '0')
}

async function getStorageOpenTrade(contract, address, pair, index, slot) {
    const addrEx = web3.utils.padLeft(address, 64)
    const pairIndexEx = web3.eth.abi.encodeParameter('uint256', pair)
    const indexEx = web3.eth.abi.encodeParameter('uint256', index)
    const slotEx = web3.utils.padLeft(slot, 64)
    
    const hash1 = web3.utils.soliditySha3(addrEx, slotEx)
    const hash2 = web3.utils.soliditySha3(pairIndexEx + hash1.substring(2))
    const hash = web3.utils.soliditySha3(indexEx + hash2.substring(2))
    
    console.log("Hash start: " + hash)

    let trade = {}
    
    trade.trader = await web3.eth.getStorageAt(contract, hash)
    trade.pairIndex = await web3.eth.getStorageAt(contract, hashIncrease(hash, 1))
    trade.index = await web3.eth.getStorageAt(contract, hashIncrease(hash, 2))
    trade.initialPosToken = await web3.eth.getStorageAt(contract, hashIncrease(hash, 3))
    trade.positionSizeHoney = await web3.eth.getStorageAt(contract, hashIncrease(hash, 4))
    trade.openPrice = await web3.eth.getStorageAt(contract, hashIncrease(hash, 5))
    trade.buy = await web3.eth.getStorageAt(contract, hashIncrease(hash, 6))
    trade.leverage = await web3.eth.getStorageAt(contract, hashIncrease(hash, 7))
    trade.tp = await web3.eth.getStorageAt(contract, hashIncrease(hash, 8))
    trade.sl = await web3.eth.getStorageAt(contract, hashIncrease(hash, 9))

    return trade
}

async function closeTrade(contractAddress, address, pair, index) {
    const c = new web3.eth.Contract([{constant: false,inputs: [{internalType: 'uint256','name': 'pairIndex','type': 'uint256'},{internalType: 'uint256','name': 'index','type': 'uint256'}],name: 'closeTradeMarket',outputs: [],payable: false,stateMutability: 'nonpayable',type: 'function' }], contractAddress)

    const tx = await c.methods.closeTradeMarket(1,0).send({from: address})
    return tx
}

await connectWallet()

/*for (let index = 0; index < 20; index++) {
    console.log("Slot #" + index)
    await getStorage(index)
}

for (let index = 0; index < 18; index++) {
    console.log("Slot #" + index)
    await getStorageByAddress("0x7c0d876398E4b2990bDBa2eAF3CB8FaF94B273e2", index)
}*/

//await storageTest("0x7c0d876398E4b2990bDBa2eAF3CB8FaF94B273e2", 1)
//await storageTest2()
//await storageTest2_1("0x7c0d876398E4b2990bDBa2eAF3CB8FaF94B273e2", 1, 0, 0)
/*
for (let slot = 0; slot < 20; slot++) {
    console.log("Slot #" + slot)
    await getStorageOfNestedMaps("0x081285043B44c7C0292F732fea9D9D16EAD2B5DB", "0x7c0d876398E4b2990bDBa2eAF3CB8FaF94B273e2", 1, 0, slot)
}*/

// await getStorageOfNestedMaps("0x081285043B44c7C0292F732fea9D9D16EAD2B5DB", "0x7c0d876398E4b2990bDBa2eAF3CB8FaF94B273e2", 1, 0, 8)
const trade = await getStorageOpenTrade("0x081285043B44c7C0292F732fea9D9D16EAD2B5DB", "0x7c0d876398E4b2990bDBa2eAF3CB8FaF94B273e2", 1, 0, 8)
console.log(trade)

/*console.log("Closing trade...")
const txhash = await closeTrade("0xacB59BA2214497238D094444945fafc702831Fc5", "0x7c0d876398E4b2990bDBa2eAF3CB8FaF94B273e2", 1, 0)
console.log("Close trade tx: " + txhash)*/