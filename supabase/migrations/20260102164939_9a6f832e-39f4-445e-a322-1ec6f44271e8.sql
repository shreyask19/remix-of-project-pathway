-- Enable realtime for submissions and hiring_pipeline tables
ALTER TABLE public.submissions REPLICA IDENTITY FULL;
ALTER TABLE public.hiring_pipeline REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hiring_pipeline;