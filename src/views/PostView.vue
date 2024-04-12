<template>
  <el-space fill style="width: 100%" direction="vertical">
    <el-card v-for="post in posts" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ post.name }}</span>
        </div>
      </template>
      <p>{{ post.context }}</p>
      <el-descriptions title="User Info">
        <el-descriptions-item label="Host name">{{ post.hostname }}</el-descriptions-item>
        <el-descriptions-item label="Host address">{{ post.host }}</el-descriptions-item>
        <el-descriptions-item label="Target amount">{{ post.targetAmount }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>Total Amount: {{ post.totalAmount }}</template>
      <el-button type="primary" @click="createPost" :loading="isProcessing">
        {{ isProcessing ? 'Processing...' : 'Donate' }}
      </el-button>
    </el-card>
  </el-space>
</template>

<script>
import Web3Service from '@/web3Service'

export default {
  data() {
    return {
      posts: [],
      account: null,
      storageInst: null,
      tokenInst: null,
      isProcessing: false
    }
  },
  methods: {
    async donate(target_post_id, donor_name, amount, target_address) {
      this.isProcessing = true
      try {
        await this.tokenInst.methods
          .transferFrom(this.account, target_address, amount)
          .send({ from: this.account })
        await this.storageInst.methods
          .donate(target_post_id, donor_name, this.account, amount)
          .send({ from: this.account })
      } catch (error) {
        console.log(error)
        this.isProcessing = false
        return false
      }
      this.isProcessing = false
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
  async mounted() {
    await Web3Service.getInstance().getCurrentConnectedAccount()
    this.account = Web3Service.getInstance().account
    this.storageInst = Web3Service.getInstance().getStorageContract()
    this.tokenInst = Web3Service.getInstance().getTokenContract()

    this.posts = await this.storageInst.methods.getAllBoardsUnExpir().call()
  }
}
</script>

<style></style>
