<script setup>
import ConfigSelect from './components/CustomConfigSelect.vue'
import CustomButton from './components/CustomButton.vue';

import { reactive } from 'vue'
import axios from 'axios'

const joke = reactive({
  isLoading: true,
  isCompleteJoke: false,
  isSet: false,
  fatal: false,
  question: '',
  answer: '',
  id: '',
  error: '',
})

const type = reactive({
  selected: 'Any',
  types: {
    Any: {
      name: 'Any',
      value: 'Any',
    },
    Programming: {
      name: 'Programming',
      value: 'Programming',
    },
    Misc: {
      name: 'Misc',
      value: 'Misc',
    },
    Dark: {
      name: 'Dark',
      value: 'Dark',
    },
    Pun: {
      name: 'Pun',
      value: 'Pun',
    },
    Spooky: {
      name: 'Spooky',
      value: 'Spooky',
    },
    Christmas: {
      name: 'Christmas',
      value: 'Christmas',
    },
  },
})

const language = reactive({
  selected: 'en',
  languages: {
    en: {
      name: 'English',
      value: 'en',
    },
    es: {
      name: 'Spanish',
      value: 'es',
    },
    de: {
      name: 'German',
      value: 'de',
    },
    pt: {
      name: 'Portuguese',
      value: 'pt',
    },
    cs: {
      name: 'Czech',
      value: 'cs',
    },
    fr: {
      name: 'French',
      value: 'fr',
    },
  },
})

function getNewJoke() {
  joke.fatal = false
  axios.get(`https://v2.jokeapi.dev/joke/${type.selected}?lang=${language.selected}&type=twopart`)
    .then(res => {
      if (res.data.error) {
        type.selected = 'Any'
        language.selected = 'en'
        joke.error = res.data.message
        getNewJoke()
      }
      if (res.data.id === joke.id || res.data.id === undefined) {
        getNewJoke()
      } else {
        joke.question = res.data.setup
        joke.answer = res.data.delivery
        joke.id = res.data.id
        joke.isSet = true
        joke.isLoading = false
        joke.isCompleteJoke = false
      }
    })
    .catch(err => {
      console.log(err)
      if (err.code === 'ERR_BAD_REQUEST') {
        joke.error = `FATAL ERROR: ${err.response.data.additionalInfo}`
      }
      if (err.code === 'ERR_NETWORK') {
        joke.error = `FATAL ERROR: ${err.message}`
      }
      // joke.error = `FATAL ERROR: ${err}`
      joke.fatal = true
    })
}
getNewJoke()

function completeJoke() {
  joke.isCompleteJoke = true
}

function newJoke() {
  getNewJoke()
  joke.error = ''
  joke.isLoading = true
  joke.isSet = false
}

function getType(e) {
  joke.error = ''
  completeJoke()
  newJoke()
}

function getLanguage() {
  joke.error = ''
  completeJoke()
  newJoke()
}
</script>

<template>
  <div class="w-full flex flex-col justify-start gap-10 items-center py-3">
    <!-- ///////////////// Joke ///////////////// -->

    <div id="container" class="bg-gray-200 p-5 rounded w-80 h-auto flex flex-col gap-5">
      <div v-if="joke.error" class="bg-yellow-400 font-bold p-2 rounded self-start w-full">{{ joke.error }}</div>

      <div
        v-if="joke.isLoading && !joke.fatal"
        id="load"
        class="bg-blue-400 font-bold text-center p-7 rounded self-center w-full"
      >
        <div
          class="animate-spin inline-block w-8 h-8 border-4 border-black border-b-transparent rounded-full"
          role="status"
        >
          <span class="visually-hidden"></span>
        </div>
      </div>

      <div v-if="joke.isSet" id="question" class="bg-lime-400 font-bold p-2 rounded self-start max-w-3/4">
        {{ joke.question }}
      </div>
      <div
        v-if="joke.isCompleteJoke && joke.isSet"
        id="answer"
        class="bg-rose-400 font-bold p-2 rounded self-end text-right max-w-3/4"
      >
        {{ joke.answer }}
      </div>

      <CustomButton v-if="!joke.isCompleteJoke && !joke.fatal" @click="completeJoke">
        Tell me!
      </CustomButton>
        
      <CustomButton v-else v-if="!joke.fatal" @click="newJoke">
        New joke!
      </CustomButton>
    </div>

    <!-- ///////////////// Config ///////////////// -->

    <div v-if="!joke.fatal">

      <ConfigSelect v-model="language.selected" title="Language" :iterate="language.languages" @change="getLanguage" />
      <ConfigSelect v-model="type.selected" title="Type of joke" :iterate="type.types" @change="getType" />

    </div>
  </div>
</template>
