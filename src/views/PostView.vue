<template>
  <div>
    <div>
      <h2 style="text-align: center">Board</h2>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span></span>
      </div>

      <el-space fill style="width: 100%" direction="vertical">
        <el-card
          v-for="(board, index) in result"
          :key="index"
          :style="{ marginBottom: '5px', width: '100%' }"
        >
          <template #header>
            <div class="Board id:">
              <span>Board ID: {{ board.id }}</span>
            </div>
          </template>

          <el-descriptions title="Board Infomation" :column="1" class="board-descriptions">
            <el-descriptions-item label="Host name:">{{ board.hostname }}</el-descriptions-item>
            <el-descriptions-item label="Board name:">{{ board.name }}</el-descriptions-item>
            <el-descriptions-item label="Board context:">{{ board.context }}</el-descriptions-item>
            <el-descriptions-item label="Host address:">{{ board.host }}</el-descriptions-item>
            <el-descriptions-item label="Target amount:"
              >{{ board.targetAmount }} PPC
            </el-descriptions-item>
          </el-descriptions>

          <template #footer>
            <div style="display: flex; justify-content: space-between; align-items: center">
              <span>Total Amount: {{ board.totalAmount }} PPC</span>
              <el-button @click="openDonationPanel(board)">Donate</el-button>
            </div>
          </template>
        </el-card>
      </el-space>

      <el-dialog v-model="showDialog" title="Donate" :visible="showDialog" width="30%">
        <el-form>
          <el-form-item label="Donor Name">
            <el-input v-model="donorName"></el-input>
          </el-form-item>
          <el-form-item label="Amount">
            <el-input v-model.number="amount" type="number"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">Cancel</el-button>
          <el-button type="primary" @click="submitDonation">Confirm</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Web3Service from '@/web3Service'

export default {
  data() {
    return {
      result: [],
      account: null,
      storageInst: null,
      tokenInst: null,
      totalNumber: 0,
      showDialog: false,
      donorName: '',
      amount: 0,
      target_address: '',
      target_post_id: '',
      target_board: null
    }
  },

  methods: {
    async openDonationPanel(board) {
      this.target_board = board
      this.showDialog = true
    },

    async submitDonation() {
      //make approval
      console.log(this.target_board.host)
      console.log(this.amount)
      let value = this.amount * Math.pow(10, 18)
      console.log(value)
      let approveMethod = this.tokenInst.methods.approve(this.account, value)

      await approveMethod
        .send({ from: this.account })
        .then((receipt) => {
          console.log('Transaction receipt:', receipt)
        })
        .catch((error) => {
          console.error('Transaction error:', error)
          return false
        })

      try {
        await this.tokenInst.methods
          .transferFrom(this.account, this.target_board.host, value)
          .send({ from: this.account })
        console.log('transfer success')

        await this.storageInst.methods
          .donate(this.target_board.id, this.donorName, this.account, this.amount)
          .send({ from: this.account })
        console.log('donate success')
        this.showDialog = false

        // update totalAmount value
        const boardIndex = this.result.findIndex((board) => board.id === this.target_post_id)
        if (boardIndex !== -1) {
          this.result[boardIndex].totalAmount += this.amount
        }
      } catch (error) {
        console.log(error)
        console.log('Donate Fail')
        return false
      }
      console.log('Donate Success')
      return true
    },

    async approve() {
      await this.tokenInst.methods
        .approve(this.account, this.totalNumber)
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

  async mounted() {
    // get web3 instance
    await Web3Service.getInstance().getCurrentConnectedAccount()
    this.account = Web3Service.getInstance().account
    this.storageInst = Web3Service.getInstance().getStorageContract()
    this.tokenInst = Web3Service.getInstance().getTokenContract()
    this.result = await this.storageInst.methods.getAllBoardsUnExpir().call()
    console.log(this.result)
  }
}
</script>

<style></style>
