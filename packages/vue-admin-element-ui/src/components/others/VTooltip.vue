<template>
    <div class="relative inline-block text-left" @mouseenter="dropDownVisible" @mouseleave="hover = false">
        <div>
            <slot />
            <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
            >
                <div
                    v-if="hover"
                    ref="dropdown"
                    :class="additionalClass"
                    class="origin-top-right absolute z-20 bg-gray-700 max-h-28 overflow-y-auto text-gray-200 text-xs px-4 py-2 rounded"
                >
                    <div class="py-1 flex flex-col items-center">
                        <span v-for="(item, key) in textArr" :key="key" class="whitespace-nowrap">
                            {{ item }}
                        </span>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'VTooltip',
    props: {
        additionalClass: {
            type: String,
            default: '',
        },
        textArr: {
            type: Array,
            default: undefined,
        },
    },
    data() {
        return {
            hover: false,
        };
    },
    methods: {
        dropDownVisible() {
            this.hover = true;
            this.$nextTick(() => {
                this.$vueAdminHelper.bottomIsOutOfSight(this.$refs.dropdown);
            });
        },
    },
});
</script>
