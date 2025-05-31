<template>
  <div class="min-h-screen bg-gray-50 p-8">
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
          <div class="p-4">
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
