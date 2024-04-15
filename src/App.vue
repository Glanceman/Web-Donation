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
        <RouterView :account="account" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
import Web3Service from './web3Service'
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
      if (Web3Service.getInstance().account.length > 0) {
        // already setup connection
        console.log('already connect')
        return
      }
      let resp = await Web3Service.getInstance().connectMetamask()
      console.log(resp)
      if (resp) {
        this.account = Web3Service.getInstance().account
        // add eventlistener
        if (this.account !== '') {
          Web3Service.getInstance().web3.provider.on('accountsChanged', (ac) => {
            console.log('accountChange', ac)
            if (ac.length == 0) {
              Web3Service.getInstance().account = ''
            } else {
              Web3Service.getInstance().account = ac[0]
            }
            this.account = Web3Service.getInstance().account
          })
        }
      }
    }
  },
  async mounted() {
    this.routes = router.options.routes
    await Web3Service.getInstance().getCurrentConnectedAccount()
    this.account = Web3Service.getInstance().account
    // add eventlistener
    if (this.account !== '') {
      Web3Service.getInstance().web3.provider.on('accountsChanged', (ac) => {
        console.log('accountChange', ac)
        if (ac.length == 0) {
          Web3Service.getInstance().account = ''
        } else {
          Web3Service.getInstance().account = ac[0]
        }
        this.account = Web3Service.getInstance().account
      })
    }
    console.log('account', this.account)
  }
}
</script>

<style scoped></style>
