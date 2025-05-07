// import AfterLoginMain from '@/components/AfterLogin/Layouts/AfterLoginMain.vue';

import OrderList from '@/components/AfterLogin/SettingProfile/OrderList.vue';
import setProfile1 from '@/components/AfterLogin/SettingProfile/ProfileSetting1.vue';
import setProfile2 from '@/components/AfterLogin/SettingProfile/ProfileSetting2.vue';
import setProfile3 from '@/components/AfterLogin/SettingProfile/ProfileSetting3.vue';
import setProfile4 from '@/components/AfterLogin/SettingProfile/ProfileSetting4.vue';
import ProtoType from '@/components/AfterLogin/SettingProfile/ProtoType.vue';
import orderListDetail from '@/components/AfterLogin/SettingProfile/OrderListDetail.vue';

import UserInfoPage from '@/components/AfterLogin/SettingProfile/UserInfoPage.vue';

import { useDiseaseStore } from '@/stores/profileDiseaseStore'; // 스토어 import

// const isLoggedIn = () => {
//     return !!localStorage.getItem('token');
// };

const pageroutes = [
    {
        path: '/userinfo', // 사용자 정보 페이지 경로
        name: 'UserInfo',
        component: UserInfoPage, // 사용자 정보 페이지 컴포넌트
    },
    {
        path: '/setProfile',
        name: 'setProfilePage',
        component: ProtoType,
        // path: '/main',
        // name: 'AfterLoginMain',
        // component: AfterLoginMain,
        // beforeEnter: (to, from, next) => {
        //     if (isLoggedIn()) {
        //         next();
        //     } else {
        //         next('/');
        //     }
        // },
        children: [
            {
                path: '1',
                name: 'setProfilePage1',
                component: setProfile1,
            },
            {
                path: '2',
                name: 'setProfilePage2',
                component: setProfile2,
            },
            {
                path: '3',
                name: 'setProfilePage3',
                component: setProfile3,
            },
            {
                path: '4',
                name: 'setProfilePage4',
                component: setProfile4,
                beforeEnter: (to, from, next) => {
                    const diseaseStore = useDiseaseStore();
                    if (diseaseStore.isDisease.length === 0) {
                        alert('반려동물 부위를 선택해야 합니다!');
                        next(false); // 이동을 막음
                    } else {
                        next(); // 이동 허용
                    }
                },
            },
        ],
    },
    {
        path: '/orderList', // 사용자 정보 페이지 경로
        name: 'orderList',
        component: OrderList, // 사용자 정보 페이지 컴포넌트
    },
    {
        path: '/orderDetail',
        name: 'orderListDetail',
        component: orderListDetail,
    },
];

export default pageroutes;
