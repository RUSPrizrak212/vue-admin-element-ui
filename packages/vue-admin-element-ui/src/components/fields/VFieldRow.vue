<template>
    <div v-if="!!$slots.default" class="grid grid-cols-2 items-center">
        <div class="p-2 text-gray-600 font-normal">
            {{ label }}
        </div>
        <div class="p-2 font-light text-gray-700 overflow-x-auto">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'VFieldRow',
    props: {
        label: { type: String, required: true },
    },
});
</script>
