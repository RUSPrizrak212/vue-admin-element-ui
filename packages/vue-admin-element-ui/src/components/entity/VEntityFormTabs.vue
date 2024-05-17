<template>
    <div class="border-b border-gray-200">
        <nav class="-mb-px flex" aria-label="Tabs">
            <button
                v-for="(tab, index) in tabs"
                :key="tab.name"
                type="button"
                class="flex justify-center items-center space-x-1"
                :class="[
                    index === currentTab
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'w-full py-4 px-1 text-center border-b-2 font-medium text-sm',
                ]"
                @click="selectTab(index)"
            >
                <exclamation v-if="tabHasError.includes(index)" class="w-4 text-red-500 flex-shrink-0" />
                <span>{{ tab.name }}</span>
            </button>
        </nav>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Exclamation from '../svg/Exclamation.vue';
import Errors from '../../classes/Errors';

export default defineComponent({
    name: 'VEntityFormTabs',
    components: { Exclamation },
    props: {
        tabs: { type: Array<any>, required: true },
        errors: { type: Object as PropType<Errors>, required: true },
    },
    emits: ['select-tab'],
    data() {
        return {
            currentTab: 0,
        };
    },
    computed: {
        tabHasError() {
            const tabsWithError = [] as Array<any>;
            this.tabs.forEach((tab, index) => {
                tab.fields.forEach((field: any) => {
                    const multi = field?.multilingual || field.props?.multiselect;
                    const strict = typeof multi === 'boolean' ? !multi : true;
                    if (this.errors.has(field.key, strict)) {
                        tabsWithError.push(index);
                    }
                });
            });
            return tabsWithError;
        },
    },
    methods: {
        selectTab(index: number) {
            this.currentTab = index;
            this.$emit('select-tab', index);
        },
    },
});
</script>
