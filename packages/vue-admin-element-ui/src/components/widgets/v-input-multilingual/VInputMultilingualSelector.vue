<template>
    <div v-click-away="dropDownHide" class="relative inline-block text-left">
        <div>
            <button
                id="menu-button"
                type="button"
                class="focus:outline-none text-xs pointer text-indigo-500 hover:text-indigo-600"
                @click="dropDownShow"
            >
                {{ placeholder }}
            </button>
        </div>

        <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
            <div
                v-if="dropDownVisible"
                ref="dropdown_select"
                class="origin-top-right absolute left-0 mt-2 w-56 max-h-44 overflow-y-auto rounded-md shadow-lg z-20 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
                <div class="flex flex-col">
                    <slot :hiddenDropDown="dropDownHide" />
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'VInputMultilingualSelector',
    props: {
        placeholder: { type: String, required: true },
    },
    data() {
        return {
            dropDownVisible: false,
        };
    },
    methods: {
        dropDownShow() {
            this.dropDownVisible = !this.dropDownVisible;
            if (this.dropDownVisible) {
                this.$nextTick(() => {
                    this.$vueAdminHelper.bottomIsOutOfSight(this.$refs.dropdown_select);
                });
            }
        },
        dropDownHide() {
            this.dropDownVisible = false;
        },
    },
});
</script>
