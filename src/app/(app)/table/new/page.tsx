import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AiPromptOption from '../_components/ai-prompt-option'

/*
    Sorting, filtering, faceting, grouping,
    aggregation, expansion, selection, sizing,
    pinning, visibility, ordering and pagination
*/
export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col h-svh w-full items-center justify-center gap-2">
      <p>
        Table by <span>{data.claims.email}</span>
      </p>
      <section>
        <AiPromptOption />
      </section>
    </div>
  )
}