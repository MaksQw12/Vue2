<template>
  <div class="content-ping">
    <h1>IP-адрес устройства</h1>
    <div class="input-container">
      <input v-model="ipAddress" type="text" placeholder="Введите IP-адрес устройства" />
      <button @click="ping">Пинг</button>
    </div>
    <div ref="network" class="graph-container"></div>
  </div>
</template>

<script>
import { Network } from 'vis-network/peer';

export default {
  data() {
    return {
      ipAddress: '',
      nodes: [],
      edges: [],
      network: null,
    };
  },
  methods: {
    ping() {
      this.nodes = [
        {
          id: 1,
          label: 'Computer A\nIP: 192.168.0.1',
          title: 'IP: 192.168.0.1',
          shape: 'box',
          color: { background: '#0A3BC5', border: '#FFFFFF' },
        },
        {
          id: 2,
          label: 'Router 1\nIP: 192.168.0.2',
          title: 'IP: 192.168.0.2',
          shape: 'ellipse',
          color: { background: '#1D78FF', border: '#FFFFFF' },
        },
        {
          id: 3,
          label: 'Router 2\nIP: 192.168.0.3',
          title: 'IP: 192.168.0.3',
          shape: 'ellipse',
          color: { background: '#1D78FF', border: '#FFFFFF' },
        },
        {
          id: 4,
          label: 'Computer B\nIP: 192.168.0.4',
          title: 'IP: 192.168.0.4',
          shape: 'box',
          color: { background: '#0A3BC5', border: '#FFFFFF' },
        },
        {
          id: 5,
          label: 'Server\nIP: 192.168.0.5',
          title: 'IP: 192.168.0.5',
          shape: 'box',
          color: { background: '#FF5733', border: '#FFFFFF' },
        },
      ];

      this.edges = [
        { from: 1, to: 2, label: 'Общий', color: 'green' },
        { from: 2, to: 3, label: 'Общий', color: 'green' },
        { from: 3, to: 4, label: 'Общий', color: 'green' },
        { from: 4, to: 5, label: 'Общий', color: 'green' },
      ];

      this.initializeNetwork();
    },

    initializeNetwork() {
      const container = this.$refs.network;
      const data = {
        nodes: this.nodes,
        edges: this.edges,
      };

      const options = {
        physics: {
          enabled: true,
          stabilization: true,
        },
        edges: {
          smooth: { type: 'continuous' },
        },
        nodes: {
          size: 30,
          font: { size: 16 },
        },
        interaction: {
          dragNodes: true,
          zoomView: true,
        },
      };

      this.network = new Network(container, data, options);
    },
  },
};
</script>

<style scoped>
.content-ping {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  align-items: center;
}

.input-container {
  display: flex;
  gap: 10px;
}

input {
  width: 280px;
  border-radius: 10px;
  border: 1px solid gray;
  text-align: center;
}

button {
  background-color: rgb(8, 59, 197);
  width: 120px;
  height: 35px;
  border-radius: 10px;
  color: white;
  cursor: pointer;
}

.graph-container {
  width: 800px;
  height: 400px;
  margin-top: 20px;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
}
</style>
