<script lang="ts">
  import { _ } from '../i18n';
  import { locale } from 'svelte-i18n';
  import { onMount } from 'svelte';

  export let key: string;
  export let values: Record<string, any> = {};

  let translated: string = '';

  $: translated = $_(key, values);

  // Update translation when locale changes
  $: $locale;
</script>

<span>{translated}</span>