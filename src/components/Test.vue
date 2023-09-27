<template>
  <h1 class="title">Test</h1>
  <ul>
    <li v-for="item in periodicData.value"> 
      <span>{{ item.id }}</span>&nbsp;&nbsp;:
      <span>{{ item.bme_date }}</span>&nbsp;:
      <span>temperature: {{ item.bme_temperature }}</span>&nbsp;
      <span>humidity: {{ item.bme_humidity }}</span>&nbsp;
      <span>pressure: {{ item.bme_pressure }}</span> 
    </li>
  </ul>
</template>

<script setup>
import { ref, toValue, watchEffect } from 'vue'
import { useFetch } from '../composables/fetch'

const url = ref('http://192.168.1.122/meteo/bme/')
// const url = ref('http://127.0.0.1:8000/meteo/bme/')
const periodicData = ref(null)
const periodicError = ref(null) 
const timer = 60 * 1000 * 5
// const timer = 60 * 1000 * 15

const { data, error } = useFetch(url)
periodicData.value = data
periodicError.value = error

function getPeriodicData() {
  setTimeout(() => {
    const { data, error } = useFetch(url)
    periodicData.value = data
    periodicError.value = error

    getPeriodicData()
  }, timer)
}

getPeriodicData()
</script>

<style scoped>
.title {
  color: blue;
}
</style>
