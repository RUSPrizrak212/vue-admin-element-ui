<template>
    <div>
        <nav class="-mb-px flex" aria-label="Tabs">
            <button
                v-for="tab in tabs"
                :key="tab.name"
                type="button"
                class="flex justify-center items-center space-x-1"
                :class="[
                    tab.name === current ? 'bg-white rounded-t text-indigo-600' : 'text-gray-500 hover:text-gray-700',
                    'py-4 px-4 text-center font-medium text-sm',
                ]"
                @click="select(tab.name)"
            >
                <span>{{ tab.title }}</span>
            </button>
        </nav>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'VTabNavigation',
    props: {
        tabs: { type: Array<any>, required: true },
        current: { type: String, required: true },
    },
    emits: ['update:modelValue'],
    methods: {
        select(tab: any) {
            this.$emit('update:modelValue', tab);
        },
    },
});
</script>
