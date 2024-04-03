<template>
 <div>
    <div>
      <label for="hostname">Hostname:</label>
      <input type="text" id="hostname" v-model="hostnameInput" />
    </div>

    <div>
      <label for="name">Board Name:</label>
      <input type="text" id="name" v-model="nameInput" />
    </div>

    <div>
      <label for="context">Board Context:</label>
      <textarea id="context" v-model="contextInput" rows="10" cols="50"></textarea>
    </div>

    <div>
      <label for="targetAmount">Target Amount:</label>
      <input type="number" id="targetAmount" v-model.number="targetAmountInput" />
    </div>

    <button @click="createPost">Submit</button>
  </div>
</template>
<script>
import Web3Service from '@/web3Service'
export default {
  data() {
    return {
      result:[],
      account: null,
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
      const hostname = this.hostnameInput;
      const name = this.nameInput;
      const context = this.contextInput;
      const targetAmount = this.targetAmountInput;

      this.storageInst.methods.createBoard(hostname, this.account, name, context, targetAmount)
        .send({ from: this.account })
        .then((receipt) => {
          console.log('Transaction receipt:', receipt);
        })
        .catch((error) => {
          console.error('Transaction error:', error);
        });
    },
    async donate(target_post_id,donor_name,amount,target_address)
    {

      try {
        await this.tokenInst.methods.transferFrom(this.account,target_address,amount)
        .send({from: this.account});
        await this.storageInst.methods.donate(target_post_id, donor_name, this.account,amount)
          .send({ from: this.account });
      } catch (error) {
        console.log(error)
        return false;
      }
        return true;
  },
  async approve(total_number){
    await this.tokenInst.methods.approve(this.account,total_number)
    .send({from: this.account})
    .then((receipt) => {
          console.log('Transaction receipt:', receipt);
        })
        .catch((error) => {
          console.error('Transaction error:', error);
          return false;
        });
    return true;

  }

  },
  
  async mounted() {
    //get web3 instance 
    await Web3Service.getInstance().getCurrentConnectedAccount()
    this.account = Web3Service.getInstance().account
    this.storageInst = Web3Service.getInstance().getStorageContract()
    this.tokenInst=Web3Service.getInstance().getTokenContract()

    this.result=await this.storageInst.methods.getAllBoardsUnExpir().call();
    console.log(this.result)
  }
}
</script>
<style></style>
