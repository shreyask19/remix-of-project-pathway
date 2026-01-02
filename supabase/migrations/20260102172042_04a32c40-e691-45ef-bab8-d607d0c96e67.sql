-- Add remaining tables to realtime (submissions already added)
DO $$ 
BEGIN
  -- Try to add notifications if not already added
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  
  -- Try to add hiring_pipeline if not already added
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.hiring_pipeline;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  
  -- Try to add invitations if not already added
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.invitations;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;

-- Set replica identity to full for complete row data in updates
ALTER TABLE public.submissions REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.hiring_pipeline REPLICA IDENTITY FULL;
ALTER TABLE public.invitations REPLICA IDENTITY FULL;