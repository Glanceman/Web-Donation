import { Web3 } from 'web3'
import storageABI from './assets/ABI/storageABI.json'
import tokenABI from './assets/ABI/tokenABI.json'

class Web3Service {
  //todo, add more functions
  static tokenContractAddress = '0x76DD57250854D125a34821f91C4D4026ACFaf802'
  static storageContractAddress = '0xcb704fC51Cf23d33335929DE0838aCf3031E272F'

  constructor() {
    console.log('create')
    Web3Service._instance = this
    this.account = ''
    this.web3
  }

  static getInstance() {
    if (!Web3Service._instance) {
      Web3Service._instance = new Web3Service('DefaultField1', 'DefaultField2')
    }
    return Web3Service._instance
  }

  //todo
  async connectMetamask() {
    //check metamask is installed
    if (window.ethereum) {
      console.log('connect')
      // instantiate Web3 with the injected provider
      this.web3 = new Web3(window.ethereum)

      //request user to connect accounts (Metamask will prompt)
      await window.ethereum.request({ method: 'eth_requestAccounts' })

      //get the connected accounts
      const accounts = await this.web3.eth.getAccounts()

      //show the first connected account in the react page
      this.account = accounts[0]
      return true
    }
    alert('Please download metamask')
    return false
  }

  getStorageContract() {
    if (!this.storageInst) {
      this.storageInst = new this.web3.eth.Contract(storageABI, Web3Service.storageContractAddress)
    }
    return this.storageInst
  }

  getTokenContract() {
    if (!this.tokenInst) {
      this.tokenInst = new this.web3.eth.Contract(tokenABI, Web3Service.storageContractAddress)
    }
    return this.tokenInst
  }

  async getCurrentConnectedAccount() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          this.web3 = new Web3(window.ethereum)
          this.account = accounts[0]
          return true
        }
      } catch (error) {
        console.log(error)
      }
    }
    return false
  }
}

export default Web3Service
