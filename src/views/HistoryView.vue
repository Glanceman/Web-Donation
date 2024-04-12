<template>
  <el-radio-group v-model="tabPosition" style="margin-bottom: 30px">
    <el-radio-button value="post">Post</el-radio-button>
    <el-radio-button value="donate">Donate</el-radio-button>
  </el-radio-group>

  <div>
    <el-space fill style="width: 100%" direction="vertical">
      <template v-if="tabPosition === 'post'">
        <h1 v-show="posts.length == 0">Empty</h1>
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
            <el-descriptions-item label="Target amount">{{
              post.targetAmount
            }}</el-descriptions-item>
          </el-descriptions>
          <template #footer>Total Amount: {{ post.totalAmount }}</template>
        </el-card>
      </template>
      <template v-if="tabPosition === 'donate'">
        <h1 v-show="donatedRecords.length == 0">Empty</h1>
        <el-card v-for="record in donatedRecords" shadow="hover">
          <el-descriptions>
            <el-descriptions-item label="Post ID">{{ record.targetId }}</el-descriptions-item>
            <el-descriptions-item label="Name">{{ record.name }}</el-descriptions-item>
            <el-descriptions-item label="Donator address">{{
              record.donator_addr
            }}</el-descriptions-item>
          </el-descriptions>
          <template #footer>Donated Amount: {{ record.Amount }}</template>
        </el-card>
      </template>
    </el-space>
  </div>
</template>
<script>
import Web3Service from '../web3Service.js'
export default {
  data() {
    return {
      tabPosition: 'post',
      account: null,
      posts: [],
      donatedRecords: [],
      storageInst: null,

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
      fakeRecords: [
        // will be deleted later
        {
          targetId: 123,
          name: 'name',
          donator_addr: '0x123456789123456789123456789123456789',
          amount: 123456
        },
        {
          targetId: 124,
          name: 'name',
          donator_addr: '0x123456789123456789123456789123456789',
          amount: 123456
        }
      ]
    }
  },
  methods: {},

  async mounted() {
    await Web3Service.getInstance().getCurrentConnectedAccount()
    this.storageInst = Web3Service.getInstance().getStorageContract()
    this.account = Web3Service.getInstance().account
    this.posts = await this.storageInst.methods.getBoardsByAddr(this.account).call()
    this.donatedRecords = await this.storageInst.methods.getDonatorInfoByAddr(this.account).call()
    console.log('boards: ', this.posts)
    console.log('donatedRecord: ', this.donatedRecords)
  }
}
</script>
<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
