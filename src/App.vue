<template>
  <div>
    <nav style="display: flex; gap: 10px; padding: 10px; background: #eee">
      <router-link to="/">Devices</router-link>
      <router-link to="/map">Map</router-link>
      <router-link to="/topology">Topology</router-link>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
router-link {
  text-decoration: none;
  padding: 6px 12px;
  background-color: #42b983;
  color: white;
  border-radius: 4px;
}
router-link:hover {
  background-color: #36996e;
}
</style>
