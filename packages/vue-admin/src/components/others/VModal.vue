<template>
    <div
        class="fixed inset-0 z-30 bg-gray-200 p-10 bg-opacity-30 flex justify-center items-start transition overflow-y-scroll"
    >
        <div :class="modalClasses" class="bg-white w-full flex flex-col items-center shadow-md rounded-md">
            <div
                class="px-4 py-2 flex justify-between items-center rounded-t-md font-light text-gray-100 bg-gray-600 text-l w-full"
            >
                <span>{{ title }}</span>
                <span class="cursor-pointer group" @click="$emit('close')">
                    <cross class="w-4 text-gray-100 hover:text-gray-50" />
                </span>
            </div>
            <div :class="bodyClass" class="pt-4 pb-6 px-8 w-full h-full">
                <slot />

                <div v-if="confirmButtons" class="flex space-x-2 pt-7" :class="positionClass">
                    <v-button color="white" size="sm" @click="$emit('close')">
                        {{ $vueAdmin.t('CANCEL') }}
                    </v-button>
                    <v-button :loading="loading" size="sm" @click="$emit('confirm')" :disabled="confirmButtonDisabled">
                        {{ localConfirmButtonText }}
                    </v-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Cross from '../svg/Cross.vue';
import VButton from '../widgets/VButton.vue';

export default defineComponent({
    name: 'VModal',
    components: { Cross, VButton },
    props: {
        title: { type: String, default: '' },
        size: { type: String, default: 'normal' },
        confirmButtons: { type: Boolean, default: false },
        confirmButtonText: { type: String, default: undefined },
        buttonsPosition: { type: String, default: 'center' },
        loading: { type: Boolean, default: false },
        confirmButtonDisabled: { type: Boolean, default: false },
        bodyClass: { type: String, default: undefined },
    },
    emits: ['close', 'confirm'],
    data() {
        return {
            localConfirmButtonText: this.confirmButtonText ?? this.$vueAdmin.t('ACCEPT'),
        };
    },
    computed: {
        positionClass() {
            if (this.buttonsPosition === 'left') {
                return 'justify-start';
            }
            if (this.buttonsPosition === 'right') {
                return 'justify-end';
            }
            return 'justify-center';
        },
        modalClasses() {
            const values = [] as Array<string>;

            if (this.size === 'normal') {
                values.push('lg:w-1/2');
            }
            if (this.size === 'content') {
                values.push('max-w-max');
            }

            return values;
        },
    },
});
</script>
