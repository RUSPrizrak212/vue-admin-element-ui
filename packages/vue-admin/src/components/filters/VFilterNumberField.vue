<template>
    <div
        class="inline-flex items-center justify-center rounded-lg border border-gray-300 shadow-sm px-2 py-1 md:px-4 md:py-2 bg-white text-sm hover:bg-gray-50 space-x-2"
    >
        <span class="text-gray-500 font-light">{{ title }}: </span>
        <input
            :id="id"
            v-model="model"
            type="number"
            class="bg-transparent focus:outline-none w-14 text-gray-900 font-medium"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'VFilterNumberField',
    props: {
        modelValue: { type: Number, default: 0 },
        id: { type: String, required: true },
        title: { type: String, required: true },
    },
    emits: ['update:modelValue'],
    computed: {
        model: {
            get() {
                return this.modelValue;
            },
            set(value: number) {
                this.$emit('update:modelValue', value);
            },
        },
    },
});
</script>
