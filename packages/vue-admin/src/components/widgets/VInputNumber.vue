<template>
    <div v-cloak :class="$attrs.class" class="flex flex-col relative">
        <v-label v-if="label" :id="id" :value="label" :required="required" />
        <div class="flex rounded-md shadow-sm">
            <span
                v-if="addOn"
                class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                :class="
                    hasError
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                "
            >
                {{ addOn }}
            </span>

            <el-input-number
                :aria-describedby="`${id}-error`"
                :aria-invalid="hasError"
                :aria-labelledby="`${id}-label`"
                :class="{ 'has-error': hasError }"
                :controls-position="controlsPosition"
                :controls="controls"
                :disabled="disabled"
                :id="id"
                :max="max"
                :min="min"
                :name="name ?? `${id}-name`"
                :placeholder="placeholder"
                :required="required"
                :size="size"
                :step="step"
                :step-strictly="stepStrictly"
                @blur="onBlur"
                v-model="model"
            />
        </div>
        <p v-if="description" :id="`${id}-description`" class="mt-1 text-xs text-gray-500">
            {{ description }}
        </p>
        <p v-if="hasError" :id="`${id}-error`" class="mt-1 text-sm text-red-600">
            {{ error }}
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ElInputNumber } from 'element-plus';
import VLabel from './VLabel.vue';
import 'element-plus/es/components/input-number/style/css';
import { IEntityForm } from '@/types';

export default defineComponent({
    name: 'VInputNumber',
    components: { ElInputNumber, VLabel },
    inheritAttrs: false,
    props: {
        addOn: { type: String, default: '' },
        controls: { type: Boolean, default: true },
        controlsPosition: { type: String as PropType<'' | 'right'>, default: 'right' },
        description: { type: String, default: '' },
        disabled: { type: Boolean, default: false },
        error: { type: String as PropType<string | null>, default: undefined },
        entityForm: { type: Object as PropType<IEntityForm>, default: undefined },
        id: { type: String, required: true },
        label: { type: String, default: '' },
        max: { type: Number, default: undefined },
        min: { type: Number, default: undefined },
        modelValue: { type: Number, default: undefined },
        name: { type: String, default: undefined },
        placeholder: { type: String, default: '' },
        required: { type: Boolean, default: false },
        size: { type: String as PropType<'' | 'default' | 'small' | 'large'>, default: 'large' },
        step: { type: Number, default: undefined },
        stepStrictly: { type: Boolean, default: true },
    },
    emits: ['update:modelValue', 'blur'],
    computed: {
        model: {
            get() {
                return this.modelValue;
            },
            set(value: number) {
                this.entityForm?.errors().clear(this.id);
                this.$emit('update:modelValue', value);
            },
        },
        hasError() {
            return !!this.error;
        },
    },
    methods: {
        onBlur() {
            this.$emit('blur', this.id);
        },
    },
});
</script>
