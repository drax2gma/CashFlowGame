<script lang="ts">
  import { _ } from '../i18n';

  export let key: string;
  export let values: Record<string, any> = {};

  $: translated = $_(key, { values }) || key;
</script>

<span>{translated}</span>