<template>
  <div>
      <v-list-item v-if="isVisible" class="v-list-item v-list-item--link theme--light grey--text text--lighten-4">
        <v-list-item-title>
            <router-link
                exact-active-class="text-success"
                :to="{name: route.name}"
                class="nav-link"
            >{{name}}</router-link>
        </v-list-item-title>
      </v-list-item>
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

<style scoped>
.v-list-item{
  padding: 0;
}

.v-list-item__title {
    align-items: center;
    align-self: center;
    display: flex;
    flex-wrap: wrap;
    flex: 1 1;
    overflow: hidden;
}
.v-application a {
  padding: 12px 16px;
  color: #000;
  text-decoration: none;
  flex: 1 1 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>