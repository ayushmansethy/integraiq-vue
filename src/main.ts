import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {createRouter,createWebHashHistory} from 'vue-router'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import DiscoveryView from './views/DiscoveryView.vue'
import CreationView from './views/CreationView.vue'
import DocumentationView from './views/DocumentationView.vue'
import ArchitectureView from './views/ArchitectureView.vue'
import TemplatesView from './views/TemplatesView.vue'
import './assets/style.css'
const router=createRouter({history:createWebHashHistory(),routes:[{path:'/',component:HomeView},{path:'/discovery',component:DiscoveryView},{path:'/create',component:CreationView},{path:'/docs',component:DocumentationView},{path:'/architecture',component:ArchitectureView},{path:'/templates',component:TemplatesView}]})
createApp(App).use(createPinia()).use(router).mount('#app')
