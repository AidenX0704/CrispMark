import { createRouter, createWebHashHistory } from 'vue-router';
import MainWindow from '../views/main'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/main',
            name: 'main',
            component: MainWindow
        }
    ]
});

export default router;
