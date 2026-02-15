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

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Copy, Check, Share2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Button, Input } from '../../design-system';
import { sharedAPI } from '../../api';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  defaultTitle?: string;
}

export function ShareModal({
  isOpen,
  onClose,
  planId,
  defaultTitle = 'My Workout Plan',
}: ShareModalProps) {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState('');
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const createShareMutation = useMutation({
    mutationFn: () => sharedAPI.createShare(planId, title, description || undefined),
    onSuccess: (data) => {
      const fullUrl = `${window.location.origin}${data.share_url}`;
      setShareUrl(fullUrl);
      toast.success('Share link created!');
    },
    onError: () => {
      toast.error('Failed to create share link');
    },
  });

  const handleCopy = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleClose = () => {
    setShareUrl(null);
    setCopied(false);
    setTitle(defaultTitle);
    setDescription('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    createShareMutation.mutate();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Share Workout Plan">
      {!shareUrl ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="share-title"
              label="Title"
              variant="dark"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your shared plan"
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/100 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="share-description"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Description (optional)
            </label>
            <textarea
              id="share-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description to help others understand your plan"
              maxLength={500}
              rows={3}
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/500 characters
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={createShareMutation.isPending || !title.trim()}
            >
              {createShareMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  Create Share Link
                </>
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Your share link:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm text-emerald-400 bg-gray-900 rounded px-3 py-2 overflow-x-auto">
                {shareUrl}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-400">
            Anyone with this link can view your workout plan. They can import it
            to their own account if they're signed in.
          </p>

          <Button variant="primary" onClick={handleClose} className="w-full">
            Done
          </Button>
        </div>
      )}
    </Modal>
  );
}
