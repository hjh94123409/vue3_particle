<template>
  <div ref="canvasBox"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Base3d from '../utils/Base3d'

const canvasBox = ref(null)

onMounted(() => {

  const $three = new Base3d(canvasBox.value)


})

</script>

<style lang="less" scoped>
  
</style>