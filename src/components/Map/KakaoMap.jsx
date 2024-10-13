import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import './KakaoMap.css'
import { useLocation, useNavigate } from 'react-router-dom';

const initialState = {
    keyword: '',
    results: [],
    error: '',
    map: null,
    markers: [],
    currentPosition: null,
    favorites: [],
    infowindow: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_KEYWORD':
            return { ...state, keyword: action.payload };
        case 'SET_RESULTS':
            return { ...state, results: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_MAP':
            return { ...state, map: action.payload };
        case 'SET_MARKERS':
            return { ...state, markers: action.payload };
        case 'SET_CURRENT_POSITION':
            return { ...state, currentPosition: action.payload };
        case 'ADD_FAVORITE':
            return { ...state, favorites: [...state.favorites, action.payload] };
        case 'SET_INFOWINDOW':
            return { ...state, infowindow: action.payload };
        default:
            return state;
    }
};

const KakaoMap = () => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const location = useLocation();
    const { place } = location.state || {};  
    console.log(place)

    // 검색 엔터키 처리
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearch = async () => {
        dispatch({ type: 'SET_ERROR', payload: '' });
        if (!state.keyword.trim()) {
            dispatch({ type: 'SET_ERROR', payload: '검색어를 입력하세요.' });
            return;
        }

        try {
            const response = await axios.get('/kakao/search', {
                params: { keyword: state.keyword },
            });
            dispatch({ type: 'SET_RESULTS', payload: response.data.documents });
            if (state.map) {
                displayPlaces(response.data.documents);
            }
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.response?.data.errorMessage || 'API 호출 중 오류가 발생했습니다.' });
        }
    };

    const displayPlaces = (places) => {
        const bounds = new window.kakao.maps.LatLngBounds();
        removeMarkers();

        const newMarkers = places.map((place) => {
            const position = new window.kakao.maps.LatLng(place.y, place.x);
            const marker = addMarker(position, place.place_name);
            bounds.extend(position);
            return marker;
        });

        if (state.map) {
            state.map.setBounds(bounds);
        }
        dispatch({ type: 'SET_MARKERS', payload: newMarkers });
    };

    const addMarker = (position, placeName) => {
        const marker = new window.kakao.maps.Marker({ position });
        marker.setMap(state.map);

        window.kakao.maps.event.addListener(marker, 'mouseover', () => displayInfowindow(marker, placeName));
        window.kakao.maps.event.addListener(marker, 'mouseout', hideInfowindow);

        return marker;
    };

    const removeMarkers = () => {
        state.markers.forEach((marker) => {
            marker.setMap(null);
        });
        dispatch({ type: 'SET_MARKERS', payload: [] });
    };

    const displayInfowindow = (marker, placeName) => {
        if (!state.infowindow) {
            const newInfowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
            dispatch({ type: 'SET_INFOWINDOW', payload: newInfowindow });
        }

        if (state.infowindow) {
            state.infowindow.setContent(`<div style="padding:5px;font-size:12px;">${placeName}</div>`);
            state.infowindow.open(state.map, marker);
        }
    };

    const hideInfowindow = () => {
        if (state.infowindow) {
            state.infowindow.close();
        }
    };

    const getCurrentPosition = () => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((place) => {
                const currentPos = new window.kakao.maps.LatLng(place.coords.latitude, place.coords.longitude);
                dispatch({ type: 'SET_CURRENT_POSITION', payload: currentPos });

                if (state.map) {
                    state.map.setCenter(currentPos);
                    addMarker(currentPos, '현재 위치');
                }
            }, (error) => {
                console.error(error.message);
                dispatch({ type: 'SET_ERROR', payload: '현재 위치를 가져오는 데 실패했습니다.' });
            });
        } else {
            dispatch({ type: 'SET_ERROR', payload: '이 브라우저는 Geolocation을 지원하지 않습니다.' });
        }
    };

    useEffect(() => {
        const script = document.createElement('script');

        script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=b0fbfc88ec237a284330f2cece3d72c4&libraries=services'; // 지도띄우기
        script.async = true;
        script.onload = () => {
            const container = document.getElementById('map');
            getCurrentPosition();

            const options = {
                center: state.currentPosition || new window.kakao.maps.LatLng(33.450701, 126.570667),
                level: 3,
            };
            const newMap = new window.kakao.maps.Map(container, options);
            dispatch({ type: 'SET_MAP', payload: newMap });
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
            removeMarkers(); // 마커 제거
        };
    }, []);

    useEffect(() => {
        if (state.map && state.currentPosition) {
            state.map.setCenter(state.currentPosition);
            addMarker(state.currentPosition, '현재 위치');
        }
    }, [state.map, state.currentPosition]);

    const addToFavorites = (place) => {
        dispatch({ type: 'ADD_FAVORITE', payload: place });
    };

    return (
        <div className="kakao-map-container">
            <div className="kakao-map-search-bar">
                <input
                    type="text"
                    className="kakao-map-input"
                    value={state.keyword}
                    onChange={(e) => dispatch({ type: 'SET_KEYWORD', payload: e.target.value })}
                    onKeyPress={handleKeyPress} // 엔터키로 검색 실행
                    placeholder="검색어 입력"
                />
                <button className="kakao-map-button" onClick={handleSearch}>검색</button>
            </div>

            {state.error && <div className="kakao-map-error">{state.error}</div>}

            
            <div id="map" className="kakao-map-map"></div>
            <ul className="kakao-map-results">
                {state.results.map((place, index) => (
                    <li
                        key={index}
                        id={`list-item-${index}`}
                        onMouseOver={() => {
                            const marker = state.markers[index];
                            if (marker) {
                                displayInfowindow(marker, place.place_name);
                            }
                        }}
                        onMouseOut={() => {
                            const marker = state.markers[index];
                            if (marker) {
                                hideInfowindow(marker);
                            }
                        }}
                    >
                        {place.place_name} - {place.road_address_name || place.address_name}
                        <button onClick={() => addToFavorites(place)}>즐겨찾기 추가</button>
                    </li>
                ))}
            </ul>

            <h2>즐겨찾기 목록</h2>

            <ul className="kakao-map-favorites">
                {state.favorites.map((favorite, index) => (
                    <li key={index}>
                        {favorite.place_name} - {favorite.road_address_name || favorite.address_name}
                    </li>
                ))}
            </ul>
        </div>
    );
    
};

export default KakaoMap;
