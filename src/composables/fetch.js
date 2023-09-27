import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

	const fetchData = async (dt) => {
    try {
			const res = await fetch(toValue(url))
      const json = await res.json()
      data.value = json.results
    } 
    catch (err) {
      error.value = err
    }

      // .then((res) => res.json())
      // .then((json) => (data.value = json.results))
      // .catch((err) => (error.value = err))
	}

  watchEffect(() => {
    // reset state before fetching..
    fetchData(url)
  })

  return { data, error }
}