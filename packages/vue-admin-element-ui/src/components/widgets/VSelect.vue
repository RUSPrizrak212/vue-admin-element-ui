<template>
    <el-config-provider :locale="$vueAdmin.getElLocale()">
        <div :class="$attrs.class" class="flex flex-col">
            <v-label v-if="label" :id="id" :value="label" :required="required" />

            <el-select
                :id="id"
                v-model="model"
                :class="{ 'has-error': hasError }"
                :placeholder="placeholder"
                :clearable="clearable"
                :filterable="filterable"
                :disabled="disabled"
                size="large"
                v-bind="props"
            >
                <el-option v-for="item in items" :key="item[valueId]" :label="item[valueName]" :value="item[valueId]" />
            </el-select>

            <div v-if="hasError" :id="`${id}-error`" class="mt-1 text-sm text-red-600">
                {{ error }}
            </div>
        </div>
    </el-config-provider>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ElConfigProvider, ElOption, ElSelect } from 'element-plus';
import VLabel from './VLabel.vue';
import 'element-plus/es/components/select/style/css';
import { IEntityForm } from '@/types';

export default defineComponent({
    name: 'VSelect',
    components: {
        ElConfigProvider,
        ElOption,
        ElSelect,
        VLabel,
    },
    inheritAttrs: false,
    props: {
        id: { type: String, required: true },
        items: { type: Array<any>, required: true },
        label: { type: String, default: '' },
        placeholder: { type: String, default: '' },
        props: { type: Object, default: undefined },
        clearable: { type: Boolean, default: false },
        filterable: { type: Boolean, default: false },
        required: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        valueId: { type: String, default: 'id' },
        valueName: { type: String, default: 'name' },
        entityForm: { type: Object as PropType<IEntityForm>, default: undefined },
        modelValue: { type: [Number, String], default: undefined },
        error: { type: String as PropType<string | null>, default: undefined },
    },
    emits: ['update:modelValue'],
    computed: {
        model: {
            get() {
                return this.modelValue;
            },
            set(value: number | string) {
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
