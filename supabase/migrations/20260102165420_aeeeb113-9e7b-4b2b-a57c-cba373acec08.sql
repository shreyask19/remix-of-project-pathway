-- Enable realtime for credits_ledger table for student notifications
ALTER TABLE public.credits_ledger REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.credits_ledger;