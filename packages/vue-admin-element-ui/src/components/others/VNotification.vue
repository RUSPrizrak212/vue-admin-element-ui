<template>
    <transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div
            v-if="show"
            class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
        >
            <div class="p-4">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <check-circle v-if="alert.type === 'success'" class="h-6 w-6 text-green-400" />
                        <exclamation v-if="alert.type === 'warning'" class="h-6 w-6 text-yellow-400" />
                        <exclamation-circle-outline v-if="alert.type === 'danger'" class="h-6 w-6 text-red-400" />
                    </div>
                    <div class="ml-3 w-0 flex-1 pt-0.5">
                        <p class="text-sm font-medium text-gray-900">
                            {{ alert.title }}
                        </p>
                        <p class="mt-1 text-sm text-gray-500">
                            {{ alert.body }}
                        </p>
                    </div>
                    <div class="ml-4 flex-shrink-0 flex">
                        <button
                            class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            @click="closeNotification"
                        >
                            <span class="sr-only">{{ $vueAdmin.t('CLOSE') }}</span>
                            <cross class="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Cross from '../svg/Cross.vue';
import CheckCircle from '../svg/CheckCircle.vue';
import Exclamation from '../svg/Exclamation.vue';
import ExclamationCircleOutline from '../svg/ExclamationCircleOutline.vue';

export default defineComponent({
    name: 'VNotification',
    components: {
        ExclamationCircleOutline,
        Exclamation,
        CheckCircle,
        Cross,
    },
    props: {
        alert: { type: Object, required: true },
    },
    data() {
        return {
            show: false,
        };
    },
    mounted() {
        setTimeout(() => {
            this.show = true;
        }, 0);

        if (this.alert.timeout && this.alert.timeout > 0) {
            setTimeout(() => {
                this.closeNotification();
            }, this.alert.timeout);
        }
    },
    methods: {
        closeNotification() {
            this.show = false;
        },
    },
});
</script>
