<template>
  <header class="header">
    <!-- Left section: Logo + Nav -->
    <div class="left-section">
      <!-- Logo -->
      <div class="logo-container">
        <div class="logo-box">
          <User class="icon" />
        </div>
        <span class="brand-name">Human, Please</span>
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

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(6px);
}

.left-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-box {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(to right, #c084fc, #ec4899);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-name {
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
}

.nav-links {
  display: none;
}

@media (min-width: 768px) {
  .nav-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
}

.nav-links a,
.nav-item {
  color: white;
  cursor: pointer;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-item:hover {
  color: #d8b4fe; /* tailwind's purple-300 */
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  font-size: 0.875rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.icon {
  width: 1rem;
  height: 1rem;
}
</style>
