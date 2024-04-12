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
    </el-card>
  </el-space>
</template>
<script>
import Web3Service from '../web3Service.js'
export default {
  data() {
    return {
      account: null,
      posts: [],
      storageInst: null

      /*
      fakeposts: [
        // will be deleted later
        {
          id: 123,
          name: 'name',
          context: 'context',
          host: '0x123456789123456789123456789123456789',
          hostname: 'abc',
          targetAmount: 123456,
          totalAmount: 123456,
          expire: true
        },
        {
          id: 123,
          name: 'name',
          context: 'context',
          host: '0x123456789123456789123456789123456789',
          hostname: 'abc',
          targetAmount: 123456,
          totalAmount: 123456,
          expire: true
        }
      ]
      */
    }
  },
  methods: {},

  async mounted() {
    await Web3Service.getInstance().getCurrentConnectedAccount()
    this.storageInst = Web3Service.getInstance().getStorageContract()
    this.account = Web3Service.getInstance().account
    this.posts = await this.storageInst.methods.getBoardsByAddr(this.account).call()
    console.log('boards: ', this.posts)
  }
}
</script>
<style></style>
