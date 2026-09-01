import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, X } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n";
import agentIcon from "@/assets/agent-lady.png";

const VISITOR_KEY = "shelco.visitorId";

function getVisitorId() {
  if (typeof window === "undefined") return "server";
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function FloatingChat() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setVisitorId(getVisitorId());
  }, []);

  // Auto-open the assistant 60s after arrival (once per browser session).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem("shelco.chatGreeted")) return;
    const id = window.setTimeout(() => {
      window.sessionStorage.setItem("shelco.chatGreeted", "1");
      setOpen(true);
    }, 60000);
    return () => window.clearTimeout(id);
  }, []);

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, error } = useChat({ transport });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (open && !busy) textareaRef.current?.focus();
  }, [open, busy]);


  const handleSubmit = useCallback(
    (message: { text?: string }, event: React.FormEvent) => {
      event.preventDefault();
      const text = message.text?.trim();
      if (!text || busy) return;
      void sendMessage(
        { text },
        { body: { visitorId: visitorId ?? getVisitorId(), userId: user?.id ?? null } },
      );
    },
    [busy, sendMessage, user?.id, visitorId],
  );

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("chat.open")}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 220, damping: 16 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full brand-gradient py-2 pl-2 pr-4 font-bold text-primary-foreground shadow-glow"
      >
        <motion.img
          src={agentIcon}
          alt=""
          width={96}
          height={96}
          className="h-11 w-11 drop-shadow"
          animate={{ y: [0, -4, 0], rotate: [0, -4, 0, 4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="hidden text-sm sm:inline">{t("chat.open")}</span>
        <MessageCircle className="h-5 w-5 sm:hidden" />
      </motion.button>


      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-3 right-3 z-[60] flex h-[min(420px,60vh)] w-[min(340px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:bottom-4 sm:right-4 sm:h-[min(620px,80vh)] sm:w-[400px]"
          >
            <header className="flex items-center gap-3 border-b border-border px-4 py-3">
              <img src={agentIcon} alt="" className="h-9 w-9 rounded-lg object-contain" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-secondary">{t("chat.title")}</p>
                <p className="truncate text-xs text-muted-foreground">{t("chat.subtitle")}</p>
              </div>
              <button
                type="button"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <Conversation className="flex-1">
              <ConversationContent className="gap-4">
                {messages.length === 0 ? (
                  <p className="px-1 text-sm text-muted-foreground">{t("chat.empty")}</p>
                ) : null}

                {messages.map((message) => {
                  const text = message.parts
                    .map((part) => (part.type === "text" ? part.text : ""))
                    .join("");
                  if (!text) return null;
                  return (
                    <Message key={message.id} from={message.role}>
                      <MessageContent>
                        <MessageResponse>{text}</MessageResponse>
                      </MessageContent>
                    </Message>
                  );
                })}
                {status === "submitted" ? <Shimmer>Thinking…</Shimmer> : null}
                {error ? (
                  <p className="text-sm text-destructive">
                    Sorry, the assistant is unavailable right now. Please call +255 652 808 809.
                  </p>
                ) : null}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            <div className="border-t border-border p-3">
              <PromptInput onSubmit={handleSubmit}>
                <PromptInputTextarea ref={textareaRef} placeholder={t("chat.placeholder")} />
                <PromptInputFooter className="justify-end">
                  <PromptInputSubmit status={status} disabled={busy} />
                </PromptInputFooter>
              </PromptInput>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
