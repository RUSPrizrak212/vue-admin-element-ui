<template>
    <label
        :for="id"
        class="text-left dark:text-gray-100 text-sm font-medium text-gray-700 leading-tight tracking-normal mb-2"
    >
        {{ value }} <span v-if="required">*</span>
    </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'VLabel',
    props: {
        required: { type: Boolean, default: false },
        value: { type: String, default: '' },
        id: { type: String, required: true },
    },
});
</script>
