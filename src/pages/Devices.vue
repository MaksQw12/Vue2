<template>
  <div class="content-devices">
    <div class="content-search">
      <input
        v-model="search"
        type="text"
        class="input-search"
        placeholder="Введите название устройства..." />
    </div>

    <div class="content-main">
      <div class="content-buttons">
        <h1>Список устройств:</h1>

        <div class="buttons">
          <button @click="onAdd">добавить</button>
          <button @click="onEdit">Редактировать</button>
          <button @click="onDelete">Удалить</button>
        </div>
      </div>

      <div class="content-table">
        <table>
          <thead>
            <tr>
              <th>Название устройства</th>
              <th>Ip-адрес устройства</th>
              <th>Описание устройства</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="device in filteredDevices"
              :key="device.ip"
              :class="{ selected: selectedDevice === device }"
              @click="selectDevice(device)"
              @dblclick="showDeviceDetails(device)">
              <td>{{ device.name }}</td>
              <td>{{ device.ip }}</td>
              <td>{{ device.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="content-ip-info">
      <h1 class="text">Информация от устройства:</h1>

      <div class="content-ip-start">
        <h3>Ip-адрес устройства</h3>
        <input
          v-model="ipInput"
          type="text"
          class="input-search"
          placeholder="Введите Ip-адрес устройства" />
        <button @click="collectData">Запуск сбора</button>
      </div>

      <div class="blocks">
        <div>
          <h1>Статус устройства</h1>
          <p>{{ info.status }}</p>
        </div>
        <div>
          <h1>TCP-порты</h1>
          <p>{{ info.tcp }}</p>
        </div>
        <div>
          <h1>Загрузка процессора</h1>
          <p>{{ info.cpu }}</p>
        </div>
        <div>
          <h1>Свободное дисковое пространство</h1>
          <p>{{ info.disk }}</p>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isLoginModalVisible" class="modal">
    <div class="modal-content">
      <h2>Введите логин и пароль</h2>
      <div>
        <label>Логин:</label>
        <input v-model="login" placeholder="Введите логин" />
      </div>
      <div>
        <label>Пароль:</label>
        <input type="password" v-model="password" placeholder="Введите пароль" />
      </div>
      <div class="modal-actions">
        <button @click="connectDevice">Подключиться</button>
        <button @click="cancelConnection">Отмена</button>
      </div>
    </div>
  </div>

  <div v-if="isModalVisible" class="modal">
    <div class="modal-content">
      <h2>{{ isEditing ? 'Редактировать устройство' : 'Добавить устройство' }}</h2>
      <div>
        <label>Название устройства:</label>
        <input v-model="modalDevice.name" placeholder="Введите название устройства" />
      </div>
      <div>
        <label>IP-адрес устройства:</label>
        <input v-model="modalDevice.ip" placeholder="Введите IP-адрес устройства" />
      </div>
      <div>
        <label>Описание устройства:</label>
        <input v-model="modalDevice.description" placeholder="Введите описание устройства" />
      </div>

      <table>
        <thead>
          <tr>
            <th>Характеристика</th>
            <th>Единица измерения</th>
            <th>Значение</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(characteristic, index) in modalDevice.characteristics" :key="index">
            <td><input v-model="characteristic.name" placeholder="Введите характеристику" /></td>
            <td><input v-model="characteristic.unit" placeholder="Введите единицу измерения" /></td>
            <td><input v-model="characteristic.value" placeholder="Введите значение" /></td>
          </tr>
        </tbody>
      </table>

      <button @click="addCharacteristic">Добавить характеристику</button>

      <div class="modal-actions">
        <button @click="saveDevice">Сохранить</button>
        <button @click="cancelModal">Отмена</button>
      </div>
    </div>
  </div>

  <div v-if="isDeleteModalVisible" class="modal">
    <div class="modal-content">
      <h2>Вы уверены, что хотите удалить это устройство?</h2>
      <div class="modal-actions">
        <button @click="confirmDelete">Да</button>
        <button @click="cancelDelete">Отмена</button>
      </div>
    </div>
  </div>

  <div v-if="isDetailsModalVisible" class="modal">
    <div class="modal-content">
      <h2>{{ selectedDevice.name }}</h2>
      <table>
        <thead>
          <tr>
            <th>Характеристика</th>
            <th>Единица измерения</th>
            <th>Значение</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(characteristic, index) in selectedDevice.characteristics" :key="index">
            <td>{{ characteristic.name }}</td>
            <td>{{ characteristic.unit }}</td>
            <td>{{ characteristic.value }}</td>
          </tr>
        </tbody>
      </table>
      <div class="modal-actions">
        <button @click="closeDetails">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const search = ref('');
const ipInput = ref('');
const selectedDevice = ref(null);
const devices = ref([]);

function loadDevices() {
  const storedDevices = localStorage.getItem('devices');
  if (storedDevices) {
    devices.value = JSON.parse(storedDevices);
  }
}

const filteredDevices = computed(() =>
  devices.value.filter((d) => d.name.toLowerCase().includes(search.value.toLowerCase())),
);

const info = ref({
  status: 'не в сети',
  tcp: 'нет данных',
  cpu: 'нет данных',
  disk: 'нет данных',
});

const isEditing = ref(false);
const isModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const isDetailsModalVisible = ref(false);
const isLoginModalVisible = ref(false);

const login = ref('');
const password = ref('');

const modalDevice = ref({
  name: '',
  ip: '',
  description: '',
  characteristics: [],
});

onMounted(() => {
  loadDevices();
});

function saveDevicesToLocalStorage() {
  localStorage.setItem('devices', JSON.stringify(devices.value));
}

function selectDevice(device) {
  selectedDevice.value = device;
}

function showDeviceDetails(device) {
  selectedDevice.value = device;
  isDetailsModalVisible.value = true;
}

function onAdd() {
  modalDevice.value = { name: '', ip: '', description: '', characteristics: [] };
  isEditing.value = false;
  isModalVisible.value = true;
}

function onEdit() {
  if (!selectedDevice.value) return alert('Выберите устройство для редактирования');
  modalDevice.value = { ...selectedDevice.value };
  isEditing.value = true;
  isModalVisible.value = true;
}

function onDelete() {
  if (!selectedDevice.value) return alert('Выберите устройство для удаления');
  isDeleteModalVisible.value = true;
}

function confirmDelete() {
  devices.value = devices.value.filter((d) => d !== selectedDevice.value);
  selectedDevice.value = null;
  saveDevicesToLocalStorage();
  isDeleteModalVisible.value = false;
}

function cancelDelete() {
  isDeleteModalVisible.value = false;
}

function addCharacteristic() {
  modalDevice.value.characteristics.push({ name: '', unit: '', value: '' });
}

function saveDevice() {
  if (isEditing.value) {
    const index = devices.value.findIndex((d) => d.ip === selectedDevice.value.ip);
    if (index !== -1) {
      devices.value[index] = { ...modalDevice.value };
    }
  } else {
    devices.value.push({ ...modalDevice.value });
  }

  saveDevicesToLocalStorage();
  cancelModal();
}

function cancelModal() {
  isModalVisible.value = false;
}

function closeDetails() {
  isDetailsModalVisible.value = false;
}

function collectData() {
  if (!ipInput.value) return alert('Введите IP-адрес');
  isLoginModalVisible.value = true;
}

function connectDevice() {
  if (!login.value || !password.value) return alert('Заполните логин и пароль');
  info.value = { status: 'в сети', tcp: '443, 80', cpu: '40%', disk: '500 ГБ' };
  isLoginModalVisible.value = false;
}

function cancelConnection() {
  isLoginModalVisible.value = false;
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-actions button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.modal-actions button:hover {
  background-color: #0056b3;
}
.modal-content input {
  margin: 10px 0;
  padding: 10px;
  width: 100%;
}
.modal-content button {
  width: 100px;
  height: 35px;
  margin: 10px;
  background-color: rgb(7, 7, 204);
  color: white;
  cursor: pointer;
  border-radius: 8px;
}
.selected {
  background-color: rgba(0, 0, 255, 0.1);
}
.blocks {
  display: flex;
  justify-content: space-around;
  margin-top: 80px;
}

.blocks div {
  width: 340px;
  height: 180px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  color: black;
  text-align: center;
}
.blocks div:nth-child(1) {
  background-color: rgb(43, 224, 164);
}
.blocks div:nth-child(2) {
  background-color: rgb(131, 131, 131);
}
.blocks div:nth-child(3) {
  background-color: rgb(231, 84, 84);
}
.blocks div:nth-child(4) {
  background-color: rgb(131, 131, 131);
}
.text {
  margin-left: 295px;
}
.content-ip-start {
  display: flex;
  justify-content: start;
  margin-left: 295px;
  gap: 25px;
  align-items: center;
  margin-top: 10px;
}
.content-ip-info {
  width: 100%;
  margin-top: 50px;
}
.content-main {
  margin-top: 50px;
}
.buttons {
  display: flex;
  gap: 10px;
}
.content-buttons {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
button {
  width: 120px;
  height: 40px;
  border-radius: 10px;
  background-color: rgb(7, 7, 204);
  color: white;
  cursor: pointer;
}
.content-devices {
  width: 100%;
  height: 100%;
}

.content-search {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}

.input-search {
  width: 300px;
  height: 40px;
  border-radius: 10px;
  padding: 10px;
  font-size: 18px;
}
.content-table {
  margin-top: 40px;
  margin-left: 250px;
  margin-right: 250px;
}
table {
  width: 100%;
  border: 1px solid #000;
  border-collapse: collapse;
  padding: 10px;
}
th,
td {
  padding: 15px;
  text-align: center;
  border: 1px solid #000;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 800px;
  text-align: center;
}
.modal-actions {
  margin-top: 20px;
}
button {
  width: 100px;
  height: 35px;
  margin: 10px;
  background-color: rgb(7, 7, 204);
  color: white;
  cursor: pointer;
  border-radius: 8px;
}
</style>
