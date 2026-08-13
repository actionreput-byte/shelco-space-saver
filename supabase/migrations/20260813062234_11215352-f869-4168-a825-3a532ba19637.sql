CREATE TABLE public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  user_id uuid references auth.users(id) on delete set null,
  title text,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);
CREATE UNIQUE INDEX chat_conversations_visitor_idx ON public.chat_conversations(visitor_id);

CREATE TABLE public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  created_at timestamptz not null default now()
);
CREATE INDEX chat_messages_conversation_idx ON public.chat_messages(conversation_id, created_at);

GRANT SELECT ON public.chat_conversations TO authenticated;
GRANT SELECT ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_conversations TO service_role;
GRANT ALL ON public.chat_messages TO service_role;

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own or staff read conversations" ON public.chat_conversations
FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('owner','employee'))
);

CREATE POLICY "Own or staff read messages" ON public.chat_messages
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.chat_conversations c
    WHERE c.id = conversation_id
      AND (
        c.user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('owner','employee'))
      )
  )
);