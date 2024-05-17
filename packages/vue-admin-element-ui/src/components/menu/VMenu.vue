<template>
    <nav class="space-y-1 bg-white">
        <menu-item
            v-for="(item, key) in menuItems"
            :key="key"
            :title="item.title"
            :svg="item.svg"
            :to="item.to"
            :children="item.children"
            @menu-item-clicked="$emit('menuItemClicked')"
        />
    </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import MenuItem from './VMenuItem.vue';
import { MenuItem as MenuItemType } from '@/types';

export default defineComponent({
    name: 'VMenu',
    components: { MenuItem },
    props: {
        menuItems: { type: Array as PropType<MenuItemType[]>, required: true },
    },
});
</script>
