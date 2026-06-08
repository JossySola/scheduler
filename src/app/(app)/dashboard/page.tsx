import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NewTable from './_components/new-table-button'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col h-svh w-full items-center justify-center gap-2">
      <p>
        Hello <span>{data.claims.email}</span>
        <NewTable />
      </p>
      <section>
      </section>
    </div>
  )
}
