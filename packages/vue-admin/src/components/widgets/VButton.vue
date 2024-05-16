<template>
    <button
        :type="type"
        :title="title"
        :disabled="disabled || loading"
        class="inline-flex rounded focus:outline-none transition relative items-center justify-center space-x-2"
        :class="[colorButton, sizeButton]"
        @click="onClick"
    >
        <component :is="icon" v-if="icon && !loading" class="w-5" />
        <span v-if="!loading">
            <slot />
        </span>
        <loader v-if="loading" class="w-5" position="none" />
    </button>
</template>

<script lang="ts">
import { type Component, defineComponent, PropType } from 'vue';
import Loader from '../svg/Loader.vue';

export default defineComponent({
    name: 'VButton',
    components: { Loader },
    props: {
        type: { type: String as PropType<'button' | 'submit' | 'reset'>, default: 'button' },
        disabled: { type: Boolean, default: false },
        title: { type: String, default: '' },
        icon: [String, Function] as PropType<string | Component>,
        color: { type: String, default: '' },
        size: { type: String, default: 'md' },
        loading: { type: Boolean, default: false },
    },
    emits: ['click'],
    computed: {
        colorButton() {
            if (this.disabled) {
                return 'bg-gray-200 text-gray-400 cursor-not-allowed';
            }
            switch (this.color) {
                case 'white':
                    return 'border border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400';
                case 'indigo':
                    return 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200';
                case 'green':
                    return 'text-white bg-green-500 hover:bg-green-400';
                case 'yellow':
                    return 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200';
                case 'disabled':
                    return 'bg-gray-200 text-gray-300 cursor-auto';
                default:
                    return 'text-white bg-[#1fb6ff] hover:bg-[#009eeb]';
            }
        },
        sizeButton() {
            switch (this.size) {
                case 'md':
                    return 'px-4 py-2';
                case 'sm':
                    return 'px-3 py-2 text-sm';
                case 'xs':
                    return 'px-2.5 py-1.5 text-xs';
                default:
                    return 'px-6 py-3';
            }
        },
    },
    methods: {
        onClick() {
            if (!this.disabled) {
                this.$emit('click');
            }
        },
    },
});
</script>

<style lang="less" scoped>
button {
    svg.spinner {
        animation: rotate 2s linear infinite;

        circle {
            stroke-linecap: round;
            animation: dash 1.5s ease-in-out infinite;
        }
    }

    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes dash {
        0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
        }
        100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
        }
    }
}
</style>
