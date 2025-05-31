<<template>
  <header class="flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-sm">
    <!-- Left section: Logo + Nav -->
    <div class="flex items-center gap-8">
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
            <User class="w-4 h-4"/>
        </div>
        <span class="text-white font-semibold text-xl">Human, Please</span>
      </div>

      <!-- Navigation -->
      <nav class="hidden md:flex items-center gap-6">
        <a href="#" class="text-white hover:text-purple-300 transition-colors">Docs</a>
        <div class="flex items-center gap-1 text-white hover:text-purple-300 cursor-pointer">
          <span>Resources</span>
          <ChevronDown class="w-4 h-4" />
        </div>
        <div class="flex items-center gap-1 text-white hover:text-purple-300 cursor-pointer">
          <span>Community</span>
          <ChevronDown class="w-4 h-4" />
        </div>
      </nav>
    </div>

    <!-- Right section: Stats -->
    <div class="flex items-center gap-4 text-white text-sm">
      <div class="flex items-center gap-1">
        <Github class="w-4 h-4" />
        <span>62k</span>
      </div>
      <div class="flex items-center gap-1">
        <MessageCircle class="w-4 h-4" />
        <span>12k</span>
      </div>
      <div class="flex items-center gap-1">
        <Twitter class="w-4 h-4" />
        <span>8k</span>
      </div>
      <div class="flex items-center gap-1">
        <Youtube class="w-4 h-4" />
        <span>6k</span>
      </div>
    </div>
  </header>
</template>


<script>
import { Github, MessageCircle, Twitter, Youtube, ChevronDown, User } from 'lucide-vue-next'


export default {
  name: 'Header',
  components: {
    Github,
    MessageCircle,
    Twitter,
    Youtube,
    ChevronDown,
    User
  }
}
</script>