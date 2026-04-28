-- Insert sample courses
INSERT INTO courses (id, name, slug, date, duration, description, is_active) VALUES
(uuid_generate_v4(), 'Desarrollo Web Moderno', 'desarrollo-web-moderno', '2024-01-15', '40 horas', 'Aprende las bases del desarrollo web con HTML, CSS y JavaScript moderno. Un curso diseñado para principiantes que buscan una base sólida.', true),
(uuid_generate_v4(), 'React y Next.js Avanzado', 'react-nextjs-avanzado', '2024-03-10', '60 horas', 'Domina el ecosistema de React y crea aplicaciones web escalables, rápidas y optimizadas para SEO con Next.js y App Router.', true),
(uuid_generate_v4(), 'Bases de Datos con Supabase', 'bases-de-datos-supabase', '2024-05-05', '30 horas', 'Descubre cómo integrar Supabase en tus proyectos. Aprende sobre PostgreSQL, Row Level Security, y autenticación de usuarios.', true);

-- Note: The admin user will be created via a Next.js setup script to securely hash the password.
-- Sample reviews can also be inserted here, but for accurate course_ids, it's better to create them via the app or write a DO block.

DO $$
DECLARE
  course1_id UUID;
  course2_id UUID;
  course3_id UUID;
BEGIN
  SELECT id INTO course1_id FROM courses WHERE slug = 'desarrollo-web-moderno';
  SELECT id INTO course2_id FROM courses WHERE slug = 'react-nextjs-avanzado';
  SELECT id INTO course3_id FROM courses WHERE slug = 'bases-de-datos-supabase';

  -- Reviews for Course 1
  INSERT INTO reviews (course_id, visitor_id, student_name, rating, comment, liked_most, improvement_suggestion, would_recommend, consent_accepted, status) VALUES
  (course1_id, 'vis-1', 'Ana López', 5.0, 'Excelente curso, muy bien explicado todo.', 'La paciencia del profesor', 'Nada, todo perfecto', true, true, 'approved'),
  (course1_id, 'vis-2', 'Carlos G.', 4.5, 'Me gustó mucho la dinámica de las clases.', 'Los ejercicios prácticos', 'Un poco más de tiempo en CSS', true, true, 'approved'),
  (course1_id, 'vis-3', 'Anónimo', 3.0, 'Buen curso pero fue muy rápido para mí.', 'El temario', 'Bajar el ritmo de las clases', true, true, 'pending');

  -- Reviews for Course 2
  INSERT INTO reviews (course_id, visitor_id, student_name, rating, comment, liked_most, improvement_suggestion, would_recommend, consent_accepted, status) VALUES
  (course2_id, 'vis-4', 'David M.', 5.0, 'Next.js es increíble, el curso me ayudó a entender App Router.', 'La claridad de los ejemplos', 'Podría haber más sobre Server Actions', true, true, 'approved'),
  (course2_id, 'vis-5', 'Sofía R.', 5.0, 'El mejor curso de React que he tomado.', 'La arquitectura del proyecto final', 'Ninguna', true, true, 'approved'),
  (course2_id, 'vis-6', 'Luis', 2.0, 'No me gustó el horario.', 'El contenido', 'Cambiar el horario', false, true, 'rejected');

  -- Reviews for Course 3
  INSERT INTO reviews (course_id, visitor_id, student_name, rating, comment, liked_most, improvement_suggestion, would_recommend, consent_accepted, status) VALUES
  (course3_id, 'vis-7', 'Elena', 4.0, 'Supabase es una gran herramienta, buen curso introductorio.', 'Lo fácil que es conectar la base de datos', 'Más ejemplos de RLS', true, true, 'pending');
END $$;
