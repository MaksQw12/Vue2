<template>
  <div>
    <div class="content-devices">
      <h1>Устройство</h1>
      <select v-model="selectedDevice">
        <option v-for="device in devices" :key="device.ip" :value="device">
          {{ device.name }} ({{ device.ip }})
        </option>
      </select>
    </div>

    <div class="content-coordinates">
      <h1>Координаты назначения</h1>
      <input type="text" v-model="latitude" placeholder="Широта" />
      <input type="text" v-model="longitude" placeholder="Долгота" />
      <button @click="addMarker">Добавить на карту</button>
    </div>

    <div id="map" style="width: 100%; height: 600px; margin-top: 20px"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const devices = ref([]);
const selectedDevice = ref(null);
const latitude = ref('');
const longitude = ref('');
let map;

function getCoordsByIP(ip) {
  const ipCoords = {
    '192.168.0.1': [55.751244, 37.618423],
    '192.168.0.2': [59.9375, 30.3086],
    '192.168.0.3': [56.8389, 60.6057],
  };
  return ipCoords[ip] || [61.524, 105.3188];
}

onMounted(() => {
  const saved = localStorage.getItem('devices');
  if (saved) {
    try {
      devices.value = JSON.parse(saved);
    } catch (e) {
      console.error('Ошибка чтения localStorage', e);
    }
  }

  ymaps.ready(() => {
    map = new ymaps.Map('map', {
      center: [61.524, 105.3188],
      zoom: 4,
    });
  });
});

function addMarker() {
  if (!selectedDevice.value) {
    alert('Выберите устройство');
    return;
  }

  if (!latitude.value || !longitude.value) {
    alert('Введите координаты');
    return;
  }

  const fromCoords = getCoordsByIP(selectedDevice.value.ip);
  const toCoords = [parseFloat(latitude.value), parseFloat(longitude.value)];

  map.geoObjects.removeAll();

  const serverPlacemark = new ymaps.Placemark(
    fromCoords,
    { balloonContent: `${selectedDevice.value.name} (сервер)` },
    {
      iconLayout: 'default#image',
      iconImageHref: 'https://cdn-icons-png.freepik.com/256/1383/1383395.png?semt=ais_hybrid',
      iconImageSize: [40, 40],
      iconImageOffset: [-20, -20],
    },
  );

  const targetPlacemark = new ymaps.Placemark(toCoords, {
    balloonContent: 'Цель',
  });

  const arrowLine = new ymaps.Polyline(
    [fromCoords, toCoords],
    {},
    {
      strokeColor: '#FF0000',
      strokeWidth: 4,
      strokeStyle: 'solid',
    },
  );

  map.geoObjects.add(serverPlacemark);
  map.geoObjects.add(targetPlacemark);
  map.geoObjects.add(arrowLine);

  map.setBounds(ymaps.geoQuery([fromCoords, toCoords]).getBounds(), {
    checkZoomRange: true,
    zoomMargin: 50,
  });
}
</script>

<style scoped>
input {
  width: 180px;
  height: 50px;
  border: 1px solid gray;
  border-radius: 10px;
  text-align: center;
}
button {
  width: 180px;
  height: 50px;
  border-radius: 10px;
  background-color: rgba(4, 20, 163, 0.829);
  color: white;
  cursor: pointer;
}
.content-coordinates {
  display: flex;
  gap: 20px;
  margin-left: 50px;
  margin-top: 20px;
}
.content-devices {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-left: 50px;
  margin-top: 20px;
}
select {
  width: 200px;
  border: 1px solid gray;
}
</style>
