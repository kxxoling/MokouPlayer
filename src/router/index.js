import Vue from 'vue';
import Router from 'vue-router';
import MokouPlayer from 'components/MokouPlayer';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MokouPlayer',
      component: MokouPlayer,
    },
  ],
});
