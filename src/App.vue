<script setup>
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

import Web3Service from './web3Service.js'

onMounted(async () => {
  await Web3Service.connectMetamask()
})
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <h1 class="mb-2">Web Donation</h1>
        <el-menu default-active="1" class="el-menu-vertical-demo">
          <el-menu-item index="1" @click="$router.push('/')">Post</el-menu-item>
          <el-menu-item index="2" @click="$router.push('/create')">Create</el-menu-item>
          <el-menu-item index="3" @click="$router.push('/history')">History</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped></style>
