import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold font-display text-stone-900 mb-6">Todos (Supabase Demo)</h1>
      <ul className="space-y-3 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        {todos && todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100 hover:border-red-100 hover:bg-red-50/10 transition-all duration-200">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="font-medium text-stone-700">{todo.name}</span>
            </li>
          ))
        ) : (
          <li className="text-stone-500 italic p-3 text-center">No todos found or Supabase table "todos" is empty.</li>
        )}
      </ul>
    </div>
  )
}
