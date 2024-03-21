<template>
  <div>History</div>
</template>
<script>
import Web3Service from '../web3Service.js'
import storageABI from '../assets/ABI/storageABI.json'
export default {
  data() {
    return {
      post: [],
      storageInst: null
    }
  },
  methods: {},

  async mounted() {
    await Web3Service.getCurrentConnectedAccount()
    this.storageInst = new Web3Service.web3.eth.Contract(
      storageABI,
      Web3Service.storageContractAddress
    )
    this.post = await this.storageInst.methods.getAllBoardsExpir().call()
    console.log('boards: ', this.post)
  }
}
</script>
<style></style>
