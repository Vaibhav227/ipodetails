import { useState, useEffect } from 'react'
import { type Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router'
import { Skeleton } from '~/components/ui/skeleton'
import userStore from '~/store'
import { Button } from '~/components/ui/button'

export default function Authentication() {
  const [session, setSession] = useState<Session | null>(null)
  const [isPageMounted, setIsPageMounted] = useState(false)
  const navigate = useNavigate()
  const { setUser } = userStore()

  useEffect(() => {
    setIsPageMounted(true)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [navigate, isPageMounted])

  useEffect(() => {
    if (session) {
      setUser({
        name: session.user.user_metadata.full_name,
        email: session.user.email,
        avatar: session.user.user_metadata.avatar_url,
      })
    }
  }, [session])

  const signup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    console.log('signing in')
  }

  if (!session && isPageMounted) {
    return (
      <div className='h-[calc(100dvh)] w-full flex flex-col gap-8 items-center justify-center'>
        <Button onClick={signup}>Sign up with Google</Button>
      </div>
    )
  } else if (!isPageMounted) {
    return (
      <div className='w-full h-[calc(100dvh)] flex flex-col gap-8 items-center justify-center'>
        <Skeleton className='w-[60%] h-16' />
        <Skeleton className='w-[60%] h-16' />
        <Skeleton className='w-[60%] h-16' />
        <Skeleton className='w-[60%] h-16' />
      </div>
    )
  }
}
