<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-row :gutter="20" justify="space-between" align="middle">
          <el-col :span="22">
            <el-menu router :default-active="$route.path" mode="horizontal" class="el-menu-demo">
              <el-menu-item>
                <h1 class="mb-2">Web Donation</h1>
              </el-menu-item>

              <el-menu-item
                v-for="route in routes"
                :index="route.path"
                @click="$router.push(route.path)"
                >{{ route.name }}</el-menu-item
              >
            </el-menu>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="connectToMetaMask">
              {{ account === '' ? 'Connect To Wallet' : String(account.slice(0, 8) + '...') }}
            </el-button>
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'

import Web3Service from './web3Service.js'
import tokenABI from './assets/ABI/tokenABI.json'
import router from './router/index.js'

export default {
  data() {
    return {
      routes: [],
      account: ''
    }
  },
  methods: {
    async connectToMetaMask() {
      if (!Web3Service.account.length() === 0) {
        return
      }
      let resp = await Web3Service.connectMetamask()
      if (resp.result) {
        this.account = Web3Service.account
      }
    }
  },
  async mounted() {
    this.routes = router.options.routes
    await Web3Service.getCurrentConnectedAccount()
    this.account = Web3Service.account
    console.log('account', this.account)
    //Web3Service.web3.eth.getBalance(Web3Service.account).then(console.log)
    // sample only
    //const tokenInst = new Web3Service.web3.eth.Contract(tokenABI, Web3Service.tokenContractAddress)

    //const balance = await tokenInst.methods.balanceOf(Web3Service.account).call()
  }
}
</script>

<style scoped></style>
