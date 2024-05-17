<template>
    <span
        class="relative truncate px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-0.5 max-w-[75px]"
        @mouseover="hovered = true"
        @mouseout="hovered = false"
    >
        {{ item[nameValue] }}
        <button
            v-if="clearButtonVisible"
            class="absolute right-0.5 bg-white rounded-full focus:outline-none text-gray-300 hover:text-gray-400"
            :class="{ hidden: !hovered }"
            type="button"
            @click.stop="onClear"
        >
            <x-circle-solid class="w-4" />
        </button>
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import XCircleSolid from '../svg/XCircleSolid.vue';

export default defineComponent({
    name: 'VFilterCheckboxBage',
    components: { XCircleSolid },
    props: {
        item: { type: Object as any, required: true },
        clearButtonVisible: { type: Boolean, required: true },
        nameValue: { type: String, default: 'name' },
    },
    emits: ['clear'],
    data() {
        return {
            hovered: false,
        };
    },
    methods: {
        onClear() {
            this.$emit('clear');
        },
    },
});
</script>
