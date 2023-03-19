<script setup>
defineProps(['modelValue', 'title', 'iterate']);
defineEmits(['update:modelValue'])
</script>

<template>
  <fieldset class="flex flex-row flex-wrap gap-5 w-80 border-2 p-3 m-3">
    <legend class="px-3">{{ title }}</legend>
    <select class="w-full border" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
      <option v-for="line in iterate" :value="line.value">{{ line.name }}</option>
    </select>
  </fieldset>
</template>
