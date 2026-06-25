<template>
  <div class="no-results-screen flex flex-col items-center justify-center py-8">
    <!-- Icon -->
    <div class="magnifier-icon max-w-2xs">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="200"
        height="192"
        viewBox="0 0 200 192"
        fill="none"
        class="svg-root"
      >
        <!-- Background large circle -->
        <circle
          cx="98.1063"
          cy="105.796"
          r="62.6786"
          fill="#FAFAFA"
          class="bg-circle"
        />

        <!-- Floating decorative dots -->
        <circle
          cx="39.3563"
          cy="63.4735"
          r="3.92857"
          fill="#E4E2E6"
          class="dot dot-1"
        />
        <circle
          cx="142.749"
          cy="37.9386"
          r="7.32143"
          fill="#E4E2E6"
          class="dot dot-2"
        />
        <circle
          cx="40.6069"
          cy="146.152"
          r="6.96429"
          fill="#E4E2E6"
          class="dot dot-3"
        />
        <circle
          cx="165.249"
          cy="139.367"
          r="6.96429"
          fill="#E4E2E6"
          class="dot dot-4"
        />
        <circle
          cx="151.678"
          cy="147.225"
          r="3.39286"
          fill="#E4E2E6"
          class="dot dot-5"
        />

        <!-- Sparkle stars -->
        <path
          d="M168.521 117.879L169.614 123.046L174.708 124.155L169.614 125.265L168.521 130.432L167.427 125.265L162.334 124.155L167.427 123.046L168.521 117.879Z"
          fill="#B7DFFF"
          class="sparkle sparkle-1"
        />
        <path
          d="M161.98 65.1253C162.06 64.7477 162.599 64.7477 162.679 65.1253L163.375 68.4157C163.404 68.5531 163.511 68.6608 163.649 68.6907L166.914 69.4021C167.289 69.4838 167.289 70.0184 166.914 70.1L163.649 70.8115C163.511 70.8414 163.404 70.949 163.375 71.0865L162.679 74.3768C162.599 74.7544 162.06 74.7544 161.98 74.3768L161.283 71.0865C161.254 70.949 161.147 70.8414 161.01 70.8115L157.744 70.1C157.37 70.0184 157.37 69.4838 157.744 69.4021L161.01 68.6907C161.147 68.6608 161.254 68.5531 161.283 68.4157L161.98 65.1253Z"
          fill="#B7DFFF"
          class="sparkle sparkle-2"
        />
        <path
          d="M32.2936 108.338C32.3735 107.961 32.9125 107.961 32.9924 108.338L34.1863 113.978C34.2154 114.116 34.3224 114.223 34.4597 114.253L40.0416 115.469C40.4165 115.551 40.4165 116.086 40.0416 116.167L34.4597 117.383C34.3224 117.413 34.2154 117.521 34.1863 117.658L32.9924 123.299C32.9125 123.676 32.3735 123.676 32.2936 123.299L31.0998 117.658C31.0707 117.521 30.9637 117.413 30.8264 117.383L25.2444 116.167C24.8696 116.086 24.8696 115.551 25.2444 115.469L30.8264 114.253C30.9637 114.223 31.0707 114.116 31.0998 113.978L32.2936 108.338Z"
          fill="#B7DFFF"
          class="sparkle sparkle-3"
        />
        <path
          d="M54.5447 48.309C54.3377 48.2649 54.3377 47.9694 54.5447 47.9254L57.6753 47.2597C57.7508 47.2436 57.8098 47.1848 57.8262 47.1094L58.5002 44.0009C58.5449 43.7949 58.8388 43.7949 58.8835 44.0009L59.5575 47.1094C59.5739 47.1848 59.6329 47.2436 59.7084 47.2597L62.839 47.9254C63.046 47.9694 63.046 48.2649 62.839 48.309L59.7084 48.9747C59.6329 48.9908 59.5739 49.0496 59.5575 49.1249L58.8835 52.2335C58.8388 52.4395 58.5449 52.4395 58.5002 52.2335L57.8262 49.1249C57.8098 49.0496 57.7508 48.9908 57.6753 48.9747L54.5447 48.309Z"
          fill="#B7DFFF"
          class="sparkle sparkle-4"
        />

        <!-- Magnifier lens (outer) -->
        <circle
          cx="111.142"
          cy="82.7614"
          r="39.7036"
          fill="#D5EBFF"
          stroke="#A5ABB3"
          stroke-width="1.30719"
          class="lens-outer"
        />
        <!-- Magnifier lens (inner) -->
        <circle
          cx="111.143"
          cy="82.7606"
          r="33.275"
          fill="#D5EBFF"
          stroke="#A5ABB3"
          stroke-width="1.30719"
          class="lens-inner"
        />

        <!-- Handle lines -->
        <path
          d="M97.0587 120.014L91.627 128.822"
          stroke="#A5ABB3"
          stroke-width="1.30719"
          class="handle"
        />
        <path
          d="M90.6749 117.156L85.4375 125.012"
          stroke="#A5ABB3"
          stroke-width="1.30719"
          class="handle"
        />

        <!-- Handle body -->
        <path
          d="M89.5965 126.09C91.9786 127.77 92.7786 130.938 91.4803 133.548L77.3146 162.027C74.469 167.747 67.1938 169.585 61.9725 165.902C56.8309 162.276 56.0493 154.956 60.3092 150.326L81.8447 126.918C83.8538 124.734 87.1715 124.38 89.5965 126.09Z"
          fill="#D5EBFF"
          stroke="#A5ABB3"
          stroke-width="1.30719"
          class="handle-body"
        />
      </svg>
    </div>

    <!-- Content -->
    <p class="content-title mt-2 text-2xl font-medium">
      {{ $t("sale.noResult.title") }}
    </p>
    <p class="content-desc mt-1 text-center text-gray-700">
      {{ $t("sale.noResult.description") }}
    </p>
  </div>
</template>

<style scoped>
/* ─── Entrance: whole component fades + rises in ─── */
.no-results-screen {
  animation: screen-enter 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes screen-enter {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ─── SVG root: pops in with a soft scale ─── */
.svg-root {
  animation: svg-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
  transform-origin: center;
}

@keyframes svg-pop {
  from {
    opacity: 0;
    transform: scale(0.82);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ─── Magnifier: gentle continuous float ─── */
.lens-outer,
.lens-inner,
.handle,
.handle-body {
  animation: float 3.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) 0.7s infinite alternate;
  transform-origin: 111px 105px;
}

@keyframes float {
  from { transform: translateY(0px); }
  to   { transform: translateY(-6px); }
}

/* ─── Background circle: subtle inverse float for depth ─── */
.bg-circle {
  animation: float-slow 3.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) 0.7s infinite alternate;
}

@keyframes float-slow {
  from { transform: translateY(0px); }
  to   { transform: translateY(-2px); }
}

/* ─── Decorative dots: each fades in then gently pulses ─── */
.dot {
  opacity: 0;
  animation:
    dot-enter 0.4s ease both,
    dot-pulse 4s ease-in-out infinite alternate;
}

.dot-1 { animation-delay: 0.2s, 0.9s; }
.dot-2 { animation-delay: 0.3s, 1.1s; }
.dot-3 { animation-delay: 0.35s, 1.3s; }
.dot-4 { animation-delay: 0.4s, 1.0s; }
.dot-5 { animation-delay: 0.45s, 1.4s; }

@keyframes dot-enter {
  from { opacity: 0; transform: scale(0); }
  to   { opacity: 1; transform: scale(1); }
}

/* ─── FIX: start from where dot-enter ends to avoid the abrupt jump ─── */
@keyframes dot-pulse {
  from { opacity: 1;   transform: scale(1); }
  to   { opacity: 0.5; transform: scale(1.1); }
}

/* ─── Sparkles: enter staggered, then rotate + scale loop ─── */
.sparkle {
  animation:
    sparkle-enter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both,
    sparkle-spin 5s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: center;
}

.sparkle-1 { animation-delay: 0.5s, 1.2s; }
.sparkle-2 { animation-delay: 0.6s, 1.8s; }
.sparkle-3 { animation-delay: 0.55s, 2.2s; }
.sparkle-4 { animation-delay: 0.65s, 1.5s; }

@keyframes sparkle-enter {
  from { opacity: 0; transform: scale(0) rotate(-30deg); }
  to   { opacity: 1; transform: scale(1) rotate(0deg); }
}

@keyframes sparkle-spin {
  0%   { transform: scale(1)    rotate(0deg); }
  30%  { transform: scale(1.25) rotate(20deg); }
  60%  { transform: scale(0.9)  rotate(-10deg); }
  100% { transform: scale(1)    rotate(0deg); }
}

/* ─── Text: staggered slide-up entrance ─── */
.content-title {
  animation: text-rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both;
}

.content-desc {
  animation: text-rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.68s both;
}

@keyframes text-rise {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
