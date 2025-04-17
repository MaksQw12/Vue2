import { createRouter, createWebHistory } from 'vue-router';
import Devices from '../pages/Devices.vue';
import Map from '../pages/Map.vue';
import Topology from '../pages/Topology.vue';

const routes = [
  { path: '/', name: 'Devices', component: Devices },
  { path: '/map', name: 'Map', component: Map },
  { path: '/topology', name: 'Topology', component: Topology },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
