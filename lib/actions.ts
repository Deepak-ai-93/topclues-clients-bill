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

export async function setupInitialAdmin(data: { email: string; password: string }) {
  try {
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
