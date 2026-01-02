-- Phase 1: Remove FK constraints to allow system company, then seed data

-- Drop FK constraints that reference auth.users
ALTER TABLE public.company_profiles 
  DROP CONSTRAINT IF EXISTS company_profiles_user_id_fkey;

ALTER TABLE public.challenges 
  DROP CONSTRAINT IF EXISTS challenges_company_id_fkey;

-- Create system company profile
INSERT INTO public.company_profiles (
  user_id,
  company_name,
  industry,
  description,
  company_size,
  headquarters,
  hiring_roles,
  required_skills
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Heuristic Labs',
  'Education Technology',
  'Official platform challenges designed to help students build real-world skills and earn credits toward their academic goals.',
  '50-200',
  'Global',
  ARRAY['Software Engineer', 'Data Analyst', 'Full Stack Developer', 'ML Engineer'],
  ARRAY['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'TypeScript']
) ON CONFLICT (user_id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  description = EXCLUDED.description;

-- Seed 5 default challenges
INSERT INTO public.challenges (
  company_id,
  title,
  description,
  category,
  difficulty,
  credits,
  required_skills,
  status,
  max_applicants,
  deadline
) VALUES
(
  '00000000-0000-0000-0000-000000000001',
  'Global Supply Chain Data Cleaning',
  'Clean and standardize a dataset of 10,000+ international shipping records. Handle missing values, normalize country codes, and validate date formats. This real-world dataset contains common data quality issues found in enterprise systems.',
  'Data',
  'Easy',
  50,
  ARRAY['Python', 'Pandas', 'Data Cleaning'],
  'active',
  100,
  (CURRENT_DATE + INTERVAL '30 days')::timestamp with time zone
),
(
  '00000000-0000-0000-0000-000000000001',
  'React Dashboard Component Library',
  'Build a production-ready component library for analytics dashboards. Create reusable chart components, data tables with sorting/filtering, and responsive layout components. Follow accessibility guidelines and include comprehensive documentation.',
  'Frontend',
  'Medium',
  75,
  ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Accessibility'],
  'active',
  75,
  (CURRENT_DATE + INTERVAL '45 days')::timestamp with time zone
),
(
  '00000000-0000-0000-0000-000000000001',
  'REST API for E-commerce Platform',
  'Design and implement a scalable REST API for an e-commerce platform. Include endpoints for products, orders, inventory management, and user authentication. Implement proper error handling, rate limiting, and API documentation.',
  'Backend',
  'Medium',
  80,
  ARRAY['Node.js', 'Express', 'PostgreSQL', 'REST API'],
  'active',
  80,
  (CURRENT_DATE + INTERVAL '45 days')::timestamp with time zone
),
(
  '00000000-0000-0000-0000-000000000001',
  'ML-Powered Sentiment Analysis Pipeline',
  'Build an end-to-end NLP pipeline for analyzing customer product reviews. Implement text preprocessing, train a sentiment classification model, and create a simple API for real-time predictions. Include model evaluation metrics and performance benchmarks.',
  'ML',
  'Hard',
  100,
  ARRAY['Python', 'NLP', 'Machine Learning', 'TensorFlow'],
  'active',
  50,
  (CURRENT_DATE + INTERVAL '60 days')::timestamp with time zone
),
(
  '00000000-0000-0000-0000-000000000001',
  'Full Stack Task Management Application',
  'Create a complete task management application with user authentication, real-time updates, team collaboration features, and a polished UI. Deploy to production with proper CI/CD pipeline and monitoring.',
  'Full Stack',
  'Hard',
  120,
  ARRAY['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker'],
  'active',
  40,
  (CURRENT_DATE + INTERVAL '60 days')::timestamp with time zone
)
ON CONFLICT DO NOTHING;