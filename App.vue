<template>
  <component :is="layout" />
</template>

<script lang="ts">
import { Vue, Options, Watch } from 'vue-property-decorator';
import { markRaw } from 'vue';
import Default from '@/components/Layouts/Default.vue';

@Options({})
export default class App extends Vue {
  layout: any = false;
  $route: any;

  created() {
    this.load();
  }

  @Watch('$route')
  async load() {
    try {
      const layout = this.$route?.meta?.layout;

      if (this.$route.matched.length === 0) {
        return false;
      }

      if (!layout) {
        this.layout = markRaw(Default);

        return;
      }

      this.layout = markRaw((await import(`./components/Layouts/${layout}.vue`))?.default || Default);
    } catch (e) {
      this.layout = markRaw(Default);
    }
  }
}
</script>
