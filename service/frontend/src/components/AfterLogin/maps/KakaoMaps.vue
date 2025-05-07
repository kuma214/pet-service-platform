<template>
    <div class="map-container">
        <div class="search-page">
            <!-- 상단 바 -->
            <div class="top-bar">
                <!-- 왼쪽에 뒤로가기 버튼 -->
                <button class="back-button" @click="goBack">
                    <svg
                        width="30px"
                        height="30px"
                        fill="#000000"
                        viewBox="0 0 200 200"
                        data-name="Layer 1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <title></title>
                            <path
                                d="M160,89.75H56l53-53a9.67,9.67,0,0,0,0-14,9.67,9.67,0,0,0-14,0l-56,56a30.18,30.18,0,0,0-8.5,18.5c0,1-.5,1.5-.5,2.5a6.34,6.34,0,0,0,.5,3,31.47,31.47,0,0,0,8.5,18.5l56,56a9.9,9.9,0,0,0,14-14l-52.5-53.5H160a10,10,0,0,0,0-20Z"
                            ></path>
                        </g>
                    </svg>
                </button>

                <!-- 가운데에 '시설 검색' 텍스트 -->
                <div class="search-title">시설 검색</div>
            </div>

            <!-- 시설 카테고리 버튼들 -->
            <div class="category-buttons">
                <button
                    class="category-btn"
                    :class="{ active: activeCategory === '동물병원' }"
                    @click="searchCategory('동물병원')"
                >
                    동물 병원
                </button>
                <button
                    class="category-btn"
                    :class="{ active: activeCategory === '반려동물미용' }"
                    @click="searchCategory('반려동물미용')"
                >
                    미용실
                </button>
                <button
                    class="category-btn"
                    :class="{ active: activeCategory === '애견카페' }"
                    @click="searchCategory('애견카페')"
                >
                    애견 카페
                </button>
                <button
                    class="category-btn"
                    :class="{ active: activeCategory === '반려동물용품' }"
                    @click="searchCategory('반려동물용품')"
                >
                    반려동물 <br />
                    용품점
                </button>
            </div>
        </div>
        <div class="map-wrapper" :style="{ height: isMapMinimized ? '10vh' : '40vh' }">
            <!-- 지도 컨테이너 -->
            <div class="map-container" ref="mapContainer">
                <div class="filter-buttons">
                    <button
                        class="filter-btn"
                        :class="{ active: activeFilter === '전체' }"
                        @click="filterFacilities('전체')"
                    >
                        전체
                    </button>
                    <button
                        class="filter-btn"
                        :class="{ active: activeFilter === '제휴' }"
                        @click="filterFacilities('제휴')"
                    >
                        제휴
                    </button>
                </div>
                <!-- 알림 메시지 표시 영역 -->
                <div class="alert-message">전화번호가 저장되었습니다.</div>
            </div>

            <!-- 현재 위치 정보 표시 -->
            <div class="current-location-info" @click="toggleMapSize">
                <div class="location-header">
                    <span>📍 현재위치 : {{ currentAddress }}</span>
                    <button class="refresh-btn" @click.stop="refreshUserLocation">
                        <!-- SVG 아이콘 대신 사용 -->
                        <svg
                            height="25px"
                            width="25px"
                            viewBox="-2.4 -2.4 28.80 28.80"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g id="SVGRepo_bgCarrier" stroke-width="0">
                                <rect
                                    x="-2.4"
                                    y="-2.4"
                                    width="28.80"
                                    height="28.80"
                                    rx="14.4"
                                    fill="#e1f0fc"
                                    strokewidth="0"
                                ></rect>
                            </g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke="#CCCCCC"
                                stroke-width="0.144"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    d="M4.06189 13C4.02104 12.6724 4 12.3387 4 12C4 7.58172 7.58172 4 12 4C14.5006 4 16.7332 5.14727 18.2002 6.94416M19.9381 11C19.979 11.3276 20 11.6613 20 12C20 16.4183 16.4183 20 12 20C9.61061 20 7.46589 18.9525 6 17.2916M9 17H6V17.2916M18.2002 4V6.94416M18.2002 6.94416V6.99993L15.2002 7M6 20V17.2916"
                                    stroke="#000000"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                ></path>
                            </g>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- 시설 정보 리스트 -->
            <div class="facility-list" :style="{ height: isMapMinimized ? '80vh' : '40vh' }">
                <div
                    class="facility-item"
                    v-for="(facility, index) in filteredFacilityList"
                    :key="index"
                    @click="moveToFacility(facility)"
                >
                    <div class="facility-info">
                        <div class="facility-name">
                            {{ facility.name }}
                            <span v-if="isAffiliated(facility)"> (제휴) </span>
                        </div>
                        <div class="facility-rating">5.0 ★★★★★</div>
                        <div class="facility-address">{{ facility.address }}</div>
                    </div>
                    <div class="facility-action">
                        <button class="reservation-btn" @click="makePhoneCall(facility.phoneNumber)">
                            예약<br />상담
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useFacilityStore } from '@/fetch_datas/facilityStore'; // Pinia 스토어 가져오기

const mapContainer = ref(null);
const mapInstance = ref(null);
const userLocation = ref(null);
const userMarker = ref(null);
const isMapReady = ref(false);
const isMapMinimized = ref(false);
const mapWrapperHeight = ref('40vh'); // 초기 높이는 40vh
const currentAddress = ref('위치 정보를 불러오는 중...'); // 현재 위치 주소를 저장할 상태 변수
const facilityList = ref([]); // 병원 리스트 데이터를 저장할 변수
const activeFilter = ref('전체'); // 필터링 상태 관리 ('전체' 또는 '제휴')
const filteredFacilityList = ref([]); // 필터링된 병원 리스트
const facilityStore = useFacilityStore(); // Pinia 스토어 인스턴스 사용
const activeCategory = ref('동물병원'); // 활성화된 카테고리를 저장할 상태 변수
const markers = ref([]);
const infoWindow = ref(null); // 인포윈도우 객체를 저장할 변수 선언
const alertMessage = ref(''); // 알림 메시지 상태 변수

// 공공데이터 API 정보
// const API_KEY = '8Opb1NFLhzfnHXfd28uPabBZIljNXbqLRy+s8CO3I4744jA/Lzy9vOt/N5ZnnsxnQKcqX8F6IeFpdJ37ggPSSA=='; // Decoding 인증키
// const BASE_URL = 'https://api.odcloud.kr/api/15075937/v1/uddi:d41505f8-093d-4905-aad7-c09e8e3831fd'; // Base URL에 데이터 API 엔드포인트 추가

// 공공데이터 API 호출 함수
// const fetchfacilityData = async () => {
//     try {
//         const response = await axios.get(BASE_URL, {
//             params: {
//                 serviceKey: API_KEY,
//                 page: 1,
//                 perPage: 10,
//             },
//             headers: {
//                 'Content-Type': 'application/json', // 요청의 Content-Type 설정
//                 Accept: 'application/json', // 서버로부터 받을 데이터 형식 설정
//             },
//             withCredentials: false, // 자격 증명(쿠키)을 포함하지 않도록 설정
//         });

//         // API 호출 결과에서 병원 데이터 추출
//         console.log('API 응답 전체 데이터:', response.data); // 전체 응답 확인

//         const data = response.data.data;
//         console.log('병원 데이터:', data); // 추출한 병원 데이터 확인

//         if (!Array.isArray(data)) {
//             console.error('받아온 데이터가 올바르지 않습니다.', data);
//             return;
//         }

//         const facilitysWithLatLng = await Promise.all(
//             data.map(async (facility) => {
//                 try {
//                     // address 변수가 정의되지 않았을 수 있습니다.
//                     const address = facility.도로명주소 || facility.지번주소;
//                     const { latitude, longitude } = await convertAddressToLatLng(address);
//                     return {
//                         name: facility.사업장명,
//                         address: facility.도로명주소,
//                         lat: latitude,
//                         lng: longitude,
//                     };
//                 } catch (error) {
//                     console.error(`주소 변환 실패: ${facility.지번주소 || facility.도로명주소}`, error);
//                     return null;
//                 }
//             }),
//         );

//         // 유효한 병원 데이터만 필터링
//         facilityList.value = facilitysWithLatLng.filter((facility) => facility !== null);

//         // 지도에 병원 마커 추가
//         addMarkersToMap(facilityList.value);
//     } catch (error) {
//         console.error('API 호출 오류:', error);
//     }
// };

// 뒤로가기 버튼 클릭 시 동작할 함수
const goBack = () => {
    window.history.back(); // 이전 페이지로 이동
};

const toggleMapSize = () => {
    isMapMinimized.value = !isMapMinimized.value;

    // 지도의 크기를 동적으로 조정
    mapWrapperHeight.value = isMapMinimized.value ? '10vh' : '40vh';

    // 애니메이션이 끝나기 전에 지도 중심을 미리 설정
    if (!isMapMinimized.value && mapInstance.value && userLocation.value) {
        // 지도가 확장될 때는 panTo 대신 setCenter를 사용하여 즉시 이동
        mapInstance.value.setCenter(userLocation.value);
    }

    // 지도 크기 변경 후 중심을 다시 설정
    setTimeout(() => {
        window.dispatchEvent(new Event('resize')); // 지도의 크기가 변경되었음을 알림

        // 지도 중심을 사용자 위치로 재설정
        if (mapInstance.value && userLocation.value) {
            mapInstance.value.panTo(userLocation.value);
        }
    }, 300); // 300ms 후 중심을 설정 (CSS transition 시간과 맞춤)
};

// 기존 마커들을 모두 지도에서 제거하는 함수
const clearMarkers = () => {
    markers.value.forEach((marker) => {
        if (marker && marker.setMap) {
            marker.setMap(null); // 마커를 지도에서 제거
        }
    });
    markers.value = []; // 마커 배열 초기화

    if (infoWindow.value) {
        infoWindow.value.close(); // 기존 인포윈도우 닫기
    }
};

// facility-item을 클릭했을 때 해당 위치로 이동하는 함수
const moveToFacility = (facility) => {
    if (!mapInstance.value || !facility.lat || !facility.lng) return;

    // 모든 인포윈도우를 닫음
    closeAllInfoWindows();

    const facilityLocation = new window.kakao.maps.LatLng(facility.lat, facility.lng);

    // 지도의 중심을 클릭한 시설의 위치로 이동
    mapInstance.value.panTo(facilityLocation);

    // 시설의 위치에 있는 마커를 찾기
    const marker = markers.value.find(
        (marker) => marker.getPosition().getLat() === facility.lat && marker.getPosition().getLng() === facility.lng,
    );

    // 해당 마커가 존재하면 인포윈도우를 생성하고 표시
    if (marker) {
        createInfoWindow(marker, facility);
    }
};

// 위치 기반 동물병원 검색 함수 (category_name 필터링 포함)
const searchfacilitysNearLocation = (lat, lng, category) => {
    if (!window.kakao || !window.kakao.maps) return;

    const places = new window.kakao.maps.services.Places();

    // 카테고리 검색 콜백 함수
    const callback = (result, status) => {
        console.log('카카오맵 API 응답 데이터:', result);
        if (status === window.kakao.maps.services.Status.OK) {
            // 응답 결과에서 선택한 카테고리의 category_name이 포함된 데이터만 필터링
            let filteredResults;
            if (category === '동물병원') {
                filteredResults = result.filter((place) => place.category_name.includes('반려동물 > 동물병원'));
            } else if (category === '애견카페') {
                filteredResults = result.filter((place) => place.category_name.includes('애견카페'));
            } else if (category === '반려동물미용') {
                filteredResults = result.filter((place) => place.category_name.includes('반려동물미용'));
            } else if (category === '반려동물용품') {
                filteredResults = result.filter((place) => place.category_name.includes('반려동물용품'));
            }
            updatefacilityListAndMarkers(filteredResults);
        } else {
            console.error('장소 검색 실패:', status);
        }
    };

    // 키워드 검색 메서드 사용
    places.keywordSearch(category, callback, {
        location: new window.kakao.maps.LatLng(lat, lng),
        radius: 4000, // 반경 3km
    });
};

// 카테고리 버튼 클릭 시 호출되는 함수
const searchCategory = (category) => {
    activeCategory.value = category; // 클릭한 카테고리 버튼을 활성화 상태로 변경

    // 기존 마커를 모두 제거
    clearMarkers();

    if (userLocation.value) {
        searchfacilitysNearLocation(userLocation.value.getLat(), userLocation.value.getLng(), category);
    }
};

const mapKakaoDataToHospitalDTO = (kakaoData) => {
    return {
        name: kakaoData.place_name,
        address: kakaoData.road_address_name || kakaoData.address_name,
        phoneNumber: kakaoData.phone,
        id: kakaoData.id,
        isOurs: false, // 기본값은 제휴되지 않은 병원으로 설정
    };
};

// 필터링된 병원 리스트 업데이트 함수
const filterFacilities = (filterType) => {
    activeFilter.value = filterType; // 선택된 필터 타입으로 상태 업데이트

    if (filterType === '전체') {
        // 제휴 병원 중 상위 2개만 선택
        const topAffiliatedFacilities = facilityList.value.filter((facility) => facility.isOurs).slice(0, 2); // 제휴 병원 상위 2개만 선택

        // 제휴되지 않은 병원 정렬
        const nonAffiliatedFacilities = facilityList.value.filter((facility) => !facility.isOurs);

        // 상단에 제휴 병원 2개 + 나머지 병원들로 구성된 리스트 생성
        filteredFacilityList.value = [...topAffiliatedFacilities, ...nonAffiliatedFacilities];
    } else if (filterType === '제휴') {
        // 제휴 병원만 필터링
        filteredFacilityList.value = facilityList.value.filter((facility) => facility.isOurs);
    }
};

// 병원 리스트와 마커 업데이트 함수
const updatefacilityListAndMarkers = async (places) => {
    // 병원 데이터를 Kakao API DTO 형태로 변환 후 저장
    facilityList.value = await Promise.all(
        places.map(async (place) => {
            const facilityDTO = mapKakaoDataToHospitalDTO(place);

            // 제휴 여부 설정
            facilityDTO.isOurs = facilityStore.affiliatedFacilities.some(
                (affiliated) => affiliated.name === facilityDTO.name && affiliated.address === facilityDTO.address,
            );

            try {
                // 주소를 위도와 경도로 변환
                const { latitude, longitude } = await convertAddressToLatLng(facilityDTO.address);
                facilityDTO.lat = latitude;
                facilityDTO.lng = longitude;
            } catch (error) {
                console.error('Error converting address to lat/lng:', facilityDTO.address, error);
            }

            return facilityDTO;
        }),
    );

    // 기존 마커 모두 제거
    clearMarkers();

    /* // 제휴 병원이 상단에 오도록 정렬
    const sortedFacilities = facilitiesWithLatLng.sort((a, b) => {
        // 제휴 병원이면 상단에 배치
        if (a.isOurs && !b.isOurs) return -1;
        if (!a.isOurs && b.isOurs) return 1;

        // 그 외에는 거리 순서대로 정렬
        return a.distance - b.distance;
    });*/

    // 시설 리스트를 업데이트하고 지도에 마커로 표시
    filterFacilities(activeFilter.value); // 필터링된 리스트 업데이트
    addMarkersToMap(facilityList.value);
};

// 병원 데이터를 기반으로 지도에 마커 추가 및 클릭 이벤트 설정
const addMarkersToMap = (facilities) => {
    if (!isMapReady.value || !window.kakao || !window.kakao.maps) return;

    // 제휴 병원 마커 이미지 설정
    const affiliatedMarkerImageSrc = `data:image/svg+xml;base64,${btoa(`
<svg height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 432 432" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#F69494;" d="M216,16c88,0,160,72,160,160c0,79.2-131.2,209.6-160,236.8C187.2,385.6,56,255.2,56,176 C56,88,128,16,216,16z M336,168c0-66.4-53.6-120-120-120S96,101.6,96,168s53.6,120,120,120S336,234.4,336,168z"></path> <g> <path style="fill:#42210B;" d="M216,0c96.8,0,176,79.2,176,176c0,95.2-164,247.2-170.4,253.6c-1.6,1.6-4,2.4-5.6,2.4 s-4-0.8-5.6-2.4C204,423.2,40,271.2,40,176C40,79.2,119.2,0,216,0z M376,176c0-88-72-160-160-160S56,88,56,176 c0,79.2,131.2,209.6,160,236.8C244.8,385.6,376,255.2,376,176z"></path> <path style="fill:#42210B;" d="M216,48c66.4,0,120,53.6,120,120s-53.6,120-120,120S96,234.4,96,168S149.6,48,216,48z M320,168 c0-57.6-46.4-104-104-104s-104,46.4-104,104s46.4,104,104,104S320,225.6,320,168z"></path> </g> <path style="fill:#E94545;" d="M216,64c57.6,0,104,46.4,104,104s-46.4,104-104,104s-104-46.4-104-104S158.4,64,216,64z"></path> <path style="fill:#EE5656;" d="M216,80c48.8,0,88,39.2,88,88s-39.2,88-88,88s-88-39.2-88-88S167.2,80,216,80z"></path> <path style="fill:#42210B;" d="M288,136v48c0,4-4,8-8,8h-32v32c0,4-4,8-8,8h-48c-4,0-8-4-8-8v-32h-32c-4,0-8-4-8-8v-48c0-4,4-8,8-8 h32V96c0-4,4-8,8-8h48c4,0,8,4,8,8v32h32C284,128,288,132,288,136z M272,176v-32h-32c-4,0-8-4-8-8v-32h-32v32c0,4-4,8-8,8h-32v32h32 c4,0,8,4,8,8v32h32v-32c0-4,4-8,8-8H272z"></path> <path style="fill:#FFF8EF;" d="M272,144v32h-32c-4,0-8,4-8,8v32h-32v-32c0-4-4-8-8-8h-32v-32h32c4,0,8-4,8-8v-32h32v32c0,4,4,8,8,8 H272z"></path> </g></svg>
`)}`;

    // 제휴 병원 마커 이미지 객체
    const affiliatedMarkerImage = new window.kakao.maps.MarkerImage(
        affiliatedMarkerImageSrc,
        new window.kakao.maps.Size(30, 30), // 마커 이미지 크기 설정
        { offset: new window.kakao.maps.Point(10, 32) }, // 마커 위치 오프셋 설정
    );

    facilities.forEach((facility) => {
        if (!facility.lat || !facility.lng) {
            console.error('Facility is missing latitude or longitude:', facility);
            return; // 위도/경도 값이 없는 시설은 건너뜀
        }

        const position = new window.kakao.maps.LatLng(facility.lat, facility.lng);

        // 제휴 여부에 따라 마커 이미지 설정
        const markerImage = facility.isOurs ? affiliatedMarkerImage : null; // 제휴 병원일 경우만 커스텀 마커 적용

        // 마커 생성 시 이미지 설정
        const marker = new window.kakao.maps.Marker({
            position,
            map: mapInstance.value,
            title: facility.name,
            image: markerImage, // 마커 이미지 설정 (제휴 병원이 아닐 경우 null로 두어 기본 마커 사용)
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
            createInfoWindow(marker, facility);
        });

        markers.value.push(marker);
    });
};

// 인포윈도우 생성 함수
const createInfoWindow = (marker, facility) => {
    if (!window.kakao || !window.kakao.maps) {
        console.error('Kakao Maps SDK가 로드되지 않았습니다.');
        return;
    }

    // HTML 콘텐츠 작성
    const content = `
        <div id="info-window-content" style="padding:10px; width:200px; height:120px; display:flex; flex-direction: column; align-items: center; justify-content: center; text-align:center; position: relative;">
            <p style="margin:0px; font-size:14px;">${facility.name}</p>
            <p style="margin:2px 0; font-size:12px;">${facility.address}</p>
            <p style="margin:2px 0; font-size:11px">5.0 ★★★★★</p>
            <p id="phone-number" style="margin:2px 0; font-size:12px; cursor: pointer;">
                ${facility.phoneNumber} 복사하기
            </p>
        </div>
    `;

    if (!infoWindow.value) {
        infoWindow.value = new window.kakao.maps.InfoWindow({
            content,
            removable: true,
        });
    } else {
        infoWindow.value.setContent(content); // 인포윈도우 내용 업데이트
    }

    infoWindow.value.open(mapInstance.value, marker);

    // 이벤트 리스너 바인딩
    const phoneNumberElement = document.getElementById('phone-number');
    if (phoneNumberElement) {
        phoneNumberElement.addEventListener('click', () => {
            copyToClipboard(facility.phoneNumber);
            showCopyMessage();
        });
    }
};

// 전화번호 복사 함수
const copyToClipboard = (text) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
};

const showCopyMessage = () => {
    const alertMessageElement = document.querySelector('.alert-message');
    alertMessage.value = '전화번호가 저장되었습니다.';

    // 'show' 클래스를 추가하여 메시지 표시
    if (alertMessageElement) {
        alertMessageElement.classList.add('show');
    }

    // 일정 시간이 지난 후 메시지 숨기기
    setTimeout(() => {
        if (alertMessageElement) {
            alertMessageElement.classList.remove('show'); // show 클래스를 제거하여 메시지 숨김
        }
    }, 1500); // 1.5초 후 메시지 사라지기 시작
};

// 지도 클릭 시 인포윈도우 닫기
const addMapClickListener = () => {
    // Kakao Maps SDK가 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps) {
        console.error('Kakao Maps SDK가 로드되지 않았습니다.');
        return;
    }

    if (!mapInstance.value) {
        console.error('mapInstance가 초기화되지 않았습니다.');
        return;
    }

    // 지도 클릭 시 인포윈도우를 닫는 이벤트 리스너 추가
    window.kakao.maps.event.addListener(mapInstance.value, 'click', () => {
        if (infoWindow.value) {
            infoWindow.value.close();
        }
    });
};

// 모든 인포윈도우를 닫는 함수
const closeAllInfoWindows = () => {
    if (infoWindow.value) {
        infoWindow.value.close(); // 현재 열려 있는 인포윈도우를 닫음
    }
};

// 지도 초기화 함수
const loadKakaoMap = (container) => {
    return new Promise((resolve, reject) => {
        if (!window.kakao || !window.kakao.maps) {
            const script = document.createElement('script');
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=174a4fe81b5616acf152b93b71c0b41d&libraries=services,clusterer,drawing&autoload=false`;
            document.head.appendChild(script);

            script.onload = () => {
                window.kakao.maps.load(() => {
                    initializeMap(container);
                    isMapReady.value = true;
                    refreshUserLocation();
                    resolve(true);
                });
            };

            script.onerror = () => {
                console.error('Kakao Maps SDK 로드 실패');
                reject(false);
            };
        } else {
            initializeMap(container);
            isMapReady.value = true;
            refreshUserLocation();
            resolve(true);
        }
    });
};

// 지도 설정 및 사용자 위치 마커 초기화 함수
const initializeMap = (container) => {
    const options = {
        center: new window.kakao.maps.LatLng(37.583713, 126.999971),
        level: 3, // 지도 확대 수준
    };
    mapInstance.value = new window.kakao.maps.Map(container, options);

    const zoomControl = new window.kakao.maps.ZoomControl();
    mapInstance.value.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

    isMapReady.value = true;

    // 지도 클릭 이벤트 추가 (클릭 시 마커 및 주소 업데이트)
    window.kakao.maps.event.addListener(mapInstance.value, 'click', (mouseEvent) => {
        const latLng = mouseEvent.latLng;
        moveToLocation(latLng.getLat(), latLng.getLng());
        // fetchfacilityData(latLng.getLat(), latLng.getLng()); // 클릭한 위치를 기준으로 병원 데이터 가져오기
    });

    // 초기 위치를 기준으로 병원 데이터 가져오기
    refreshUserLocation();
};

// 사용자 위치 마커 업데이트 함수
const updateUserMarker = (lat, lng) => {
    if (!isMapReady.value || !window.kakao || !window.kakao.maps) return;

    const position = new window.kakao.maps.LatLng(lat, lng);

    // 기존 마커 제거
    if (userMarker.value) {
        userMarker.value.setMap(null);
    }

    // 새로운 사용자 위치 마커 생성 및 추가
    userMarker.value = new window.kakao.maps.Marker({
        position: position,
        map: mapInstance.value,
        title: '현재 위치',
        draggable: false,
        image: new window.kakao.maps.MarkerImage(
            `data:image/svg+xml;base64,${btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    <circle cx="60" cy="50" r="40" fill="#FF0000" opacity="0.2"/>
                    <circle cx="60" cy="50" r="25" fill="#FF0000"/>
                </svg>
            `)}`,
            new window.kakao.maps.Size(25, 25),
            {
                offset: new window.kakao.maps.Point(25, 25),
            },
        ),
    });
};

// 주소를 위도와 경도로 변환하는 함수
const convertAddressToLatLng = async (address) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    return new Promise((resolve, reject) => {
        geocoder.addressSearch(address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const { y: latitude, x: longitude } = result[0];
                resolve({ latitude, longitude });
            } else {
                reject(`주소 변환 실패: ${address}`);
            }
        });
    });
};

// 좌표를 주소로 변환하는 함수
const getAddressFromCoords = (lat, lng) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    const coord = new window.kakao.maps.LatLng(lat, lng);

    geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
            currentAddress.value = result[0].address.address_name;
        } else {
            currentAddress.value = '주소 변환 실패';
        }
    });
};

// 사용자 위치로 지도 이동 함수
const moveToLocation = (lat, lng) => {
    if (!isMapReady.value || !window.kakao || !window.kakao.maps) return;

    const location = new window.kakao.maps.LatLng(lat, lng);
    userLocation.value = location;

    // 지도 중심을 부드럽게 이동 (panTo 사용)
    mapInstance.value.panTo(location);

    // 사용자 위치 마커 업데이트
    updateUserMarker(lat, lng);
    // 주소 업데이트
    getAddressFromCoords(lat, lng);
    // 현재 활성화된 카테고리로 병원 데이터 검색
    searchfacilitysNearLocation(lat, lng, activeCategory.value);
    // API 호출하여 병원 데이터 가져오기
    // fetchfacilityData(lat, lng);
};

// 사용자 위치 새로고침 함수
const refreshUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                moveToLocation(position.coords.latitude, position.coords.longitude);
                // 사용자 위치 기반 반경 2km 내 병원 검색
                searchfacilitysNearLocation(position.coords.latitude, position.coords.longitude, activeCategory.value);
                // 사용자 위치를 기준으로 병원 데이터 가져오기
                // fetchfacilityData(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.error('사용자 위치를 가져오는 중 오류 발생: ', error);
            },
            {
                enableHighAccuracy: true, // 정확도 높은 위치 요청
                timeout: 5000, // 위치 요청 타임아웃 설정
                maximumAge: 0, // 캐시된 위치 정보 사용 방지
            },
        );
    } else {
        console.error('이 브라우저는 Geolocation을 지원하지 않습니다.');
    }
};

// 제휴 병원 데이터와 비교하여 일치하는지 확인하는 함수
const isAffiliated = (facility) => {
    return facilityStore.affiliatedFacilities.some(
        (affiliated) => affiliated.name === facility.name && affiliated.address === facility.address,
    );
};

// 전화 걸기
const makePhoneCall = (phoneNumber) => {
    if (phoneNumber) {
        window.location.href = `tel:${phoneNumber}`;
    } else {
        alert('전화번호가 없습니다.');
    }
};

// 지도 초기화 및 이벤트 등록
onMounted(async () => {
    try {
        // 제휴 병원 데이터를 불러옴
        await facilityStore.fetchAffiliatedFacilities();

        // Kakao Maps SDK를 로드하고 초기화 (완료될 때까지 기다림)
        await loadKakaoMap(mapContainer.value);

        // Kakao Maps SDK가 정상적으로 로드된 이후, 이벤트 리스너 등록
        addMapClickListener();

        console.log('Kakao Map 초기화 및 이벤트 리스너 등록 완료');
    } catch (error) {
        console.error('Kakao Map 로드 중 오류 발생:', error);
    }
});

// 컴포넌트 언마운트 시 이벤트 제거
onBeforeUnmount(() => {
    if (userMarker.value) {
        userMarker.value.setMap(null);
    }

    // 지도 클릭 이벤트 제거
    if (mapInstance.value) {
        window.kakao.maps.event.removeListener(mapInstance.value, 'click');
    }
});
</script>

<style scoped>
.map-container {
    position: relative;
    background-color: #cee2f5;
    width: 100%;
    height: 100%;
}

.alert-message {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s ease-in-out, visibility 0s linear 1s;
    z-index: 100;
}

.alert-message.show {
    opacity: 0.9;
    visibility: visible;
    transition: opacity 0.5s ease-in-out;
}

/* 필터 버튼 스타일 */
.filter-buttons {
    position: absolute;
    /* top: 2px;
    left: 2px; */
    display: flex;
    z-index: 100;
}

.filter-btn {
    padding: 5px 10px;
    font-size: 14px;
    background-color: #ffffff; /* 필터 버튼의 배경색을 흰색으로 변경 */
    border: 1px solid #539ee0; /* 테두리를 카테고리와 동일하게 */
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.filter-btn.active {
    background-color: #ffffff; /* 활성화된 상태에서도 흰색 유지 */
    color: black; /* 글자 색상을 카테고리 색상과 동일하게 */
    border: 2px solid #539ee0; /* 활성화된 필터 버튼 테두리 강조 */
}

.filter-btn:hover {
    background-color: #ffffff; /* 활성화된 상태에서도 흰색 유지 */
    color: black; /* 글자 색상을 카테고리 색상과 동일하게 */
}

.map-wrapper {
    padding: 5px;
    position: relative;
    width: 100%;
    height: 40vh;
    transition: height 0.3s ease;
}

.refresh-location-btn:hover {
    background-color: #f1f1f1;
}

/* 현재 위치 정보 스타일 */
.current-location-info {
    cursor: pointer;
    padding: 10px;
    margin-left: 5px;
    margin-right: 5px;
    background-color: #8ec6f5;
    border-radius: 5px;
    margin-top: 10px;
}

.location-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.refresh-btn {
    background-color: #e1f0fc;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
}

/* 시설 리스트 스타일 */
.facility-list {
    overflow-y: auto;
    scrollbar-width: thin;
    width: 100%;
    height: 100%;
    margin-top: 10px;
    transition: height 0.3s ease;
    flex: 1;
    max-height: calc(100vh - 250px);
}

.facility-item {
    display: flex;
    align-items: center;
    padding: 5px;
    margin-left: 5px;
    margin-right: 5px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
}

.facility-info {
    display: flex;
    margin: 5px 10px;
    flex-direction: column;
    align-items: flex-start;
}

.facility-name {
    font-size: 16px;
    font-weight: bold;
}

.facility-rating {
    font-size: 14px;
    display: flex;
    align-items: center;
    color: #ff6347; /* 0.0 숫자를 빨간색으로 */
}

.facility-address {
    font-size: 14px;
    color: #666;
    align-items: flex-start;
}

/* 병원 예약 및 상담 버튼 스타일 */
.facility-action {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 5px; /* 버튼 사이의 간격 */
    margin-left: auto;
    margin-right: 5px;
}
.facility-action button {
    padding: 5px 10px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}

.reservation-btn {
    text-align: center;
    white-space: nowrap;
    font-size: 14px;
    background-color: #539ee0;
    color: #fff;
}

.search-page {
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* 상단 바 스타일 */
.top-bar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: white;
    padding: 15px 10px;
    font-size: 18px;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
}

/* 뒤로가기 버튼 스타일 */
.back-button {
    position: absolute;
    left: 10px;
    background: none;
    border: none;
    cursor: pointer;
}

/* 검색 제목 스타일 */
.search-title {
    font-size: 20px;
}

/* 카테고리 버튼들 스타일 */
.category-buttons {
    display: flex;
    justify-content: space-around;
    width: 100%;
}

/* 각 카테고리 버튼 스타일 */
.category-btn {
    flex: 1; /* 동일한 너비를 가지도록 설정 */
    margin: 0 0px;
    height: 55px;
    padding-top: 5px;
    border: none;
    background-color: #f9f9f9;
    color: black;
    font-size: 15px;
    cursor: pointer;
    transition: background-color 0.3s;
}

/* 버튼 호버 시 배경색 변경 */
.category-btn:hover {
    background-color: #539ee0;
}

/* 활성화된 버튼에 적용되는 스타일 */
.category-btn.active {
    background-color: #539ee0; /* 활성화된 버튼의 배경색 */
    font-weight: bold; /* 활성화된 버튼의 글씨 두껍게 */
    color: #fff; /* 활성화된 버튼의 글자색 */
    border: 2px solid #539ee0; /* 테두리 추가 */
}
</style>
