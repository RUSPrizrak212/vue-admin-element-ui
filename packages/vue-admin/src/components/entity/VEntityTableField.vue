<template>
    <span>{{ value }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'VEntityTableField',
    props: {
        value: { type: [String, Number], default: undefined },
    },
});
</script>
