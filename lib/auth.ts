import { cookies } from 'next/headers';
import { supabase, supabaseAdmin } from './supabase';
import { signSession, verifySession } from './session';

export interface SessionData {
  userId: string;
  email: string;
  role: 'admin' | 'client';
}

// Read Session from cookies on the server
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('client_portal_session');
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    // Verify the HMAC signature FIRST — forged cookies are rejected here.
    const data = (await verifySession(sessionCookie.value)) as SessionData | null;
    if (!data) {
      return null;
    }
    
    // Validate that the profile still exists in Supabase and use the DB role
    // as the source of truth (never the cookie).
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role')
      .eq('id', data.userId)
      .single();

    if (error || !profile) {
      return null;
    }
    
    return {
      userId: profile.id,
      email: profile.email,
      role: profile.role as 'admin' | 'client',
    };
  } catch (e) {
    return null;
  }
}

// Login Action
export async function loginUser(email: string, passwordHash: string): Promise<{ success: boolean; error?: string; role?: 'admin' | 'client' }> {
  try {
    // Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: passwordHash, // Note: the login form sends the raw password as "passwordHash"
    });

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || 'Invalid email or password' };
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: 'User profile not found.' };
    }

    // Create Session — payload is HMAC-signed so it cannot be forged
    const sessionData: SessionData = {
      userId: authData.user.id,
      email: authData.user.email || email,
      role: profile.role as 'admin' | 'client',
    };
    
    const signedSession = await signSession(sessionData);
    
    // Set Cookie
    const cookieStore = await cookies();
    cookieStore.set('client_portal_session', signedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    return { success: true, role: profile.role as 'admin' | 'client' };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred during login.' };
  }
}

// Logout Action
export async function logoutUser(): Promise<void> {
  // Sign out from Supabase Auth
  await supabase.auth.signOut();
  
  const cookieStore = await cookies();
  cookieStore.delete('client_portal_session');
}
