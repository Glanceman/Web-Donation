<template>
  <div class="container" v-show="account !== ''">
    <div class="form-group">
      <label for="hostname">Hostname:</label>
      <input type="text" id="hostname" v-model="hostnameInput" />
    </div>

    <div class="form-group">
      <label for="name">Board Name:</label>
      <input type="text" id="name" v-model="nameInput" />
    </div>

    <div class="form-group">
      <label for="context">Board Context:</label>
      <textarea id="context" v-model="contextInput" class="custom-textarea"></textarea>
    </div>

    <div class="form-group">
      <label for="targetAmount">Target Amount:</label>
      <input type="number" id="targetAmount" v-model.number="targetAmountInput" />
    </div>

    <el-button type="primary" @click="createPost" :loading="isSubmitting">
      {{ isSubmitting ? 'Submitting...' : 'Submit' }}
    </el-button>
  </div>
</template>
<script>
import Web3Service from '@/web3Service'
export default {
  props: {
    account: String
  },
  data() {
    return {
      isSubmitting: false,
      result: [],
      /*account: null,*/
      storageInst: null,
      tokenInst: null,

      hostnameInput: '',
      nameInput: '',
      contextInput: '',
      targetAmountInput: null
    }
  },
  methods: {
    async createPost() {
      this.isSubmitting = true

      const hostname = this.hostnameInput
      const name = this.nameInput
      const context = this.contextInput
      const targetAmount = this.targetAmountInput

      try {
        let resp = await this.storageInst.methods
          .createBoard(hostname, this.account, name, context, targetAmount)
          .send({ from: this.account })
      } catch (error) {
        console.log(error)
      }
      this.isSubmitting = false
    },

    async donate(target_post_id, donor_name, amount, target_address) {
      try {
        await this.tokenInst.methods
          .transferFrom(this.account, target_address, amount)
          .send({ from: this.account })
        await this.storageInst.methods
          .donate(target_post_id, donor_name, this.account, amount)
          .send({ from: this.account })
      } catch (error) {
        console.log(error)
        return false
      }
      return true
    },
    async approve(total_number) {
      await this.tokenInst.methods
        .approve(this.account, total_number)
        .send({ from: this.account })
        .then((receipt) => {
          console.log('Transaction receipt:', receipt)
        })
        .catch((error) => {
          console.error('Transaction error:', error)
          return false
        })
      return true
    }
  },

  watch: {
    async account(newVal, oldVal) {
      console.log('account change:', newVal)
      if (newVal === '') {
        this.storageInst = null
        this.tokenInst = null
        return
      }
      this.storageInst = Web3Service.getInstance().getStorageContract()
      this.tokenInst = Web3Service.getInstance().getTokenContract()
    }
  },

  async mounted() {
    //get web3 instance
    // await Web3Service.getInstance().getCurrentConnectedAccount()
    // this.account = Web3Service.getInstance().account
    if (this.account !== '') {
      this.storageInst = Web3Service.getInstance().getStorageContract()
      this.tokenInst = Web3Service.getInstance().getTokenContract()
    }

    // this.result = await this.storageInst.methods.getAllBoardsUnExpir().call()
    // console.log(this.result)
  }
}
</script>
<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  width: 100%;
}
.form-group input {
  height: 30px;
  font-size: 16px;
}
.custom-textarea {
  height: 200px;
  font-size: 18px;
}
</style>
