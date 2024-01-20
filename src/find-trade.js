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

    web3 = new Web3(sdk.getProvider())
    return accounts
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

const accounts = await connectWallet()
console.log("Connected accounts: ")
console.log(accounts)

console.log("Looking for trades...")

accounts.forEach(async account => {
  const address = web3.utils.toChecksumAddress(account)
  console.log("Checking account " + address + " open trades")
  const trade = await getStorageOpenTrade("0x081285043B44c7C0292F732fea9D9D16EAD2B5DB", address, 1, 0, 8)
  
  if (trade.trader.substring(trade.trader.length - 4) == account.substring(trade.trader.length - 4)) {
    console.log("Trade found:")
    console.log(trade)
  }
})

console.log("Done.")
process.exit()