<template>
  <div class="app-content bubbles">
    <svg class="blob" viewBox="-10 -20 550 980" preserveAspectRatio="none">
      <rect x="0" y="0" width="540" height="960" opacity="0" fill="#FFFF00"></rect>
      <g transform="translate(-230 -40) scale(1.33, 1.73)">
        <path
          d="M 200 500 Q 150 400 200 300 Q 250 200 200 50 Q 500 0 550 50 C 600 200 500 150 550 250 C 600 300 500 400 550 450 A 100 50 0 1 1 200 500"
          opacity="1.0"
          fill="#FFFFFF"
        ></path>
      </g>
    </svg>
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.app-content {
  background-color: white;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  padding: 20px;

  display: flex;
  justify-content: center;

  /* Optional: full height minus margin if needed */
  min-height: calc(100vh);
  overflow-y: auto;
}

.bubbles {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -20;
  width: 100vw;
  height: 100vh;
  background-image: radial-gradient(green 0.01vw, transparent 1.5px);
  background-size: 10px 10px;
  background-position:
    0 0,
    5px 5px;
  background-repeat: repeat;
}

.blob {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -19;
  width: 100%;
  height: 100%;
}
</style>
