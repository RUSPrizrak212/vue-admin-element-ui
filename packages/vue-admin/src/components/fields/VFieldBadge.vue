<template>
    <div class="flex space-x-2">
        <component :is="value.icon" v-if="value.icon" class="flex-none w-5 text-gray-500" />
        <div>
            <div>{{ value.name }}</div>
            <div v-if="value.description" class="text-xs text-gray-500">
                {{ value.description }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'VFieldBadge',
    inheritAttrs: false,
    props: {
        value: { type: Object, required: true },
    },
});
</script>
