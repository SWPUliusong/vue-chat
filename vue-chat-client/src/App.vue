<template>
  <div id="app">
    <template v-if="!!user">
      <sider-left></sider-left>
      <sider-right></sider-right>
    </template>
    <signin-and-signup v-else></signin-and-signup>
  </div>
</template>

<script>
  import './socket'
  import { mapState } from 'vuex'
  import siderLeft from './components/sider-left'
  import siderRight from './components/sider-right'
  import signinAndSignup from './components/signinAndSignup'

  export default {
    computed: mapState(['user']),
    components: { siderLeft, siderRight, signinAndSignup }
  }
</script>

<style>
#app {
  margin: 0 auto;
  width: 80%;
  height: 100%;
  background: rgba(240,240,240,.6);
  display: flex;
}
@media(max-width: 1000px) {
    #app {
        margin: 0;
        width: 100%;
    }
}

.iconfont {
  font-size: 22px;
}

</style>
