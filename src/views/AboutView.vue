<script setup lang="ts">

const inputString = `user input:
['test', 'nike shoes', 'footwear', 'walking', 'concrete', 'city']

computer analysis:
['nike', 'sneakers', 'white socks', 'concrete stairs', 'low angle shot', 'movement', 'urban environment', 'cityscape', 'step-by-step progression', 'footwear', 'transition']`;

const payload = {
      "input_value": inputString,
      "output_type": "chat",
      "input_type": "chat",
      "session_id": "test vue session",
};

const options = {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload)
};

const langflowOnline = "http://localhost:8010/proxy/lf/71205138-5f00-4290-9d3d-a76f01eb19c9/api/v1/run/4e33cd6e-0177-4412-ae84-22949648c523"
const langflowUrl = "http://localhost:7868/api/v1/run/314b9422-1529-48d7-9ba4-6115e287b156"

fetch('http://localhost:7868/api/v1/run/314b9422-1529-48d7-9ba4-6115e287b156'
  ,options)
  .then(response => {
    return response.json()
  })
  .then(response => {
    console.log(response)
  })
  .catch(err => {
    console.error(err)
  });

</script>

<!-- UI section -->

<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
