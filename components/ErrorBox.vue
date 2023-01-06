<script lang="ts" setup>
const props = defineProps<{
  error: unknown
}>()
</script>

<template>
  <div class="error-message">
    <p><strong>Error:</strong> {{ (error as Error).name }}</p>
    <details>
      <summary>Details</summary>
      <pre>{{ error }}</pre>
    </details>
  </div>
</template>

<style scoped>
.error-message {
  --border-radius: 8px;

  background-color: var(--background-alt);
  padding: 0.2em 1em;
  padding-left: calc(var(--border-radius) + 0.75em);
  margin: var(--border-radius) 0;
  border-radius: var(--border-radius);

  position: relative;
}

.error-message::after {
  content: '';
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;
  background-color: crimson;
  width: var(--border-radius);
  height: 100%;
  border-radius: var(--border-radius) 0 0 var(--border-radius);
}

.error-message details {
  border: solid 2px var(--background);
}
</style>
