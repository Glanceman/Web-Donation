<template>
  <el-radio-group v-model="tabPosition" style="margin-bottom: 30px">
    <el-radio-button value="post">Post</el-radio-button>
    <el-radio-button value="donate">Donate</el-radio-button>
  </el-radio-group>

  <div>
    <div v-if="tabPosition === 'post'">
      <el-space fill style="width: 100%" direction="vertical">
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
            <el-descriptions-item label="Target amount"
              >{{ post.targetAmount }}PPC</el-descriptions-item
            >
          </el-descriptions>
          <el-collapse @change="(val) => handleChange(val, post.id)">
            <el-collapse-item title="Donors" name="Donors">
              <div v-for="donor in donors.get(post.id)">
                <el-descriptions>
                  <el-descriptions-item label="Name">{{ donor.name }}</el-descriptions-item>
                  <el-descriptions-item label="Address">{{
                    donor.donator_addr
                  }}</el-descriptions-item>
                  <el-descriptions-item label="Amount">{{ donor.amount }}PPC</el-descriptions-item>
                </el-descriptions>
              </div>
            </el-collapse-item>
          </el-collapse>
          <template #footer>Total Amount: {{ post.totalAmount }} PPC</template>
        </el-card>
      </el-space>
    </div>

    <div v-if="tabPosition === 'donate'">
      <el-space fill style="width: 100%" direction="vertical">
        <h1 v-show="donatedRecords.length == 0">Empty</h1>
        <el-card v-for="record in donatedRecords" shadow="hover">
          <el-descriptions>
            <el-descriptions-item label="Post ID">{{ record.targetId }}</el-descriptions-item>
            <el-descriptions-item label="Name">{{ record.name }}</el-descriptions-item>
            <el-descriptions-item label="Donator address">{{
              record.donator_addr
            }}</el-descriptions-item>
          </el-descriptions>
          <template #footer>Donated Amount: {{ record.amount }} PPC</template>
        </el-card>
      </el-space>
    </div>
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
      tabPosition: 'post',
      /*account: null,*/
      posts: [],
      donatedRecords: [],
      storageInst: null,
      donors: new Map()
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
      ]
      fakeRecords: [
        // will be deleted later
        {
          targetId: 123,
          name: 'name',
          donator_addr: '0x123456789123456789123456789123456789',
          amount: 123456
        },
      */
    }
  },
  watch: {
    async account(newVal, oldVal) {
      console.log('account change:', newVal)
      if (newVal === '') {
        this.posts = []
        this.donatedRecords = []
        this.storageInst = null
        return
      }
      this.storageInst = Web3Service.getInstance().getStorageContract()
      this.posts = await this.storageInst.methods.getBoardsByAddr(this.account).call()
      this.donatedRecords = await this.storageInst.methods.getDonatorInfoByAddr(this.account).call()
    }
  },

  methods: {
    async handleChange(val, post_id) {
      console.log(val)
      if (val.includes('Donors')) {
        // open
        console.log(post_id)
        let res = await this.storageInst.methods.getDonatorInBoard(post_id).call()
        console.log(res)
        let bset = this.donors.set(post_id, res)
        console.log(bset)
      } else {
        //close
        let dres = this.donors.delete(post_id)
        console.log(dres)
      }
    }
  },

  async mounted() {
    if (this.account !== '') {
      this.storageInst = Web3Service.getInstance().getStorageContract()
      this.posts = await this.storageInst.methods.getBoardsByAddr(this.account).call()
      this.donatedRecords = await this.storageInst.methods.getDonatorInfoByAddr(this.account).call()
    }
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
