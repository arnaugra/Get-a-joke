<script setup>
import { reactive } from 'vue';

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
    Any: 'Any',
    Programming: 'Programming',
    Misc: 'Misc',
    Dark: 'Dark',
    Pun: 'Pun',
    Spooky: 'Spooky',
    Christmas: 'Christmas',
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
  fetch(`https://v2.jokeapi.dev/joke/${type.selected}?lang=${language.selected}&type=twopart`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        type.selected = 'Any'
        language.selected = 'en'
        joke.error = data.message
        getNewJoke()
      }
      if (data.id === joke.id || data.id === undefined) {
        getNewJoke()
      } else {
        joke.question = data.setup
        joke.answer = data.delivery
        joke.id = data.id
        joke.isSet = true
        joke.isLoading = false
        joke.isCompleteJoke = false
      }
    })
    .catch(err => {
      joke.error = `FATAL ERROR:\n${err}\ncheck if api doesn't work anymore`
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
  <div class="w-full h-90vh flex flex-col justify-start gap-10 items-center p-3">
    <!-- ///////////////// Title ///////////////// -->

    <div>
      <h1 class="text-3xl font-bold">Get a joke</h1>
      <p class="">By <a href="#" class="text-lg text-gray-500 font-medium">arnaugra</a></p>
    </div>

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

      <button
        v-if="!joke.isCompleteJoke && !joke.fatal"
        class="w-full bg-orange-400 font-bold rounded"
        @click="completeJoke"
      >
        Tell me!
      </button>
      <button v-else v-if="!joke.fatal" class="w-full bg-orange-400 font-bold rounded" @click="newJoke">
        New joke!
      </button>
    </div>

    <!-- ///////////////// Config ///////////////// -->

    <div v-if="!joke.fatal">
      <fieldset class="flex flex-row flex-wrap gap-5 m-auto w-80 border-2 p-3">
        <legend class="px-3">Type</legend>
        <select class="w-full border" v-model="type.selected" @change="getType">
          <option v-for="line in type.types" :value="line">{{ line }}</option>
        </select>
      </fieldset>

      <fieldset class="flex flex-row flex-wrap gap-5 m-auto w-80 border-2 p-3">
        <legend class="px-3">Language</legend>
        <select class="w-full border" @change="getLanguage" v-model="language.selected">
          <option v-for="line in language.languages" :value="line.value">{{ line.name }}</option>
        </select>
      </fieldset>
    </div>
  </div>
  
  <ConfigSelect />
</template>
