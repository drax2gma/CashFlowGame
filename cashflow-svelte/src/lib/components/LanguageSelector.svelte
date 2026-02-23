<script lang="ts">
	import { locale } from '../i18n';
	import { onMount } from 'svelte';
	import Translate from './Translate.svelte';

	// Available languages
	const languages = [
		{ code: 'en', name: 'English' },
		{ code: 'hu', name: 'Magyar' } // Hungarian
	];

	// Set initial locale
	onMount(() => {
		// You can set the initial locale here based on user preferences
		// For now, we'll just use the default
	});

	function changeLanguage(code: string) {
		$locale = code;
	}
</script>

<div class="language-selector">
	<label for="language-select">
		<Translate key="settings.language" />
	</label>
	<select
		id="language-select"
		bind:value={$locale}
		on:change={(e) => changeLanguage(e.target.value)}
	>
		{#each languages as lang}
			<option value={lang.code}>{lang.name}</option>
		{/each}
	</select>
</div>

<style>
	.language-selector {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		background: var(--surface);
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	label {
		font-weight: 600;
		color: var(--on-surface);
	}

	select {
		padding: 0.5rem;
		border: 1px solid var(--outline);
		border-radius: 4px;
		background: var(--background);
		color: var(--on-background);
		font-size: 1rem;
	}

	select:focus {
		outline: 2px solid var(--primary);
		border-color: var(--primary);
	}
</style>
