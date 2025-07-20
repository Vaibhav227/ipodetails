import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/ThemeProvider'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    const audio = new Audio(`${import.meta.env.VITE_CDN_URL}/switch-on.mp3`)
    audio.play()
  }

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={toggleTheme}
      className='relative overflow-hidden border-none'
    >
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-500
        ${
          theme === 'dark'
            ? 'rotate-[-90deg] scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100 animate-glow'
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500
        ${
          theme === 'dark'
            ? 'rotate-0 scale-100 opacity-100 animate-twinkle'
            : 'rotate-90 scale-0 opacity-0'
        }`}
      />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
