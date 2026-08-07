'use client';

import React, { useState, useEffect } from 'react';
import { getAdminDashboardData } from '../../lib/actions';
import Link from 'next/link';
import { 
  Users, 
  FileText, 
  Plus, 
  UploadCloud,
  FileCheck,
  Calendar,
  UserPlus
} from 'lucide-react';
import StatCard from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface RecentDocument {
  id: string;
  title: string;
  billing_date: string;
  pdf_name: string;
  created_at: string;
  client?: {
    name: string;
    email: string;
  };
}

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalDocuments: 0,
    totalContent: 0,
    totalLeads: 0,
    recentDocuments: [] as RecentDocument[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function loadDashboard() {
      try {
        const data = await getAdminDashboardData();
        setStats({
          totalClients: data.totalClients,
          totalDocuments: data.totalDocuments,
          totalContent: data.totalContent || 0,
          totalLeads: data.totalLeads || 0,
          recentDocuments: data.recentDocuments as RecentDocument[]
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (!mounted || loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-neutral-400 font-mono tracking-widest">LOADING SECURE METRICS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Invoice Console</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage invoices, receipts, and billing documents for your clients.</p>
        </div>

        <div className="flex gap-3">
          <Button href="/admin/clients" size="sm">
            <Plus className="w-3.5 h-3.5" />
            Add Client
          </Button>
          <Button href="/admin/billing" variant="outline" size="sm">
            <UploadCloud className="w-3.5 h-3.5 text-neutral-500" />
            Upload Invoice
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Registered Clients"
          value={stats.totalClients}
          hint="Secure auth accounts"
          icon={Users}
          href="/admin/clients"
        />
        <StatCard
          label="Invoice Vault"
          value={stats.totalDocuments}
          hint="Invoices & receipts"
          icon={FileText}
          href="/admin/billing"
        />
        <StatCard
          label="Content Calendar"
          value={stats.totalContent}
          hint="Scheduled assets"
          icon={Calendar}
          href="/admin/content"
        />
        <StatCard
          label="Leads Pipeline"
          value={stats.totalLeads}
          hint="Active leads tracked"
          icon={UserPlus}
          href="/admin/leads"
        />
      </div>

      {/* Recent Activity Table */}
      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4.5 h-4.5 text-neutral-500" />
            <CardTitle className="text-sm font-semibold text-neutral-950">Recent Invoice Uploads</CardTitle>
          </div>
          <Badge variant="accent" dot>Audited</Badge>
        </CardHeader>

        <CardContent className="p-0">
          {stats.recentDocuments.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs text-neutral-500 font-medium">No invoices uploaded yet.</p>
              <Link 
                href="/admin/billing"
                className="text-xs font-semibold text-neutral-900 underline mt-2 inline-block hover:text-neutral-700"
              >
                Upload your first invoice
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    <th className="py-3 px-6">Invoice Title</th>
                    <th className="py-3 px-6">Client Name</th>
                    <th className="py-3 px-6">Invoice Date</th>
                    <th className="py-3 px-6">File Name</th>
                    <th className="py-3 px-6 text-right">Uploaded At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {stats.recentDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-neutral-900">{doc.title}</td>
                      <td className="py-3.5 px-6 text-neutral-700">
                        {doc.client ? (
                          <div>
                            <div className="font-semibold">{doc.client.name}</div>
                            <div className="text-[10px] text-neutral-400">{doc.client.email}</div>
                          </div>
                        ) : (
                          <span className="text-neutral-400 italic">Deleted Client</span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-neutral-500 font-mono">{doc.billing_date}</td>
                      <td className="py-3.5 px-6 font-mono text-neutral-500">{doc.pdf_name}</td>
                      <td className="py-3.5 px-6 text-right text-neutral-400">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
