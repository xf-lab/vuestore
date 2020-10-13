<template>
  <div>
        <v-list-item-title v-if="isVisible">
            <router-link
                exact-active-class="text-success"
                :to="{name: route.name}"
                class="nav-link"
            >{{name}}</router-link>
        </v-list-item-title>
  </div>
</template>

<script>
export default {
  name: "menu-item",
  props: {
    route: {
      type: Object
    }
  },
  computed: {
    isVisible() {
      if (
        this.route.meta &&
        (this.route.meta.visible === undefined || this.route.meta.visible)
      ) {
        return true;
      }
      return false;
    },
    name() {
      return this.route.name
        .toLowerCase()
        .split("-")
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
    }
  }
};
</script>