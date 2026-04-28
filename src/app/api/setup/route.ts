import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function GET() {
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
    const passwordHash = await bcrypt.hash('mgmo9397', salt);

    const { error: insertError } = await supabase
      .from('admin_users')
      .insert([
        {
          username: 'admin',
          password_hash: passwordHash,
        },
      ]);

    if (insertError) throw insertError;

    return NextResponse.json({ message: 'Admin user created successfully. Username: admin, Password: (the one you provided)' });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
