<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NButton, NInput, NSpin, NImage, N } from 'naive-ui'
import { Play, CheckCircle, XCircle } from 'lucide-vue-next'

interface Video {
  id: number
  title: string
  description: string
  src: string
  keywords: string[]
}

interface Result {
  success: boolean
  message: string
}

const videos: Video[] = [
  {
    id: 1,
    title: 'Nike',
    description: 'Nike shoes ad',
    src: '/videos/nike.mp4',
    keywords: ['nike', 'sneakers', 'white socks', 'concrete stairs', 'low angle shot', 'movement', 'urban environment', 'cityscape', 'step-by-step progression', 'footwear', 'transition']
  },
  {
    id: 2,
    title: 'Tiger',
    description: 'Tiger video',
    src: '/videos/tiger.mp4',
    keywords: ['tiger', 'walking', 'forest', 'path', 'orange', 'black stripes', 'green foliage', 'brown earth', 'natural habitat', 'wildlife', 'movement', 'paw prints', 'tail', 'focus', 'camera', 'environment', 'wild', 'safari', 'jungle', 'predator']
  },
]

const langflowOnline = "http://localhost:8010/proxy/lf/71205138-5f00-4290-9d3d-a76f01eb19c9/api/v1/run/4e33cd6e-0177-4412-ae84-22949648c523"
const langflowUrl = "http://localhost:7868/api/v1/run/314b9422-1529-48d7-9ba4-6115e287b156"

const selectedVideo = ref<Video | null>(null)
const showForm = ref(false)
const userInput = ref('')
const loading = ref(false)
const result = ref<Result | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)

const selectVideo = (video: Video) => {
  selectedVideo.value = video
  showForm.value = false
  userInput.value = ''
  result.value = null
}

const goBack = () => {
  selectedVideo.value = null
  showForm.value = false
  userInput.value = ''
  result.value = null
}

const playVideo = () => {
  if (videoRef.value) {
    videoRef.value.play()
  }
}

const showCaptchaForm = () => {
  showForm.value = true
}

const submitAnswer = () => {
  if (!userInput.value.trim() || !selectedVideo.value) return
  
  loading.value = true
  
  // split the user input by spaces into an array of keywords in the format ['keyword1', 'keyword2', ...]
  const inputKeywords = userInput.value.trim().toLowerCase().split(/\s+/);

  const inputString = `user input:
{0}

computer analysis:
{1}`.replace('{0}', JSON.stringify(inputKeywords)).replace('{1}', JSON.stringify(selectedVideo.value.keywords));


  const payload = {
      "input_value": inputString,
      "output_type": "chat",
      "input_type": "chat",
      "session_id": "test vue session",
  };

  const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  };


  fetch('http://localhost:7868/api/v1/run/314b9422-1529-48d7-9ba4-6115e287b156'
    ,options)
    .then(response => {
      return response.json()
    })
    .then(response => {
      console.log(response)
      console.log(response.outputs[0].outputs[0].results.message.text)
      var finalResponse = response.outputs[0].outputs[0].results.message.text
      result.value = {
        success: true,
        message: finalResponse 
      }
      
      loading.value = false
    })
    .catch(err => {
      console.error(err)
    });
}

</script>

<template>
  <div class="min-h-screen p-8 bg-stone-800">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-left text-white">Why</h1>
      <br/>
      <li>Captchas are too easy nowadays.</li>
      <li>How can I be sure you're not a bot? 🤔</li>
      <li>Value screen real estate can be further monitized.</li>
      <li>More money for everyone (except the user)!</li>
      <br/>
      <div><n-image  
            class="mb-8"
            src="videos/oldcap.png"
            width="500" />
            </div>
      <h1 class="text-3xl font-bold text-left text-white">Human, Please</h1>

      <br/>
      <p>Now you can show ads while your audience is held captive!</p>
      <br/>
      
      <!-- Video Selection -->
      <div v-if="!selectedVideo" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div 
          v-for="video in videos" 
          :key="video.id"
          @click="selectVideo(video)"
          class="bg-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
        >
          <div class="relative aspect-video bg-gray-200">
            <video :src="video.src" class="w-full h-full object-cover" preload="metadata" muted />
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Play class="w-12 h-12 text-white" />
            </div>
          </div>
          <div class="p-4 text-black">
            <h3 class="font-semibold">{{ video.title }}</h3>
            <p class="text-sm text-gray-600">{{ video.description }}</p>
          </div>
        </div>
      </div>

      <!-- Video Player & Captcha -->
      <n-card v-else size="large" style="background-color:#292524;" class="mb-8">
        <n-button type="info" @click="goBack" class="hover:text-blue-800 mb-4" round>
          ← Back
        </n-button>

        <!-- Video -->
        <div class="relative aspect-video bg-black mb-4">
          <video 
            ref="videoRef"
            :src="selectedVideo.src"
            class="w-full h-full"
            @ended="showCaptchaForm"
            @click="playVideo"
            controls
          />
        </div>

        <!-- Form -->
          <div v-if="loading" class="text-center">
            <p>Are you human...</p>
            <n-spin size="large"/>
          </div>

          <div v-else-if="result" class="text-center">
            <div class="mb-4">
              <CheckCircle v-if="result.success" class="w-16 h-16 text-green-500 mx-auto" />
              <XCircle v-else class="w-16 h-16 text-red-500 mx-auto" />
            </div>
            <h3 class="text-white text-xl font-semibold mb-4">
              {{ result.success ? 'Not a bot!' : 'Very bot' }}
            </h3>
            <p class="text-gray-200 mb-4">{{ result.message }}</p>
          </div>

          <div v-else>
            <h3 class="text-xl font-semibold mb-4 text-white">Describe the video in a couple of words</h3>
            <n-spin :show="loading">
              <n-input 
                v-model:value="userInput"
                type="textarea"
                placeholder="Keywords"
                style="background-color:#e7e5e4; color:white;"
                class="bg-gray-100 text-white"
              />
            </n-spin>
            <div class="flex gap-3 mt-4">
              <n-button 
                @click="submitAnswer"
                type="success"
                :disabled="!userInput.trim()"
              >
                Submit
              </n-button>
            </div>
          </div>
      </n-card>

      <h1 class="text-3xl font-bold text-left text-white">How it works</h1>
      <br/>
      <p class="mb-8">AI and Image processing, wow!</p>
        <div><n-image  
        class="mb-8"
        src="videos/langflow.png"
        width="500" />
        </div>
        <div><n-image  
        class="mb-8"
        src="videos/pegasus.png"
        width="500" />
        </div>
    </div>
  </div>
</template>

<style scoped>
/* Base layout */
.min-h-screen {
  min-height: 100vh;
}
.bg-gray-50 {
  background-color: #f9fafb;
}
.p-8 {
  padding: 2rem;
}
.max-w-4xl {
  max-width: 56rem;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

/* Typography */
.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
}
.font-bold {
  font-weight: 700;
}
.text-center {
  text-align: center;
}
.mb-8 {
  margin-bottom: 2rem;
}

/* Grid */
.grid {
  display: grid;
}
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.md\:grid-cols-2 {
  /* fallback, override with media query */
}
.lg\:grid-cols-3 {
  /* fallback, override with media query */
}
.gap-6 {
  gap: 1.5rem;
}

/* Card styles */
.bg-white {
  background-color: white;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
.transition-shadow {
  transition: box-shadow 0.2s;
}
.cursor-pointer {
  cursor: pointer;
}
.overflow-hidden {
  overflow: hidden;
}

/* Video preview */
.relative {
  position: relative;
}
.aspect-video {
  aspect-ratio: 16 / 9;
}
.bg-gray-200 {
  background-color: #e5e7eb;
}
.w-full {
  width: 100%;
}
.h-full {
  height: 100%;
}
.object-cover {
  object-fit: cover;
}
.absolute {
  position: absolute;
}
.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.bg-black\/40 {
  background-color: rgba(0, 0, 0, 0.4);
}
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
/* Padding */
.p-4 {
  padding: 1rem;
}
.p-8 {
  padding: 2rem;
}

/* Text content */
.font-semibold {
  font-weight: 600;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-600 {
  color: #4b5563;
}
.text-black {
  color: #080808;
}
.border-b {
  border-bottom: 1px solid #e5e7eb;
}
.text-blue-600 {
  color: #2563eb;
}
.hover\:text-blue-800:hover {
  color: #1e40af;
}

/* Form states */
.animate-spin {
  animation: spin 1s linear infinite;
}
.border {
  border: 1px solid #d1d5db;
}
.border-4 {
  border-width: 4px;
}
.border-t-transparent {
  border-top-color: transparent;
}
.rounded-full {
  border-radius: 9999px;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.mb-4 {
  margin-bottom: 1rem;
}
.text-xl {
  font-size: 1.25rem;
}
.resize-none {
  resize: none;
}
.h-32 {
  height: 8rem;
}
.w-8 {
  width: 2rem;
}
.h-8 {
  height: 2rem;
}
.w-16 {
  width: 4rem;
}
.h-16 {
  height: 4rem;
}

/* Buttons */
.bg-blue-600 {
  background-color: #2563eb;
}
.bg-blue-700:hover {
  background-color: #1d4ed8;
}
.text-white {
  color: white;
}
.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.rounded {
  border-radius: 0.25rem;
}
.disabled\:bg-gray-400:disabled {
  background-color: #9ca3af;
}
.bg-gray-500 {
  background-color: #6b7280;
}
.bg-gray-600:hover {
  background-color: #4b5563;
}

/* Utility */
.gap-3 {
  gap: 0.75rem;
}
.mt-4 {
  margin-top: 1rem;
}

/* Media queries */
@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
