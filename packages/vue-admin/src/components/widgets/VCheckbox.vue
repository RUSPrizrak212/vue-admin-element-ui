<template>
    <div :class="$attrs.class">
        <label :for="id" class="flex items-center font-light text-gray-700 space-x-2" @click.stop>
            <input
                :id="id"
                v-model="model"
                type="checkbox"
                class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
            />
            <div>
                <div>{{ label }}</div>
                <div v-if="description" class="text-xs text-gray-500">
                    {{ description }}
                </div>
            </div>
        </label>
        <p v-if="hasError" :id="`${id}-error`" class="mt-1 text-sm text-red-600">
            {{ error }}
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IEntityForm } from '@/types';

export default defineComponent({
    name: 'VCheckbox',
    inheritAttrs: false,
    props: {
        id: { type: String, required: true },
        label: { type: String, default: '' },
        modelValue: { type: [String, Number, Boolean], required: true },
        description: { type: String, default: '', required: false },
        entityForm: { type: Object as PropType<IEntityForm>, default: undefined },
        error: { type: String as PropType<string | null>, default: undefined },
    },
    emits: ['update:modelValue'],
    computed: {
        model: {
            get() {
                return this.modelValue;
            },
            set(value: string | number | boolean) {
                this.entityForm?.errors().clear(this.id);
                this.$emit('update:modelValue', value);
            },
        },
        hasError() {
            return !!this.error;
        },
    },
});
</script>
