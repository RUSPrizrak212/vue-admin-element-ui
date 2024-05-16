<template>
    <div class="space-y-2 flex flex-col col-span-2">
        <h3 class="text-sm font-medium text-gray-700 leading-tight tracking-normal">
            {{ label }}
        </h3>
        <div class="grid grid-cols-2 gap-2">
            <div v-for="(item, index) in items" :key="item">
                <v-checkbox
                    :id="`${id}_${index}`"
                    :model-value="selected.includes(item.id)"
                    :label="item.title ?? item.name"
                    class="flex-grow"
                    @update:model-value="onInput($event, item.id)"
                />
            </div>
        </div>
        <p v-if="hasError" :id="`${id}-error`" class="mt-1 text-sm text-red-600">
            {{ error }}
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import VCheckbox from './VCheckbox.vue';
import { IEntityForm } from '@/types';

export default defineComponent({
    name: 'VCheckboxes',
    components: { VCheckbox },
    props: {
        label: { type: String, required: true },
        id: { type: String, required: true },
        items: { type: Array<any>, required: true },
        modelValue: { type: Array, default: undefined },
        entityForm: { type: Object as PropType<IEntityForm>, default: undefined },
        error: { type: String as PropType<string | null>, default: undefined },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            selected: [] as Array<any>,
        };
    },
    computed: {
        hasError() {
            return !!this.error;
        },
    },
    watch: {
        modelValue: {
            immediate: true,
            handler() {
                this.selected = [];
                if (this.modelValue) {
                    this.selected = this.modelValue;
                }
            },
        },
    },
    methods: {
        onInput(isChecked: boolean, id: string) {
            this.entityForm?.errors().clear(this.id);

            if (isChecked && !this.selected.includes(id)) {
                this.selected.push(id);
            }
            if (!isChecked && this.selected.includes(id)) {
                const index = this.selected.indexOf(id);
                this.selected.splice(index, 1);
            }

            this.$emit('update:modelValue', this.selected);
        },
    },
});
</script>
