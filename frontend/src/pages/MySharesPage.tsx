/**
 * Copyright (c) 2025-2026 Phillip-Juan van der Berg. All Rights Reserved.
 *
 * This file is part of Lumi.
 *
 * Lumi is licensed under the PolyForm Noncommercial License 1.0.0.
 * You may not use this file except in compliance with the License.
 *
 * Commercial use requires a separate paid license.
 * Contact: phillipjuanvanderberg@gmail.com
 *
 * See the LICENSE file for the full license text.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, Trash2, Eye, Download, Link as LinkIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { Card, CardContent, Button, ConfirmModal } from '../design-system';
import { sharedAPI, sharedQueryKeys } from '../api';
import type { SharedPlanSummary } from '../api';
import { PageTransition } from '../components/layout/PageTransition';
import { useState } from 'react';

const MODALITY_LABELS = {
  strength: 'Strength',
  hiit: 'HIIT',
  flexibility: 'Flexibility',
  cardio: 'Cardio',
  hybrid: 'Hybrid',
};

export default function MySharesPage() {
  const queryClient = useQueryClient();
  const [deletingShare, setDeletingShare] = useState<SharedPlanSummary | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: sharedQueryKeys.myShares(),
    queryFn: sharedAPI.getMyShares,
  });

  const deleteMutation = useMutation({
    mutationFn: (code: string) => sharedAPI.deleteShare(code),
    onSuccess: () => {
      toast.success('Share link deleted');
      queryClient.invalidateQueries({ queryKey: sharedQueryKeys.myShares() });
      setDeletingShare(null);
    },
    onError: () => {
      toast.error('Failed to delete share link');
    },
  });

  const handleCopy = async (share: SharedPlanSummary) => {
    const fullUrl = `${window.location.origin}${share.share_url}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedCode(share.share_code);
      toast.success('Link copied!');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const shares = data?.shares || [];

  return (
    <Layout>
      <PageTransition>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-white">My Shared Plans</h1>
            <p className="text-gray-400 mt-1">
              Manage your shared workout plan links
            </p>
          </header>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : shares.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <LinkIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No shared plans yet
                </h3>
                <p className="text-gray-400">
                  Share your workout plans from the Workouts page to see them here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {shares.map((share) => (
                <Card key={share.share_code}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white truncate">
                            {share.title}
                          </h3>
                          <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
                            {MODALITY_LABELS[share.workout_modality]}
                          </span>
                        </div>

                        {share.description && (
                          <p className="text-sm text-gray-400 mb-2 line-clamp-1">
                            {share.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {share.view_count} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {share.import_count} imports
                          </span>
                          <span>
                            Created{' '}
                            {new Date(share.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <code className="flex-1 text-xs text-emerald-400 bg-gray-800 rounded px-2 py-1 truncate">
                            {`${window.location.origin}${share.share_url}`}
                          </code>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(share)}
                          title="Copy link"
                        >
                          {copiedCode === share.share_code ? (
                            <span className="text-emerald-500 text-xs">Copied!</span>
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingShare(share)}
                          title="Delete share"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <ConfirmModal
            isOpen={!!deletingShare}
            onClose={() => setDeletingShare(null)}
            onConfirm={() => {
              if (deletingShare) {
                deleteMutation.mutate(deletingShare.share_code);
              }
            }}
            title="Delete Share Link"
            message={`Are you sure you want to delete the share link for "${deletingShare?.title}"? Anyone with the link will no longer be able to view or import this plan.`}
            confirmText="Delete"
            variant="danger"
            loading={deleteMutation.isPending}
          />
        </div>
      </PageTransition>
    </Layout>
  );
}
