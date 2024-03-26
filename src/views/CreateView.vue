<template>
  <div>
    <el-button type="primary" @click="createPost"> Create sample board </el-button>
  </div>
</template>
<script>
import Web3Service from '@/web3Service'
export default {
  data() {
    return {
      account: null,
      storageInst: null
    }
  },
  methods: {
    async createPost() {
      // sample only
      console.log(this.storageInst.methods)
      console.log(this.account)
      let method = this.storageInst.methods.createBoard(
        'testname',
        String(this.account),
        'PostTitle',
        'PostContext',
        123456 // target amount
      )
      let estimateGasFee = await method.estimateGas({ from: this.account })
      const gasPrice = await Web3Service.getInstance().web3.eth.getGasPrice()
      let option = {
        from: String(this.account),
        gas: String(estimateGasFee),
        gasPrice: String(gasPrice)
      }
      console.log(option)
      let resp = await method.send(option)
      // no complete
      //send() pay gas free call() no need reference link :https://bitsofco.de/calling-smart-contract-functions-using-web3-js-call-vs-send/
      console.log(resp)
    }
  },
  async mounted() {
    await Web3Service.getInstance().getCurrentConnectedAccount()
    this.account = Web3Service.getInstance().account
    this.storageInst = Web3Service.getInstance().getStorageContract()
  }
}
</script>
<style></style>
