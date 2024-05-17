<template>
    <div class="space-y-1">
        <button
            v-if="children"
            class="bg-white text-gray-600 space-x-1 hover:bg-gray-50 hover:text-gray-900 group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-controls="sub-menu-1"
            aria-expanded="false"
            @click="childVisible = !childVisible"
        >
            <component v-if="svg" :is="svg" class="w-4" />
            <span class="flex-1">
                {{ title }}
            </span>
            <chevron-right-icon
                :class="[
                    childVisible ? 'text-gray-400 rotate-90' : 'text-gray-300',
                    'ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150',
                ]"
            />
        </button>
        <v-link
            v-else
            class="bg-white text-gray-600 space-x-1 hover:bg-gray-50 hover:text-gray-900 group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-controls="sub-menu-1"
            aria-expanded="false"
            :to="to!"
            @click="$emit('menuItemClicked')"
        >
            <component v-if="svg" :is="svg" class="w-4" />
            <span class="flex-1">
                {{ title }}
            </span>
        </v-link>

        <div v-if="childVisible" id="sub-menu-1" class="space-y-1">
            <v-link
                v-for="child in children"
                :key="child.to?.name"
                :to="child.to!"
                class="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                @click="$emit('menuItemClicked')"
            >
                {{ child.title }}
            </v-link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ChevronRightIcon } from '@heroicons/vue/20/solid';
import VLink from '../others/VLink.vue';
import { MenuItem } from '@/types';

const childVisible = ref<boolean>(false);
defineProps<MenuItem>();
</script>

<style lang="less" scoped>
a.active {
    @apply text-gray-900 bg-gray-50;
}
</style>
