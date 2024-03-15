import { Web3 } from 'web3'
class Web3Service {
  //todo, add more functions
  static web3
  static account
  constructor() {
    return Web3Service.createInstance()
  }

  static createInstance() {
    if (Web3Service._instance) {
      return Web3Service._instance
    }
    Web3Service._instance = this
    return Web3Service._instance
  }

  //todo
  static async connectMetamask() {
    if (!Web3Service._instance) {
      Web3Service.createInstance()
    }

    //check metamask is installed
    if (window.ethereum) {
      console.log('connect')
      // instantiate Web3 with the injected provider
      Web3Service.web3 = new Web3(window.ethereum)

      //request user to connect accounts (Metamask will prompt)
      await window.ethereum.request({ method: 'eth_requestAccounts' })

      //get the connected accounts
      const accounts = await Web3Service.web3.eth.getAccounts()

      //show the first connected account in the react page
      Web3Service.account = accounts[0]
      console.log('account: ', this.account)
    } else {
      alert('Please download metamask')
    }
  }

  static checkWeb3Connect() {
    if (window.ethereum) {
      return true
    } else {
      return false
    }
  }
}

export default Web3Service
