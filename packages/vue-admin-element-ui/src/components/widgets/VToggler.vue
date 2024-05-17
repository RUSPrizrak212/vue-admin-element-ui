<template>
    <div>
        <div class="wrapper px-1.5 relative inline-block rounded-lg border border-gray-300 shadow-sm bg-white">
            <div :style="style" />
            <div>
                <template v-for="(option, index) in options" :key="option[optionValue]">
                    <input
                        :id="`${id}-option-${option[optionValue]}`"
                        v-model="model"
                        type="radio"
                        :value="option[optionValue]"
                    />
                    <label
                        :id="`${id}-option-${option[optionValue]}-label`"
                        :for="`${id}-option-${option[optionValue]}`"
                        class="text-sm font-light my-1 p-1 sm:px-3 rounded-lg text-gray-500 hover:text-white hover:bg-[#85d7ff] 2 hover:sm:px-3 transition duration-150 ease-in-out"
                        :class="{ 'mr-1': index !== options.length - 1, 'cursor-pointer': options.length > 1 }"
                    >
                        {{ option[optionDisplay] }}
                    </label>
                </template>
            </div>
        </div>

        <p v-if="hasError" :id="`${id}-error`" class="mt-1 text-sm text-red-600">
            {{ error }}
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IEntityForm } from '@/types';

export default defineComponent({
    name: 'VToggler',
    props: {
        id: { type: String, required: true },
        options: { type: Array<any>, required: true },
        optionDisplay: { type: String, default: 'name' },
        optionValue: { type: String, default: 'id' },
        modelValue: { type: [String, Number, Boolean], default: undefined },
        entityForm: { type: Object as PropType<IEntityForm>, default: undefined },
        error: { type: String as PropType<string | null>, default: undefined },
    },
    emits: ['update:modelValue'],
    data() {
        return {
            mounted: false,
        };
    },
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
        style() {
            if (!this.mounted) {
                return {};
            }

            const el = document.querySelector(`#${this.id}-option-${this.model}-label`) as any;

            if (el === null) {
                return {};
            }

            return {
                transform: `translate(${el.offsetLeft}px)`,
                width: `${el.clientWidth}px`,
            };
        },
        hasError() {
            return !!this.error;
        },
    },
    mounted() {
        this.mounted = true;
    },
});
</script>

<style lang="less" scoped>
.wrapper {
    input[type='radio'] {
        @apply hidden;

        &:checked + label {
            @apply text-white;

            &:hover {
                @apply bg-transparent text-white;
            }
        }
    }

    div:first-child {
        @apply absolute bg-[#1fb6ff] rounded-lg inset-y-0 my-1 transition-all duration-150 ease-in-out;
    }

    div:last-child {
        @apply relative flex items-center bg-transparent;
    }
}
</style>
