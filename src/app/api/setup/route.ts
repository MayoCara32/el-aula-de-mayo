import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  // BUG-03: Proteger la ruta en producción con un token secreto
  if (process.env.NODE_ENV === 'production') {
    const setupToken = request.headers.get('x-setup-token');
    if (!setupToken || setupToken !== process.env.SETUP_SECRET_TOKEN) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // BUG-02: La contraseña viene de una variable de entorno, NO hardcodeada
  const adminPassword = process.env.ADMIN_SETUP_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: 'ADMIN_SETUP_PASSWORD no está definida en las variables de entorno.' },
      { status: 500 }
    );
  }

  try {
    // Check if the admin user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', 'admin')
      .single();

    if (existingUser) {
      return NextResponse.json({ message: 'Admin user already exists' });
    }

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is fine
      throw fetchError;
    }

    // Create the admin user
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const { error: insertError } = await supabase
      .from('admin_users')
      .insert([
        {
          username: 'admin',
          password_hash: passwordHash,
        },
      ]);

    if (insertError) throw insertError;

    return NextResponse.json({ message: 'Admin user created successfully.' });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
