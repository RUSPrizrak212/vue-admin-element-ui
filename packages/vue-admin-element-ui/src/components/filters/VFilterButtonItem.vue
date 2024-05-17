<template>
    <div @wheel.prevent :class="{ 'relative z-30': suggestVisible }">
        <div
            class="bg-gray-100 fixed z-10 transition"
            :class="[{ 'inset-0': suggestVisible }, suggestVisible ? 'opacity-50' : 'opacity-0']"
            @click="hide"
        />
        <button
            class="relative z-20 inline-flex items-center max-w-2xl justify-center rounded-lg border border-gray-300 shadow-sm px-2 py-1 md:px-4 md:py-2 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none"
            type="button"
            @click="onClick"
        >
            <slot name="buttonText" />
            <button
                v-if="clearButtonVisible"
                class="focus:outline-none text-gray-300 hover:text-gray-500"
                type="button"
                @click.stop="onClear"
            >
                <x-circle-solid class="w-4" />
            </button>
        </button>
        <div
            v-if="suggestVisible"
            ref="suggest"
            :class="{ 'scroll-smooth': !isApple }"
            class="absolute bg-white z-20 mt-1 break-all shadow-lg transition overflow-y-auto overflow-x-hidden max-h-48 w-max max-w-xs"
            @wheel="onScroll"
        >
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import XCircleSolid from '../svg/XCircleSolid.vue';

export default defineComponent({
    name: 'VFilterButtonItem',
    components: { XCircleSolid },
    props: {
        clearButtonVisible: { type: Boolean, required: true },
    },
    emits: ['clear', 'hide', 'scrollEnd', 'buttonClick'],
    data() {
        return {
            suggestVisible: false,
            scrollTop: 0,
            scrollTimeout: 0,
        };
    },
    computed: {
        isApple() {
            return navigator.userAgent.includes('Macintosh');
        },
    },
    methods: {
        hide() {
            this.suggestVisible = false;
            this.$emit('hide');
        },
        onClear() {
            this.suggestVisible = false;
            this.$emit('clear');
            this.hide();
        },
        onScroll(event: WheelEvent) {
            const suggest = this.$refs['suggest'] as HTMLDivElement;
            const height = suggest.scrollHeight - suggest.clientHeight;

            this.scrollTop = Math.max(0, Math.min(height, this.scrollTop + event.deltaY));
            suggest.scrollTop = this.scrollTop;

            if (height <= this.scrollTop + 150 && event.deltaY > 0) {
                this.$emit('scrollEnd');
            }
        },
        onClick() {
            if (!this.suggestVisible) {
                this.$emit('buttonClick');
            }
            this.suggestVisible = true;
        },
    },
});
</script>
