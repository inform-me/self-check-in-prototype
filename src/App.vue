<template>
  <div class="app-content">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.app-content {
  margin-top: 100px;
  background-color: white;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  padding: 20px;

  display: flex;
  justify-content: center;

  /* Optional: full height minus margin if needed */
  min-height: calc(100vh - 80px);
}
</style>
