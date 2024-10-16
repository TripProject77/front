import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WeatherInfo.scss";

const WeatherInfo = () => {
  const [selectedParentRegion, setSelectedParentRegion] = useState(""); // 선택된 부모 지역
  const [selectedChildRegion, setSelectedChildRegion] = useState(""); // 선택된 자식 지역
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regions, setRegions] = useState([]);
  const [childRegions, setChildRegions] = useState([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get("/api/regions");
        setRegions(response.data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchRegions();
  }, []);

  useEffect(() => {
    if (selectedChildRegion) {
      const fetchWeather = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `/api/weather?regionId=${selectedChildRegion}`
          );
          setWeatherInfo(response.data.weather);
        } catch (error) {
          console.error("Error fetching weather:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchWeather();
    }
  }, [selectedChildRegion]);

  const handleParentRegionChange = (e) => {
    const parentRegion = e.target.value;
    setSelectedParentRegion(parentRegion);
    setSelectedChildRegion("");
    setChildRegions(
      regions.filter((region) => region.parentRegion === parentRegion)
    );
  };

  const handleChildRegionChange = (e) => {
    setSelectedChildRegion(e.target.value);
  };

  return (
    <div id="weatherInfo">
      <div className="weather-container">
        <select
          id="parentRegionSelect"
          onChange={handleParentRegionChange}
          value={selectedParentRegion}
        >
          <option value="">지역 선택</option>
          {[...new Set(regions.map((region) => region.parentRegion))].map(
            (parent) => (
              <option key={parent} value={parent}>
                {parent}
              </option>
            )
          )}
        </select>
        {selectedParentRegion && (
          <select
            id="childRegionSelect"
            onChange={handleChildRegionChange}
            value={selectedChildRegion}
          >
            <option value="">동네 선택</option>
            {childRegions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.childRegion}
              </option>
            ))}
          </select>
        )}
        <div id="weatherInfoText">
          {loading ? (
            "날씨를 확인하세요 !"
          ) : weatherInfo ? (
            <div className="weather-details">
              <div className="weather-detail">
                <span className="weather-label">온도:</span>
                <span className="weather-value">{weatherInfo.temp}℃</span>
              </div>
              <div className="weather-detail">
                <span className="weather-label">습도:</span>
                <span className="weather-value">{weatherInfo.humid}%</span>
              </div>
              <div className="weather-detail">
                <span className="weather-label">강수량:</span>
                <span className="weather-value">
                  {weatherInfo.rainAmount}mm
                </span>
              </div>
              <div className="weather-detail">
                <span className="weather-label">기준 시점:</span>
                <span className="weather-value">
                  {weatherInfo.lastUpdateTime}시
                </span>
              </div>
            </div>
          ) : (
            "날씨를 불러오는 중 오류가 발생했습니다."
          )}
        </div>
        {loading && <i id="weatherSyncIcon" className="bx bx-sync bx-spin"></i>}
      </div>
    </div>
  );
};

export default WeatherInfo;
