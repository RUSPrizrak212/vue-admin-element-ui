<template>
    <div>
        <p class="text-left dark:text-gray-100 font-medium text-gray-700 leading-tight tracking-normal mb-2">
            {{ title }}
        </p>
        <div v-if="model" class="flex items-center gap-3 w-full">
            <span :class="{ 'mb-5': makeError(`${errorKey}.${fromField}`) }">
                {{ $vueAdmin.t('FROM') }}
            </span>
            <component
                :is="component"
                class="w-full"
                :error="makeError(`${errorKey}.${fromField}`)"
                :id="`from-${id}`"
                :type="type"
                v-model="model[fromField]"
                v-bind="bindingsFrom ?? bindings"
            />
            <span :class="{ 'mb-5': makeError(`${errorKey}.${toField}`) }">
                {{ $vueAdmin.t('TO') }}
            </span>
            <component
                :is="component"
                class="w-full"
                :error="makeError(`${errorKey}.${toField}`)"
                :id="`to-${id}`"
                :type="type"
                v-model="model[toField]"
                v-bind="bindingsTo ?? bindings"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { random } from 'lodash';
import { Map } from '@/types';
import VInput from '@/components/widgets/VInput.vue';

const model = defineModel<Map | undefined>({ required: true });

const props = withDefaults(
    defineProps<{
        title: string;
        fromField: string;
        toField: string;
        errorKey?: string;
        id?: string;
        type?: string;
        component?: any;
        errors?: Map;
        bindings?: Map;
        bindingsFrom?: Map;
        bindingsTo?: Map;
    }>(),
    {
        type: 'text',
        component: VInput,
        id: random(true).toString(),
    },
);

const makeError = (name: string): string | null => {
    let value: string = props.errors?.[name]?.[0]?.toString();

    if (value) {
        value = value.replaceAll(' ', '_');
        value = value.replaceAll(name, ' ');
        value = value.replaceAll('_', ' ');
    }

    return value;
};
</script>
