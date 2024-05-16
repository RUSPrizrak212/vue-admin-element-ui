<template>
    <filter-button-item
        ref="filter-button"
        @scroll-end="$emit('scrollEnd')"
        :clear-button-visible="clearButtonVisible"
        @clear="onClear"
        @hide="onHide"
        @button-click="$emit('buttonClick')"
    >
        <template #buttonText>
            <span class="text-gray-500 mr-1 font-light whitespace-nowrap">{{ title }}</span>
            <filter-checkbox-bage
                v-for="(item, index) in selected.slice(0, 2)"
                :key="index"
                :item="item"
                :clear-button-visible="clearButtonVisible"
                :name-value="nameValue"
                @clear="onClear(index)"
            />
            <filter-checkbox-bage
                v-if="selected.length > 2"
                :clear-button-visible="false"
                :item="{ name: `+ ${selected.length - 2}` }"
            />
        </template>
        <slot />
    </filter-button-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FilterButtonItem from './VFilterButtonItem.vue';
import FilterCheckboxBage from './VFilterCheckboxBage.vue';

export default defineComponent({
    name: 'VFilterCheckboxItem',
    components: { FilterCheckboxBage, FilterButtonItem },
    props: {
        title: { type: String, required: true },
        selected: { type: Array<any>, default: () => [] },
        nameValue: { type: String, default: 'name' },
    },
    emits: ['clear', 'hide', 'scrollEnd', 'buttonClick'],
    computed: {
        clearButtonVisible() {
            if (!this.selected) {
                return false;
            }
            return this.selected?.length > 0 || Object.keys(this.selected)?.length > 0;
        },
    },
    methods: {
        onClear(item: number) {
            this.$emit('clear', item);
        },
        onHide() {
            this.$emit('hide');
        },
    },
});
</script>
