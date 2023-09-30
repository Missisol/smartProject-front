<template>
  <section class="section gauge">
    <div class="gauge__header">
      <div class="gauge__title-wrapper">
        <h2 class="title">Данные на&nbsp;
            {{ lastData?.bme_date }}
        </h2>
        <span id="local-date" class="title title--date"></span>
      </div>
      <div id="icon-wrapper" @click="togglePanel">
        <i class="bx bx-grid-alt gauge__icon" v-show="isSimple"></i>
        <i class="bx bx-list-ul gauge__icon" v-show="!isSimple"></i>
      </div>
    </div>
    <div class="wrapper gauge-wrapper" v-show="!isSimple">
      <div class="gauge__box">
        <div id="temperature-gauge" ref="temperatureGaugeEl"></div>
      </div>
      <div class="gauge__box">
        <div id="humidity-gauge" ref="humidityGaugeEl"></div>
      </div>
      <div class="gauge__box">
        <div id="pressure-gauge" ref="pressureGaugeEl"></div>
      </div>
    </div>
    <div class="wrapper box-wrapper" v-show="isSimple">
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
import { gaugeDataArr, layout } from '../utils/plotlyData'

const BASE_URL = import.meta.env.DEV 
  ? import.meta.env.PUBLIC_BASE_URL 
  : import.meta.env.SITE

const url = ref(`${BASE_URL}/meteo/bme/`)
const timer = 60 * 1000
// const timer = 60 * 1000 * 15
const isSimple = ref(true)
const temperatureGaugeEl = ref(null)
const humidityGaugeEl = ref(null)
const pressureGaugeEl = ref(null)
const gaugeEls = ref(null)

const { data, lastData, error } = useFetch(url)


function getPeriodicData() {
  setTimeout(() => {
    const { data, lastData, error } = useFetch(url)

    getPeriodicData()
  }, timer)
}

getPeriodicData()


function togglePanel() {
  isSimple.value = !isSimple.value
}

function getGaugePlotly() {

  gaugeDataArr.forEach((data, idx) => {
    const trace = [
      {
        type: "indicator",
        mode: "gauge+number",
        // mode: "gauge+number+delta",
        // delta: { reference: data.reference },
        title: { text: data.text },
        gauge: {
          axis: { range: data.range },
          bar: { color: data.color},
          steps: data.steps,
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: data.value,
          },
        },
      },
    ]
    Plotly.newPlot(gaugeEls.value[idx], trace, layout, {displayModeBar: false})
  })
};

function updateGauge() {
  const temperature_update = {
    value: lastData?.value?.bme_temperature,
  }
  const humidity_update = {
    value: lastData?.value?.bme_humidity,
  }
  const pressure_update = {
    value: lastData?.value?.bme_pressure,
  }

  Plotly.update(temperatureGaugeEl.value, temperature_update);
  Plotly.update(humidityGaugeEl.value, humidity_update);
  Plotly.update(pressureGaugeEl.value, pressure_update);
}


function getUpdatedGaugePlotly() {
    updateGauge() 
    
    setTimeout(() => {
      updateGauge()

      getUpdatedGaugePlotly()
    }, 100000)
}

onMounted(() => {
  gaugeEls.value = [temperatureGaugeEl.value, humidityGaugeEl.value, pressureGaugeEl.value] 
  getGaugePlotly()
  setTimeout(() => {getUpdatedGaugePlotly()}, 500)
})
</script>

<style scoped>
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
