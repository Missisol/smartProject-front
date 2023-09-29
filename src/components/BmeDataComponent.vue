<template>
  <h1 class="title">BmeComponent</h1>
  <section class="section gauge">
    <div class="gauge__header">
      <div class="gauge__title-wrapper">
        <h2 class="title">Данные на&nbsp;
            {{ lastData?.bme_date }}
        </h2>
        <span id="local-date" class="title title--date"></span>
      </div>
      <div id="icon-wrapper" @click="togglePanel">
        <i class="bx bx-grid-alt gauge__icon" v-if="isSimple"></i>
        <i class="bx bx-list-ul gauge__icon" v-else></i>
      </div>
    </div>
    <div class="wrapper gauge-wrapper" v-if="!isSimple">
      <div class="gauge__box">
        <div id="temperature-gauge"></div>
      </div>
      <div class="gauge__box">
        <div id="humidity-gauge"></div>
      </div>
      <div class="gauge__box">
        <div id="pressure-gauge"></div>
      </div>
    </div>
    <div class="wrapper box-wrapper" v-else>
      <div class="box">
        <i class="bx bxs-thermometer readings"></i>
        <div class="box__content">
          <div class="box__title">Температура, &deg;C</div>
          <div class="box__data" id="temperature">{{ lastData?.bme_temperature }}</div>
        </div>
      </div>
      <div class="box">
        <i class="bx bxs-droplet-half readings readings--two"></i>
        <div class="box__content">
          <div class="box__title">Влажность, %</div>
          <div class="box__data" id="humidity">{{ lastData?.bme_humidity }}</div>
        </div>
      </div>
      <div class="box">
        <i class="bx bxs-tachometer readings readings--three"></i>
        <div class="box__content">
          <div class="box__title">Давление, мм.рт.ст.</div>
          <div class="box__data" id="pressure">{{ lastData?.bme_pressure }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFetch } from '../composables/fetch'

const BASE_URL = import.meta.env.DEV 
  ? import.meta.env.PUBLIC_BASE_URL 
  : import.meta.env.SITE

const url = ref(`${BASE_URL}/meteo/bme/`)
const timer = 60 * 1000 * 5
// const timer = 60 * 1000 * 15
const isSimple = ref(true)

const { data, lastData, error } = useFetch(url)


function getPeriodicData() {
  setTimeout(() => {
    const { data, lastData, error } = useFetch(url)

    getPeriodicData()
  }, timer)
}

function togglePanel() {
  isSimple.value = !isSimple.value
}

getPeriodicData()

onMounted(() => {
const temperatureGaugeDiv = document.getElementById("temperature-gauge");
const humidityGaugeDiv = document.getElementById("humidity-gauge");
const pressureGaugeDiv = document.getElementById("pressure-gauge");
const gaugeDivs = [temperatureGaugeDiv, humidityGaugeDiv, pressureGaugeDiv] 
})
</script>

<style scoped>
/* Grid settings */
.container {
  display: grid;
  grid-template-columns: 
   1fr [container-start] minmax(0, 1200px) [container-end] 1fr;
   gap: var(--gap);
   padding-top: calc(var(--gap) * 2);
   padding-bottom: calc(var(--gap) * 2);
}

.container > * {
  grid-column: container;
}

.title {
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
}


/* Header style */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header__title {
  color: var(--blue);
}

/* Section style */
.section {
  padding-top: var(--gap);
  padding-bottom: var(--gap);
}

.section + .section {
  border-top: 1px solid var(--lightgrey);
}

.charts__title-wrapper {
  margin-bottom: var(--gap);
}

/* Gauge styles */
.gauge__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--gap);
}

.title--date {
  font-size: 22px;
}

#icon-wrapper {
  cursor: pointer;
}

.gauge__icon {
  font-size: 30px;
  color: var(--blue);
}


.gauge-wrapper,
.box-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.visible {
  display: flex;
}

.hidden {
  display: none;
}

.box {
  flex-basis: 300px;
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 20px;
}

.readings {
  font-size: 30px;
  color: var(--green);
}

.readings--two {
  color: var(--blue);
}

.readings--three {
  color: var(--grey);
}

</style>
