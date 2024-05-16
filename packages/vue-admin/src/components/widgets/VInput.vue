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

            <el-input
                :aria-describedby="`${id}-error`"
                :aria-invalid="hasError"
                :aria-labelledby="`${id}-label`"
                :autocomplete="autocomplete"
                :class="{ 'has-error': hasError }"
                :disabled="disabled"
                :id="id"
                :max="max"
                :maxlength="maxlength"
                :minlength="minlength"
                :min="min"
                :name="name ?? `${id}-name`"
                :placeholder="placeholder"
                :required="required"
                :size="size"
                :step="step"
                :type="type"
                @blur="onBlur"
                v-if="!multiline"
                v-model="model"
            />
            <el-input
                :aria-describedby="`${id}-error`"
                :aria-invalid="hasError"
                :aria-labelledby="`${id}-label`"
                :class="{ 'has-error': hasError }"
                :disabled="disabled"
                :id="id"
                :maxlength="maxlength"
                :minlength="minlength"
                :name="name ?? `${id}-name`"
                :placeholder="placeholder"
                :required="required"
                :rows="rows"
                @blur="onBlur"
                type="textarea"
                v-else
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
import { ElInput } from 'element-plus';
import VLabel from './VLabel.vue';
import 'element-plus/es/components/input/style/css';
import { IEntityForm } from '@/types';

export default defineComponent({
    name: 'VInput',
    components: { ElInput, VLabel },
    inheritAttrs: false,
    props: {
        addOn: { type: String, default: '' },
        autocomplete: { type: String, default: 'off' },
        description: { type: String, default: '' },
        disabled: { type: Boolean, default: false },
        error: { type: String as PropType<string | null>, default: undefined },
        entityForm: { type: Object as PropType<IEntityForm>, default: undefined },
        id: { type: String, required: true },
        label: { type: String, default: '' },
        max: { type: [String, Number], default: undefined },
        maxlength: { type: Number, default: 255 },
        minlength: { type: Number, default: 0 },
        min: { type: [String, Number], default: undefined },
        modelValue: { type: [String, Number], default: '' },
        multiline: { type: Boolean, default: false },
        name: { type: String, default: undefined },
        placeholder: { type: String, default: '' },
        required: { type: Boolean, default: false },
        rows: { type: [String, Number], default: 3 },
        size: { type: String as PropType<'' | 'default' | 'small' | 'large'>, default: 'large' },
        step: { type: [String, Number], default: undefined },
        type: { type: String, default: 'text' },
    },
    emits: ['update:modelValue', 'blur'],
    computed: {
        model: {
            get() {
                return this.modelValue;
            },
            set(value: string | number) {
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
