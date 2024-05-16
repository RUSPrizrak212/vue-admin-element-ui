<template>
    <svg
        :class="classes"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        display="block"
    >
        <circle
            cx="50"
            cy="50"
            fill="none"
            stroke="currentColor"
            stroke-width="10"
            r="40"
            stroke-dasharray="188.49555921538757 64.83185307179586"
            transform="rotate(286.862 50 50)"
        >
            <animateTransform
                attributeName="transform"
                type="rotate"
                repeatCount="indefinite"
                dur="1s"
                values="0 50 50;360 50 50"
                keyTimes="0;1"
            />
        </circle>
    </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Loader',
    props: {
        position: {
            type: String,
            default: 'center-screen',
            validator(value: string) {
                return ['none', 'center-screen', 'center-relative'].includes(value);
            },
        },
    },
    computed: {
        classes() {
            let value = '';
            if (this.position === 'center-screen') {
                value += 'absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2';
            } else if (this.position === 'center-relative') {
                value += 'relative left-1/2 top-1/2 transform -translate-x-1/2';
            }
            return value;
        },
    },
});
</script>
