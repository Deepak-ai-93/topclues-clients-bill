'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabase, supabaseAdmin } from './supabase';
import { getSession, loginUser, logoutUser } from './auth';

// ==========================================
// ADMIN ACTIONS
// ==========================================

export async function hasAdminUser() {
  try {
    const { count, error } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');

    if (error) {
      console.error('Error checking admin presence:', error);
      return { hasAdmin: false };
    }
    return { hasAdmin: (count || 0) > 0 };
  } catch {
    return { hasAdmin: false };
  }
}

export async function setupInitialAdmin(data: { email: string; password: string; setupKey?: string }) {
  try {
    // Require the setup key (ADMIN_SETUP_SECRET) so strangers cannot claim
    // the first admin account on a fresh deployment.
    const expectedKey = process.env.ADMIN_SETUP_SECRET;
    if (!expectedKey) {
      return { success: false, error: 'First-time admin setup is disabled. Create the admin account via the database seed script instead.' };
    }
    if (!data.setupKey || data.setupKey !== expectedKey) {
      return { success: false, error: 'Invalid setup key. Ask the Topclues agency for the admin setup key.' };
    }

    // Check if an admin already exists
    const { hasAdmin } = await hasAdminUser();
    if (hasAdmin) {
      return { success: false, error: 'An admin account already exists.' };
    }

    // Create admin user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email.toLowerCase().trim(),
      password: data.password,
      email_confirm: true,
      user_metadata: { role: 'admin', name: 'System Admin' }
    });

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || 'Failed to create admin user.' };
    }

    // Create admin profile in profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: data.email.toLowerCase().trim(),
        name: 'System Admin',
        role: 'admin'
      });

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred during admin setup.' };
  }
}

export async function createClient(data: {
  clientName: string;
  email: string;
  password?: string;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    const clientPassword = data.password && data.password.trim().length > 0
      ? data.password.trim()
      : `Client_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email.toLowerCase().trim(),
      password: clientPassword,
      email_confirm: true,
      user_metadata: { role: 'client', name: data.clientName }
    });

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || 'Failed to create user in Supabase Auth' };
    }

    // Create profile in profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: data.email.toLowerCase().trim(),
        name: data.clientName,
        role: 'client'
      });

    if (profileError) {
      // Clean up the created auth user if profile insertion failed
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return { success: false, error: profileError.message };
    }

    revalidatePath('/admin/clients');
    return { success: true, clientPassword, clientId: authData.user.id };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred during client creation.' };
  }
}

export async function updateClient(clientId: string, data: {
  clientName: string;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ name: data.clientName })
      .eq('id', clientId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/clients');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred during client update.' };
  }
}

export async function regeneratePassword(clientId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    const newTempPassword = `Pass_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const { error } = await supabaseAdmin.auth.admin.updateUserById(clientId, {
      password: newTempPassword
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, newTempPassword };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred during password regeneration.' };
  }
}

export async function deleteClient(clientId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    // Deleting the user from Supabase Auth will automatically delete their profile
    // and their billing documents due to ON DELETE CASCADE references.
    const { error } = await supabaseAdmin.auth.admin.deleteUser(clientId);
    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/clients');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred during client deletion.' };
  }
}

export async function getAdminClientsPageData() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const { data: clients, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('role', 'client')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching clients:', error);
    return { clients: [] };
  }

  return { clients: clients || [] };
}

export async function getAdminDashboardData() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const { count: clientsCount } = await supabaseAdmin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'client');

  const { count: documentsCount } = await supabaseAdmin
    .from('billing_documents')
    .select('*', { count: 'exact', head: true });

  const { count: contentCount } = await supabaseAdmin
    .from('content_calendars')
    .select('*', { count: 'exact', head: true });

  const { count: leadsCount } = await supabaseAdmin
    .from('leads')
    .select('*', { count: 'exact', head: true });

  // Get 5 most recent documents
  const { data: recentDocuments } = await supabaseAdmin
    .from('billing_documents')
    .select('*, client:profiles(name, email)')
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    totalClients: clientsCount || 0,
    totalDocuments: documentsCount || 0,
    totalContent: contentCount || 0,
    totalLeads: leadsCount || 0,
    recentDocuments: recentDocuments || [],
  };
}

export async function getAdminBillingData() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const { data: clients } = await supabaseAdmin
    .from('profiles')
    .select('id, name, email')
    .eq('role', 'client')
    .order('name');

  const { data: documents } = await supabaseAdmin
    .from('billing_documents')
    .select('*, client:profiles(name, email)')
    .order('billing_date', { ascending: false });

  return {
    clients: clients || [],
    documents: documents || [],
  };
}

// Upload a billing document
export async function uploadBillingDocument(data: {
  clientId: string;
  title: string;
  billingDate: string;
  pdfName: string;
  pdfBase64: string; // Base64 encoded string from client
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    // 1. Convert base64 back to buffer for uploading to storage
    const base64Data = data.pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    const fileBuffer = Buffer.from(base64Data, 'base64');

    // Make sure bucket exists
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.some(b => b.name === 'billing-documents')) {
      await supabaseAdmin.storage.createBucket('billing-documents', {
        public: false // private bucket, we will generate signed URLs
      });
    }

    // 2. Upload file to Supabase Storage
    const fileName = `${data.clientId}/${Date.now()}-${data.pdfName}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('billing-documents')
      .upload(fileName, fileBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return { success: false, error: `Storage upload failed: ${uploadError.message}` };
    }

    // 3. Save link to billing_documents table
    const { error: dbError } = await supabaseAdmin
      .from('billing_documents')
      .insert({
        client_id: data.clientId,
        title: data.title,
        billing_date: data.billingDate,
        pdf_url: fileName,
        pdf_name: data.pdfName
      });

    if (dbError) {
      // Clean up uploaded file if DB insert fails
      await supabaseAdmin.storage.from('billing-documents').remove([fileName]);
      return { success: false, error: `Database insert failed: ${dbError.message}` };
    }

    revalidatePath('/admin/billing');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred during billing upload.' };
  }
}

export async function deleteBillingDocument(documentId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    // Fetch the document first to get the pdf_url
    const { data: doc } = await supabaseAdmin
      .from('billing_documents')
      .select('pdf_url')
      .eq('id', documentId)
      .single();

    if (doc?.pdf_url) {
      // Remove from storage
      await supabaseAdmin.storage.from('billing-documents').remove([doc.pdf_url]);
    }

    // Delete from DB
    const { error } = await supabaseAdmin
      .from('billing_documents')
      .delete()
      .eq('id', documentId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/billing');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred during billing document deletion.' };
  }
}

// ==========================================
// CLIENT ACTIONS
// ==========================================

export async function getClientDashboardData() {
  const session = await getSession();
  if (!session || session.role !== 'client') {
    throw new Error('Unauthorized');
  }

  // Get profile
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', session.userId)
    .single();

  // Get billing documents for client
  const { data: documents } = await supabaseAdmin
    .from('billing_documents')
    .select('*')
    .eq('client_id', session.userId)
    .order('billing_date', { ascending: false });

  return {
    clientProfile: profile || { name: 'Valued Client', email: session.email },
    documents: documents || [],
  };
}

// Generate a signed URL for client downloading their billing document safely
export async function downloadBillingDocument(documentId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  try {
    // Fetch the document to verify client owns it, or if admin
    const { data: doc, error } = await supabaseAdmin
      .from('billing_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (error || !doc) {
      return { success: false, error: 'Document not found.' };
    }

    // Security Check: Clients can only access their own documents
    if (session.role === 'client' && doc.client_id !== session.userId) {
      return { success: false, error: 'Access denied.' };
    }

    // Generate signed URL
    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from('billing-documents')
      .createSignedUrl(doc.pdf_url, 300); // 5 mins validity

    if (signedError || !signedData?.signedUrl) {
      return { success: false, error: signedError?.message || 'Could not generate download link.' };
    }

    return { success: true, url: signedData.signedUrl };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred while preparing download.' };
  }
}

// ==========================================
// ANALYTICS REPORTS ACTIONS
// ==========================================

export async function getAdminReportsData() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const { data: clients } = await supabaseAdmin
    .from('profiles')
    .select('id, name, email')
    .eq('role', 'client')
    .order('name');

  const { data: reports, error } = await supabaseAdmin
    .from('analytics_reports')
    .select('*, client:profiles(name, email)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reports:', error);
    return { reports: [], clients: clients || [] };
  }

  return { reports: reports || [], clients: clients || [] };
}

export async function uploadReport(data: {
  clientId: string;
  title: string;
  reportType: string;
  reportPeriod: string;
  platform: string;
  notes: string;
  pdfBase64: string;
  pdfName: string;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    const base64Data = data.pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    const fileBuffer = Buffer.from(base64Data, 'base64');

    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.some(b => b.name === 'analytics-reports')) {
      await supabaseAdmin.storage.createBucket('analytics-reports', {
        public: false
      });
    }

    const fileName = `${data.clientId}/${Date.now()}-${data.pdfName}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('analytics-reports')
      .upload(fileName, fileBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return { success: false, error: `Storage upload failed: ${uploadError.message}` };
    }

    const { error: dbError } = await supabaseAdmin
      .from('analytics_reports')
      .insert({
        client_id: data.clientId,
        title: data.title,
        report_type: data.reportType,
        report_period: data.reportPeriod,
        platform: data.platform,
        pdf_url: fileName,
        pdf_name: data.pdfName,
        notes: data.notes || null
      });

    if (dbError) {
      await supabaseAdmin.storage.from('analytics-reports').remove([fileName]);
      return { success: false, error: `Database insert failed: ${dbError.message}` };
    }

    revalidatePath('/admin/reports');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred during report upload.' };
  }
}

export async function deleteReport(reportId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    const { data: report } = await supabaseAdmin
      .from('analytics_reports')
      .select('pdf_url')
      .eq('id', reportId)
      .single();

    if (report?.pdf_url) {
      await supabaseAdmin.storage.from('analytics-reports').remove([report.pdf_url]);
    }

    const { error } = await supabaseAdmin
      .from('analytics_reports')
      .delete()
      .eq('id', reportId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/reports');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred during report deletion.' };
  }
}

export async function getClientReports() {
  const session = await getSession();
  if (!session || session.role !== 'client') {
    throw new Error('Unauthorized');
  }

  const { data: reports, error } = await supabaseAdmin
    .from('analytics_reports')
    .select('*')
    .eq('client_id', session.userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching client reports:', error);
    return { reports: [] };
  }

  return { reports: reports || [] };
}

export async function downloadReport(reportId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  try {
    const { data: report, error } = await supabaseAdmin
      .from('analytics_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error || !report) {
      return { success: false, error: 'Report not found.' };
    }

    if (session.role === 'client' && report.client_id !== session.userId) {
      return { success: false, error: 'Access denied.' };
    }

    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from('analytics-reports')
      .createSignedUrl(report.pdf_url, 300);

    if (signedError || !signedData?.signedUrl) {
      return { success: false, error: signedError?.message || 'Could not generate download link.' };
    }

    return { success: true, url: signedData.signedUrl };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred while preparing download.' };
  }
}

// ==========================================
// CONTENT CALENDAR ACTIONS
// ==========================================

export async function getAdminContentData() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const { data: clients } = await supabaseAdmin
    .from('profiles')
    .select('id, name, email')
    .eq('role', 'client')
    .order('name');

  const { data: entries, error } = await supabaseAdmin
    .from('content_calendars')
    .select('*, client:profiles(name, email)')
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Error fetching content:', error);
    return { entries: [], clients: clients || [] };
  }

  return { entries: entries || [], clients: clients || [] };
}

export async function createContentEntry(data: {
  clientId: string;
  title: string;
  description: string;
  platform: string;
  publishDate: string;
  status: string;
  pdfBase64?: string;
  pdfName?: string;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    let assetUrl = '';
    let assetName = '';

    if (data.pdfBase64 && data.pdfName) {
      const base64Data = data.pdfBase64.replace(/^data:application\/\w+;base64,/, '');
      const fileBuffer = Buffer.from(base64Data, 'base64');

      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      if (!buckets?.some(b => b.name === 'content-assets')) {
        await supabaseAdmin.storage.createBucket('content-assets', { public: false });
      }

      const fileName = `${data.clientId}/${Date.now()}-${data.pdfName}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from('content-assets')
        .upload(fileName, fileBuffer, {
          contentType: 'application/pdf',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        return { success: false, error: `Storage upload failed: ${uploadError.message}` };
      }

      assetUrl = fileName;
      assetName = data.pdfName;
    }

    const { error } = await supabaseAdmin
      .from('content_calendars')
      .insert({
        client_id: data.clientId,
        title: data.title,
        description: data.description,
        platform: data.platform,
        publish_date: data.publishDate,
        status: data.status,
        asset_url: assetUrl,
        asset_name: assetName
      });

    if (error) {
      if (assetUrl) {
        await supabaseAdmin.storage.from('content-assets').remove([assetUrl]);
      }
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/content');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred while creating content entry.' };
  }
}

export async function updateContentEntry(entryId: string, data: {
  title: string;
  description: string;
  platform: string;
  publishDate: string;
  status: string;
  pdfBase64?: string;
  pdfName?: string;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    let assetUrl: string | undefined;
    let assetName: string | undefined;

    if (data.pdfBase64 && data.pdfName) {
      const base64Data = data.pdfBase64.replace(/^data:application\/\w+;base64,/, '');
      const fileBuffer = Buffer.from(base64Data, 'base64');

      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      if (!buckets?.some(b => b.name === 'content-assets')) {
        await supabaseAdmin.storage.createBucket('content-assets', { public: false });
      }

      const fileName = `entry/${entryId}/${Date.now()}-${data.pdfName}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from('content-assets')
        .upload(fileName, fileBuffer, {
          contentType: 'application/pdf',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        return { success: false, error: `Storage upload failed: ${uploadError.message}` };
      }

      assetUrl = fileName;
      assetName = data.pdfName;
    }

    const updateData: any = {
      title: data.title,
      description: data.description,
      platform: data.platform,
      publish_date: data.publishDate,
      status: data.status
    };

    if (assetUrl !== undefined) {
      updateData.asset_url = assetUrl;
      updateData.asset_name = assetName;
    }

    const { error } = await supabaseAdmin
      .from('content_calendars')
      .update(updateData)
      .eq('id', entryId);

    if (error) {
      if (assetUrl) {
        await supabaseAdmin.storage.from('content-assets').remove([assetUrl]);
      }
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/content');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred while updating content entry.' };
  }
}

export async function deleteContentEntry(entryId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    const { data: entry } = await supabaseAdmin
      .from('content_calendars')
      .select('asset_url')
      .eq('id', entryId)
      .single();

    if (entry?.asset_url) {
      await supabaseAdmin.storage.from('content-assets').remove([entry.asset_url]);
    }

    const { error } = await supabaseAdmin
      .from('content_calendars')
      .delete()
      .eq('id', entryId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/content');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred during deletion.' };
  }
}

export async function downloadContentAsset(entryId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  try {
    const { data: entry, error } = await supabaseAdmin
      .from('content_calendars')
      .select('*')
      .eq('id', entryId)
      .single();

    if (error || !entry || !entry.asset_url) {
      return { success: false, error: 'Asset not found.' };
    }

    if (session.role === 'client' && entry.client_id !== session.userId) {
      return { success: false, error: 'Access denied.' };
    }

    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from('content-assets')
      .createSignedUrl(entry.asset_url, 300);

    if (signedError || !signedData?.signedUrl) {
      return { success: false, error: signedError?.message || 'Could not generate download link.' };
    }

    return { success: true, url: signedData.signedUrl };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred.' };
  }
}

export async function getClientContent() {
  const session = await getSession();
  if (!session || session.role !== 'client') {
    throw new Error('Unauthorized');
  }

  const { data: entries, error } = await supabaseAdmin
    .from('content_calendars')
    .select('*')
    .eq('client_id', session.userId)
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Error fetching client content:', error);
    return { entries: [] };
  }

  return { entries: entries || [] };
}

export async function updateContentStatus(contentId: string, status: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  const { error } = await supabaseAdmin
    .from('content_calendars')
    .update({ status })
    .eq('id', contentId)
    .eq('client_id', session.userId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ==========================================
// LEAD MANAGEMENT ACTIONS
// ==========================================

export async function getAdminLeadsData() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const { data: clients } = await supabaseAdmin
    .from('profiles')
    .select('id, name, email')
    .eq('role', 'client')
    .order('name');

  const { data: leads, error } = await supabaseAdmin
    .from('leads')
    .select('*, client:profiles(name, email)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return { leads: [], clients: clients || [] };
  }

  return { leads: leads || [], clients: clients || [] };
}

export async function createLead(data: {
  clientId: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  notes: string;
  pdfBase64?: string;
  pdfName?: string;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    let assetUrl = '';
    let assetName = '';

    if (data.pdfBase64 && data.pdfName) {
      const base64Data = data.pdfBase64.replace(/^data:application\/\w+;base64,/, '');
      const fileBuffer = Buffer.from(base64Data, 'base64');

      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      if (!buckets?.some(b => b.name === 'lead-documents')) {
        await supabaseAdmin.storage.createBucket('lead-documents', { public: false });
      }

      const fileName = `${data.clientId}/${Date.now()}-${data.pdfName}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from('lead-documents')
        .upload(fileName, fileBuffer, {
          contentType: 'application/pdf',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        return { success: false, error: `Storage upload failed: ${uploadError.message}` };
      }

      assetUrl = fileName;
      assetName = data.pdfName;
    }

    const { error } = await supabaseAdmin
      .from('leads')
      .insert({
        client_id: data.clientId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        source: data.source,
        status: data.status,
        notes: data.notes,
        asset_url: assetUrl,
        asset_name: assetName
      });

    if (error) {
      if (assetUrl) {
        await supabaseAdmin.storage.from('lead-documents').remove([assetUrl]);
      }
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/leads');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred while creating lead.' };
  }
}

export async function updateLead(leadId: string, data: {
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  notes: string;
  pdfBase64?: string;
  pdfName?: string;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    let assetUrl: string | undefined;
    let assetName: string | undefined;

    if (data.pdfBase64 && data.pdfName) {
      const base64Data = data.pdfBase64.replace(/^data:application\/\w+;base64,/, '');
      const fileBuffer = Buffer.from(base64Data, 'base64');

      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      if (!buckets?.some(b => b.name === 'lead-documents')) {
        await supabaseAdmin.storage.createBucket('lead-documents', { public: false });
      }

      const fileName = `lead/${leadId}/${Date.now()}-${data.pdfName}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from('lead-documents')
        .upload(fileName, fileBuffer, {
          contentType: 'application/pdf',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        return { success: false, error: `Storage upload failed: ${uploadError.message}` };
      }

      assetUrl = fileName;
      assetName = data.pdfName;
    }

    const updateData: any = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      source: data.source,
      status: data.status,
      notes: data.notes
    };

    if (assetUrl !== undefined) {
      updateData.asset_url = assetUrl;
      updateData.asset_name = assetName;
    }

    const { error } = await supabaseAdmin
      .from('leads')
      .update(updateData)
      .eq('id', leadId);

    if (error) {
      if (assetUrl) {
        await supabaseAdmin.storage.from('lead-documents').remove([assetUrl]);
      }
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/leads');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred while updating lead.' };
  }
}

export async function deleteLead(leadId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    const { data: lead } = await supabaseAdmin
      .from('leads')
      .select('asset_url')
      .eq('id', leadId)
      .single();

    if (lead?.asset_url) {
      await supabaseAdmin.storage.from('lead-documents').remove([lead.asset_url]);
    }

    const { error } = await supabaseAdmin
      .from('leads')
      .delete()
      .eq('id', leadId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/leads');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred during lead deletion.' };
  }
}

export async function downloadLeadDocument(leadId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  try {
    const { data: lead, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (error || !lead || !lead.asset_url) {
      return { success: false, error: 'Document not found.' };
    }

    if (session.role === 'client' && lead.client_id !== session.userId) {
      return { success: false, error: 'Access denied.' };
    }

    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from('lead-documents')
      .createSignedUrl(lead.asset_url, 300);

    if (signedError || !signedData?.signedUrl) {
      return { success: false, error: signedError?.message || 'Could not generate download link.' };
    }

    return { success: true, url: signedData.signedUrl };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred.' };
  }
}

export async function getClientLeads() {
  const session = await getSession();
  if (!session || session.role !== 'client') {
    throw new Error('Unauthorized');
  }

  const { data: leads, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('client_id', session.userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching client leads:', error);
    return { leads: [] };
  }

  return { leads: leads || [] };
}

export async function updateClientLeadStatus(leadId: string, status: string) {
  const session = await getSession();
  if (!session || session.role !== 'client') {
    throw new Error('Unauthorized');
  }

  try {
    const { data: lead } = await supabaseAdmin
      .from('leads')
      .select('client_id')
      .eq('id', leadId)
      .single();

    if (!lead || lead.client_id !== session.userId) {
      return { success: false, error: 'Access denied.' };
    }

    const { error } = await supabaseAdmin
      .from('leads')
      .update({ status })
      .eq('id', leadId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred.' };
  }
}

export async function getServerSession() {
  return getSession();
}

export async function loginUserAction(email: string, passwordHash: string) {
  return loginUser(email, passwordHash);
}

export async function logoutUserAction() {
  await logoutUser();
  redirect('/');
}

// ==========================================
// PROFILE ACTIONS
// ==========================================

export async function getClientProfileData() {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('*, package:packages(*)')
    .eq('id', session.userId)
    .single();

  if (error) return { profile: null, error: error.message };
  return { profile: profile || null };
}

export async function updateClientProfile(data: {
  name: string;
  phone: string;
  clinicName: string;
  specialization: string;
}) {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({
      name: data.name,
      phone: data.phone,
      clinic_name: data.clinicName,
      specialization: data.specialization,
    })
    .eq('id', session.userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function uploadProfileAvatar(fileName: string, fileBase64: string) {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  try {
    const base64Data = fileBase64.replace(/^data:image\/\w+;base64,/, '');
    const fileBuffer = Buffer.from(base64Data, 'base64');

    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.some(b => b.name === 'avatars')) {
      await supabaseAdmin.storage.createBucket('avatars', { public: false });
    }

    const path = `${session.userId}/${Date.now()}-${fileName}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(path, fileBuffer, { contentType: 'image/*', cacheControl: '3600', upsert: false });

    if (uploadError) return { success: false, error: uploadError.message };

    const { error: dbError } = await supabaseAdmin
      .from('profiles')
      .update({ avatar_url: path })
      .eq('id', session.userId);

    if (dbError) {
      await supabaseAdmin.storage.from('avatars').remove([path]);
      return { success: false, error: dbError.message };
    }
    return { success: true, path };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred.' };
  }
}

export async function downloadProfileAvatar() {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('avatar_url')
    .eq('id', session.userId)
    .single();

  if (!profile?.avatar_url) return { success: false, error: 'No avatar uploaded.' };

  const { data: signedData, error } = await supabaseAdmin.storage
    .from('avatars')
    .createSignedUrl(profile.avatar_url, 300);

  if (error || !signedData?.signedUrl) return { success: false, error: 'Could not load avatar.' };
  return { success: true, url: signedData.signedUrl };
}

// ==========================================
// PACKAGE ACTIONS
// ==========================================

export async function getClientPackageData() {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('package_id, package:packages(*)')
    .eq('id', session.userId)
    .single();

  const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM
  const { data: usage } = await supabaseAdmin
    .from('package_usage')
    .select('*')
    .eq('client_id', session.userId)
    .eq('period', currentPeriod)
    .order('service');

  const packageData = profile?.package || null;

  // Renewal = end of current billing month (+1 month), derived from validity
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const renewalDate = nextMonth.toISOString().slice(0, 10);

  return {
    package: packageData,
    usage: usage || [],
    renewalDate,
    accountManager: 'Rina Topclues',
    accountManagerEmail: 'rina@topclues.in',
    accountManagerPhone: '+91 90000 12345',
  };
}

// ==========================================
// CONTENT COMMENTS
// ==========================================

export async function getContentComments(contentId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const { data: comments, error } = await supabaseAdmin
    .from('content_comments')
    .select('*')
    .eq('content_id', contentId)
    .order('created_at', { ascending: true });

  if (error) return { comments: [] };
  return { comments: comments || [] };
}

export async function addContentComment(contentId: string, message: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const { data: entry } = await supabaseAdmin
    .from('content_calendars')
    .select('client_id')
    .eq('id', contentId)
    .single();

  if (!entry) return { success: false, error: 'Content item not found.' };
  if (session.role === 'client' && entry.client_id !== session.userId) {
    return { success: false, error: 'Access denied.' };
  }

  const { error } = await supabaseAdmin.from('content_comments').insert({
    content_id: contentId,
    author_name: session.role === 'admin' ? 'Topclues Team' : 'Client',
    author_role: session.role,
    message,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ==========================================
// BILLING / INVOICES
// ==========================================

export async function getClientBillingDocuments() {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  const { data: documents, error } = await supabaseAdmin
    .from('billing_documents')
    .select('*')
    .eq('client_id', session.userId)
    .order('billing_date', { ascending: false });

  if (error) return { documents: [] };
  return { documents: documents || [] };
}

// ==========================================
// CAMPAIGNS
// ==========================================

export async function getClientCampaigns() {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  const { data: campaigns, error } = await supabaseAdmin
    .from('campaigns')
    .select('*')
    .eq('client_id', session.userId)
    .order('created_at', { ascending: false });

  if (error) return { campaigns: [] };
  return { campaigns: campaigns || [] };
}

// ==========================================
// SOCIAL MEDIA
// ==========================================

export async function getClientSocialSnapshots() {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  const { data: snapshots, error } = await supabaseAdmin
    .from('social_snapshots')
    .select('*')
    .eq('client_id', session.userId)
    .order('platform');

  if (error) return { snapshots: [] };
  return { snapshots: snapshots || [] };
}

// ==========================================
// DOCUMENTS
// ==========================================

export async function getClientDocuments() {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  const { data: documents, error } = await supabaseAdmin
    .from('documents')
    .select('*')
    .eq('client_id', session.userId)
    .order('created_at', { ascending: false });

  if (error) return { documents: [] };
  return { documents: documents || [] };
}

export async function downloadDocument(documentId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const { data: doc, error } = await supabaseAdmin
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .single();

  if (error || !doc || !doc.file_url) return { success: false, error: 'Document not found.' };
  if (session.role === 'client' && doc.client_id !== session.userId) {
    return { success: false, error: 'Access denied.' };
  }

  const { data: signedData, error: signedError } = await supabaseAdmin.storage
    .from('documents')
    .createSignedUrl(doc.file_url, 300);

  if (signedError || !signedData?.signedUrl) {
    return { success: false, error: signedError?.message || 'Could not generate download link.' };
  }
  return { success: true, url: signedData.signedUrl, name: doc.file_name || doc.name };
}

// ==========================================
// REVIEWS & FEEDBACK
// ==========================================

export async function getClientReviews() {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  const { data: reviews, error } = await supabaseAdmin
    .from('reviews_feedback')
    .select('*')
    .eq('client_id', session.userId)
    .order('created_at', { ascending: false });

  if (error) return { reviews: [] };
  return { reviews: reviews || [] };
}

export async function submitClientReview(data: {
  rating: number;
  title: string;
  message: string;
  service: string;
  publishConsent: boolean;
}) {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  if (!data.rating || data.rating < 1 || data.rating > 5) {
    return { success: false, error: 'Please select a rating between 1 and 5.' };
  }

  const { error } = await supabaseAdmin.from('reviews_feedback').insert({
    client_id: session.userId,
    rating: data.rating,
    title: data.title,
    message: data.message,
    service: data.service,
    publish_consent: data.publishConsent,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ==========================================
// MEETINGS
// ==========================================

export async function getClientMeetings() {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  const { data: meetings, error } = await supabaseAdmin
    .from('meetings')
    .select('*')
    .eq('client_id', session.userId)
    .order('meeting_date', { ascending: true });

  if (error) return { meetings: [] };
  return { meetings: meetings || [] };
}

// ==========================================
// NOTIFICATIONS
// ==========================================

export async function getClientNotifications() {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  const { data: notifications, error } = await supabaseAdmin
    .from('notifications')
    .select('*')
    .eq('client_id', session.userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return { notifications: [] };
  return { notifications: notifications || [] };
}

export async function markNotificationRead(notificationId: string) {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .eq('client_id', session.userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function markAllNotificationsRead() {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('notifications')
    .update({ read: true })
    .eq('client_id', session.userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ==========================================
// LEADS (client side follow-ups)
// ==========================================

export async function getLeadFollowups(leadId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const { data: followups, error } = await supabaseAdmin
    .from('lead_followups')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (error) return { followups: [] };
  return { followups: followups || [] };
}

export async function addLeadFollowup(leadId: string, note: string, nextFollowupDate?: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const { data: lead } = await supabaseAdmin
    .from('leads')
    .select('client_id')
    .eq('id', leadId)
    .single();

  if (!lead) return { success: false, error: 'Lead not found.' };
  if (session.role === 'client' && lead.client_id !== session.userId) {
    return { success: false, error: 'Access denied.' };
  }

  const { error } = await supabaseAdmin.from('lead_followups').insert({
    lead_id: leadId,
    note,
    next_followup_date: nextFollowupDate || null,
    created_by: session.role === 'admin' ? 'Topclues Team' : 'Client',
  });

  if (error) return { success: false, error: error.message };

  if (nextFollowupDate) {
    await supabaseAdmin
      .from('leads')
      .update({ next_followup_date: nextFollowupDate })
      .eq('id', leadId);
  }

  return { success: true };
}

// ==========================================
// OFFERS (client)
// ==========================================

export async function getClientOffers() {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  const { data: offers, error } = await supabaseAdmin
    .from('special_offers')
    .select('*')
    .eq('client_id', session.userId)
    .eq('status', 'active')
    .order('valid_until', { ascending: true });

  const { data: claims } = await supabaseAdmin
    .from('offer_claims')
    .select('*')
    .eq('client_id', session.userId);

  if (error) return { offers: [], claims: claims || [] };
  return { offers: offers || [], claims: claims || [] };
}

export async function claimOffer(offerId: string, notes: string) {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  const { data: offer } = await supabaseAdmin
    .from('special_offers')
    .select('client_id')
    .eq('id', offerId)
    .single();

  if (!offer) return { success: false, error: 'Offer not found.' };
  if (offer.client_id !== session.userId) return { success: false, error: 'Access denied.' };

  const { error } = await supabaseAdmin.from('offer_claims').insert({
    offer_id: offerId,
    client_id: session.userId,
    notes,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ==========================================
// SUPPORT TICKETS (client)
// ==========================================

export async function getClientTickets() {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  const { data: tickets, error } = await supabaseAdmin
    .from('support_tickets')
    .select('*')
    .eq('client_id', session.userId)
    .order('created_at', { ascending: false });

  if (error) return { tickets: [] };
  return { tickets: tickets || [] };
}

export async function getTicketReplies(ticketId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const { data: replies, error } = await supabaseAdmin
    .from('ticket_replies')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  if (error) return { replies: [] };
  return { replies: replies || [] };
}

export async function createClientTicket(data: {
  subject: string;
  category: string;
  priority: string;
  message: string;
}) {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('name')
    .eq('id', session.userId)
    .single();

  const { error } = await supabaseAdmin.from('support_tickets').insert({
    client_id: session.userId,
    company_name: profile?.name || 'Client',
    subject: data.subject,
    message: data.message,
    category: data.category,
    priority: data.priority,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function addTicketReply(ticketId: string, message: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const { data: ticket } = await supabaseAdmin
    .from('support_tickets')
    .select('client_id')
    .eq('id', ticketId)
    .single();

  if (!ticket) return { success: false, error: 'Ticket not found.' };
  if (session.role === 'client' && ticket.client_id !== session.userId) {
    return { success: false, error: 'Access denied.' };
  }

  const { error } = await supabaseAdmin.from('ticket_replies').insert({
    ticket_id: ticketId,
    sender: session.role,
    sender_name: session.role === 'admin' ? 'Topclues Team' : 'Client',
    message,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ==========================================
// SETTINGS
// ==========================================

export async function changeClientPassword(currentPassword: string, newPassword: string) {
  const session = await getSession();
  if (!session || session.role !== 'client') throw new Error('Unauthorized');

  try {
    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    // Verify the current password first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: session.email,
      password: currentPassword,
    });

    if (signInError) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(session.userId, {
      password: newPassword,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred.' };
  }
}

// ==========================================
// ADMIN: OFFERS
// ==========================================

export async function getAdminOffersData() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data: clients } = await supabaseAdmin
    .from('profiles')
    .select('id, name, email')
    .eq('role', 'client')
    .order('name');

  const { data: offers, error } = await supabaseAdmin
    .from('special_offers')
    .select('*, client:profiles(name, email)')
    .order('created_at', { ascending: false });

  if (error) return { offers: [], clients: clients || [] };
  return { offers: offers || [], clients: clients || [] };
}

export async function createOffer(data: {
  clientId: string;
  title: string;
  description: string;
  price: string;
  offerPrice: string;
  validUntil: string;
  eligibility: string;
  terms: string;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin.from('special_offers').insert({
    client_id: data.clientId,
    title: data.title,
    description: data.description,
    price: parseFloat(data.price) || 0,
    offer_price: parseFloat(data.offerPrice) || 0,
    discount_pct: parseFloat(data.price) > 0
      ? Math.round(((parseFloat(data.price) - (parseFloat(data.offerPrice) || 0)) / parseFloat(data.price)) * 100)
      : 0,
    valid_until: data.validUntil || null,
    eligibility: data.eligibility,
    terms: data.terms,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/offers');
  return { success: true };
}

export async function updateOfferStatus(offerId: string, status: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('special_offers')
    .update({ status })
    .eq('id', offerId);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/offers');
  return { success: true };
}

export async function deleteOffer(offerId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin.from('special_offers').delete().eq('id', offerId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/offers');
  return { success: true };
}

// ==========================================
// ADMIN: REVIEWS
// ==========================================

export async function getAdminReviewsData() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data: reviews, error } = await supabaseAdmin
    .from('reviews_feedback')
    .select('*, client:profiles(name, email)')
    .order('created_at', { ascending: false });

  if (error) return { reviews: [] };
  return { reviews: reviews || [] };
}

export async function updateReviewStatus(reviewId: string, status: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('reviews_feedback')
    .update({ status })
    .eq('id', reviewId);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/reviews');
  return { success: true };
}

// ==========================================
// ADMIN: MEETINGS
// ==========================================

export async function getAdminMeetingsData() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data: clients } = await supabaseAdmin
    .from('profiles')
    .select('id, name, email')
    .eq('role', 'client')
    .order('name');

  const { data: meetings, error } = await supabaseAdmin
    .from('meetings')
    .select('*, client:profiles(name, email)')
    .order('meeting_date', { ascending: false });

  if (error) return { meetings: [], clients: clients || [] };
  return { meetings: meetings || [], clients: clients || [] };
}

export async function createMeeting(data: {
  clientId: string;
  title: string;
  meetingDate: string;
  meetingType: string;
  link: string;
  agenda: string;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin.from('meetings').insert({
    client_id: data.clientId,
    title: data.title,
    meeting_date: data.meetingDate,
    meeting_type: data.meetingType,
    link: data.link,
    agenda: data.agenda,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/meetings');
  return { success: true };
}

export async function updateMeetingStatus(meetingId: string, status: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin.from('meetings').update({ status }).eq('id', meetingId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/meetings');
  return { success: true };
}

export async function deleteMeeting(meetingId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin.from('meetings').delete().eq('id', meetingId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/meetings');
  return { success: true };
}

// ==========================================
// ADMIN: DOCUMENTS
// ==========================================

export async function getAdminDocumentsData() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data: clients } = await supabaseAdmin
    .from('profiles')
    .select('id, name, email')
    .eq('role', 'client')
    .order('name');

  const { data: documents, error } = await supabaseAdmin
    .from('documents')
    .select('*, client:profiles(name, email)')
    .order('created_at', { ascending: false });

  if (error) return { documents: [], clients: clients || [] };
  return { documents: documents || [], clients: clients || [] };
}

export async function uploadDocument(data: {
  clientId: string;
  name: string;
  category: string;
  expiryDate?: string;
  fileBase64: string;
  fileName: string;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  try {
    const base64Data = data.fileBase64.replace(/^data:[^;]+;base64,/, '');
    const fileBuffer = Buffer.from(base64Data, 'base64');

    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.some(b => b.name === 'documents')) {
      await supabaseAdmin.storage.createBucket('documents', { public: false });
    }

    const fileUrl = `${data.clientId}/${Date.now()}-${data.fileName}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('documents')
      .upload(fileUrl, fileBuffer, { cacheControl: '3600', upsert: false });

    if (uploadError) return { success: false, error: `Storage upload failed: ${uploadError.message}` };

    const { error: dbError } = await supabaseAdmin.from('documents').insert({
      client_id: data.clientId,
      name: data.name,
      category: data.category,
      file_url: fileUrl,
      file_name: data.fileName,
      file_size: fileBuffer.length,
      expiry_date: data.expiryDate || null,
    });

    if (dbError) {
      await supabaseAdmin.storage.from('documents').remove([fileUrl]);
      return { success: false, error: `Database insert failed: ${dbError.message}` };
    }

    revalidatePath('/admin/documents');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred.' };
  }
}

export async function deleteDocument(documentId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data: doc } = await supabaseAdmin
    .from('documents')
    .select('file_url')
    .eq('id', documentId)
    .single();

  if (doc?.file_url) {
    await supabaseAdmin.storage.from('documents').remove([doc.file_url]);
  }

  const { error } = await supabaseAdmin.from('documents').delete().eq('id', documentId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/documents');
  return { success: true };
}

// ==========================================
// ADMIN: NOTIFICATIONS
// ==========================================

export async function getAdminNotificationsData() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data: clients } = await supabaseAdmin
    .from('profiles')
    .select('id, name, email')
    .eq('role', 'client')
    .order('name');

  const { data: notifications, error } = await supabaseAdmin
    .from('notifications')
    .select('*, client:profiles(name, email)')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return { notifications: [], clients: clients || [] };
  return { notifications: notifications || [], clients: clients || [] };
}

export async function sendNotification(data: {
  clientId: string;
  title: string;
  message: string;
  type: string;
  link: string;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin.from('notifications').insert({
    client_id: data.clientId,
    title: data.title,
    message: data.message,
    type: data.type,
    link: data.link,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/notifications');
  return { success: true };
}

export async function deleteNotification(notificationId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('notifications')
    .delete()
    .eq('id', notificationId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/notifications');
  return { success: true };
}

// ==========================================
// ADMIN: SUPPORT TICKETS
// ==========================================

export async function getAdminTicketsData() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { data: tickets, error } = await supabaseAdmin
    .from('support_tickets')
    .select('*, client:profiles(name, email)')
    .order('created_at', { ascending: false });

  if (error) return { tickets: [] };
  return { tickets: tickets || [] };
}

export async function updateTicket(ticketId: string, data: {
  status?: string;
  priority?: string;
  assignedTo?: string;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const updateData: any = {};
  if (data.status !== undefined) {
    updateData.status = data.status;
    if (data.status === 'resolved' || data.status === 'closed') {
      updateData.resolved_at = new Date().toISOString();
    }
  }
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.assignedTo !== undefined) updateData.assigned_to = data.assignedTo;

  const { error } = await supabaseAdmin
    .from('support_tickets')
    .update(updateData)
    .eq('id', ticketId);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/tickets');
  return { success: true };
}

export async function deleteTicket(ticketId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error('Unauthorized');

  const { error } = await supabaseAdmin.from('support_tickets').delete().eq('id', ticketId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/tickets');
  return { success: true };
}
