// export default router;
import { createRouter, createWebHistory } from 'vue-router';
import BeforeLoginMain from '@/components/BeforeLogin/BeforeLoginMain.vue';
import SignupPage from '@/components/BeforeLogin/SignupPage.vue';
import AfterLoginMain from '@/components/AfterLogin/Layouts/AfterLoginMain.vue';
import SettingsMain from '@/components/AfterLogin/Account/SettingsMain.vue';
import ProfileMain from '@/components/AfterLogin/Profile/ProfileMain.vue';
import KakaoMaps from '@/components/AfterLogin/maps/KakaoMaps.vue';
import MainPage from '@/components/AfterLogin/main/MainPage.vue';

import testProfile from '@/components/AfterLogin/SettingProfile/TestProfile.vue';

import RegisterReceipt from '@/components/AfterLogin/Profile/RegisterReceipt.vue';

import setProfile from './setProfile';

import AddressSetting from '@/components/AfterLogin/Account/AddressSetting.vue';
import AddAddressPage from '@/components/AfterLogin/Account/AddAddressPage.vue';
import AddressSearchPage from '@/components/AfterLogin/Account/AddressSearchPage.vue';

import SettingTemplate from '@/components/AfterLogin/Account/SettingTemplate.vue';
import CurrentHealth from '@/components/AfterLogin/Profile/CurrentHealth.vue';

import RegisterDisease from '@/components/AfterLogin/Profile/RegisterDisease.vue';
import ExtraMedical from '@/components/AfterLogin/Profile/ExtraMedical.vue';

import ProdutsMain from '@/components/AfterLogin/Products/ProdutsMain.vue';

import ProductDetails from '@/components/AfterLogin/Products/ProductDetails.vue';
import ShoppingOrder from '@/components/AfterLogin/Products/ShoppingOrder.vue';

const isLoggedIn = () => {
    return !!localStorage.getItem('token');
};

const routes = [
    {
        path: '/',
        name: 'BeforeLoginMain',
        component: BeforeLoginMain,
    },
    {
        path: '/main',
        name: 'AfterLoginMain',
        component: AfterLoginMain,
        beforeEnter: (to, from, next) => {
            if (isLoggedIn()) {
                next();
            } else {
                next('/');
            }
        },
        children: [
            {
                path: '',
                name: 'MainPage',
                component: MainPage,
            },
            {
                path: 'profile',
                name: 'ProfileMainPage',
                component: ProfileMain,
            },
            {
                path: 'settings',
                name: 'SettingsPage',
                component: SettingsMain,
            },
            {
                path: 'upload_receipt',
                name: 'RegisterReceiptPage',
                component: RegisterReceipt,
            },
            {
                path: 'testProfile',
                name: 'testProfile',
                component: testProfile,
            },
        ],
    },
    {
        path: '/address-setting',
        name: 'AddressSettingPage',
        component: SettingTemplate,
        beforeEnter: (to, from, next) => {
            if (isLoggedIn()) {
                next();
            } else {
                next('/');
            }
        },
        children: [
            {
                path: '',
                name: 'AddressSettingMain',
                component: AddressSetting,
            },
            {
                path: 'add',
                name: 'AddAddressPage',
                component: AddAddressPage,
            },
            {
                path: 'search',
                name: 'AddressSearchPage',
                component: AddressSearchPage, // 실제 주소 검색 화면 컴포넌트
            },
            {
                path: '/signup',
                name: 'SignupPage',
                component: SignupPage,
            },
        ],
    },

    {
        path: '/signup',
        name: 'SignupPage',
        component: SignupPage,
    },
    {
        path: '/main/maps',
        name: 'MapsPage',
        component: KakaoMaps,
    },
    {
        path: '/main/upload_receipt',
        name: 'RegisterReceiptPage',
        component: RegisterReceipt,
    },
    {
        path: '/main/profile/current-health', // 'profile'의 하위 경로로 추가
        name: 'CurrentHealthPage',
        component: CurrentHealth,
    },
    {
        path: '/main/upload_receipt/disease',
        name: 'RegisterDiseasePage',
        component: RegisterDisease,
    },
    {
        path: '/main/upload_receipt/disease/extra',
        name: 'ExtraMedicalPage',
        component: ExtraMedical,
    },
    {
        path: '/products/:type',
        name: 'ProductPage',
        component: ProdutsMain,
    },
    {
        path: '/products/personalized/:type', // 맞춤형 상품 페이지 추가
        name: 'PersonalizedProductPage',
        component: ProdutsMain, // 동일한 컴포넌트를 사용
    },
    {
        path: '/product/:id',
        name: 'ProductDetails',
        component: ProductDetails,
        props: true, // 경로 파라미터를 props로 전달
    },
    {
        path: '/product/order',
        name: 'ShoppingOrder',
        component: ShoppingOrder,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes: [...routes, ...setProfile],
});

export default router;
