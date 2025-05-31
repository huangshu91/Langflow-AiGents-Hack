<template>
  <div class="min-h-screen p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8">Video Captcha</h1>
      
      <!-- Video Selection -->
      <div v-if="!selectedVideo" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="video in videos" 
          :key="video.id"
          @click="selectVideo(video)"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
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
      <div v-else class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="p-4 border-b">
          <button @click="goBack" class="text-blue-600 hover:text-blue-800">
            ← Back to videos
          </button>
        </div>

        <!-- Video -->
        <div v-if="!showForm" class="relative aspect-video bg-black">
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
        <div v-else class="p-8">
          <div v-if="loading" class="text-center">
            <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Checking your answer...</p>
          </div>

          <div v-else-if="result" class="text-center">
            <div class="mb-4">
              <CheckCircle v-if="result.success" class="w-16 h-16 text-green-500 mx-auto" />
              <XCircle v-else class="w-16 h-16 text-red-500 mx-auto" />
            </div>
            <h3 class="text-xl font-semibold mb-2">
              {{ result.success ? 'Correct!' : 'Try Again' }}
            </h3>
            <p class="text-gray-600 mb-4">{{ result.message }}</p>
            <button 
              @click="reset"
              class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {{ result.success ? 'Next Video' : 'Retry' }}
            </button>
          </div>

          <div v-else>
            <h3 class="text-xl font-semibold mb-4">What did you see in the video?</h3>
            <textarea 
              v-model="userInput"
              placeholder="Describe what you saw..."
              class="w-full h-32 p-3 border rounded-lg resize-none"
            ></textarea>
            <div class="flex gap-3 mt-4">
              <button 
                @click="submitAnswer"
                :disabled="!userInput.trim()"
                class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                Submit
              </button>
              <button 
                @click="reset"
                class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
    description: 'nike shoes advert',
    src: '/videos/nike.mp4',
    keywords: ['beach', 'waves', 'ocean', 'sand']
  },
  {
    id: 2,
    title: 'Tiger',
    description: 'cool tiger video',
    src: '/videos/tiger.mp4',
    keywords: ['city', 'street', 'buildings', 'urban']
  },
  {
    id: 3,
    title: 'Nike Again',
    description: 'nike againnnn',
    src: '/videos/nike.mp4',
    keywords: ['forest', 'trees', 'nature', 'green']
  }
]

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

const submitAnswer = async () => {
  if (!userInput.value.trim() || !selectedVideo.value) return
  
  loading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const input = userInput.value.toLowerCase()
  const keywords = selectedVideo.value.keywords
  const hasMatch = keywords.some(keyword => input.includes(keyword))
  
  result.value = {
    success: hasMatch,
    message: hasMatch 
      ? 'Great! You correctly identified the content.'
      : 'Not quite right. Try again or skip to the next video.'
  }
  
  loading.value = false
}

const reset = () => {
  if (result.value?.success) {
    goBack() // Go back to video selection on success
  } else {
    // Reset for retry
    result.value = null
    userInput.value = ''
  }
}
</script>

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