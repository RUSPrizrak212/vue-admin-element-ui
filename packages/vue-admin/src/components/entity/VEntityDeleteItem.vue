<template>
    <trash
        class="w-5 h-5 ml-auto cursor-pointer text-indigo-500 hover:text-indigo-600"
        @click="deleteItemConfirmVisible = true"
    />
    <v-modal
        v-if="deleteItemConfirmVisible"
        :title="$vueAdmin.t('CONFIRM')"
        confirm-buttons
        :loading="loading"
        @close="deleteItemConfirmVisible = false"
        @confirm="deleteItem"
    >
        <span class="text-gray-500">
            {{ $vueAdmin.t('CONFIRM_DELETE', { name: item.name }) }}
        </span>
    </v-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Trash from '../svg/Trash.vue';
import VModal from '../others/VModal.vue';
import { IEntityController } from '@/types';

export default defineComponent({
    name: 'VEntityDeleteItem',
    components: { Trash, VModal },
    props: {
        item: { type: Object as any, required: true },
        controller: {
            type: Object as PropType<IEntityController>,
            required: true,
        },
    },
    data() {
        return {
            loading: false,
            deleteItemConfirmVisible: false,
        };
    },
    methods: {
        async deleteItem() {
            this.loading = true;

            this.controller.form()?.deleteItem(this.item.id).then(() => {
                this.deleteItemConfirmVisible = false;
            }).finally(() => {
                this.loading = false;
            });
        },
    },
});
</script>
