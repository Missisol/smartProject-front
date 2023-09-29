import { ref, reactive, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const lastData = ref(null)
  const error = ref(null)

	const fetchData = async () => {
    try {
			const res = await fetch(toValue(url))
      const json = await res.json()
      data.value = json.results
      lastData.value = json.results[0]
    } 
    catch (err) {
      error.value = err
    }
	}

  watchEffect(() => {
    // reset state before fetching..
    fetchData(url)
  })

  return { data, lastData, error }
}