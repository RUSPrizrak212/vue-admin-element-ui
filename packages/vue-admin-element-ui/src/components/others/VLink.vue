<template>
    <a v-if="to.externalLink !== undefined" :target="to.toNewTab ? '_blank' : '_self'" :href="to.externalLink">
        <slot />
    </a>
    <router-link v-else :to="to">
        <slot />
    </router-link>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ExternalLink, XOR } from '@/types';

export default defineComponent({
    name: 'VLink',
    props: {
        to: {
            type: Object as PropType<XOR<{ name: string }, ExternalLink>>,
            required: true,
        },
    },
});
</script>
