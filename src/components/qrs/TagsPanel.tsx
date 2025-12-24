'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedQrMesa: number;
  availableTags: Tag[];
  qrTags: Record<string, string[]>;
  onAddTag: (mesa: number, tagId: string) => void;
  onRemoveTag: (mesa: number, tagId: string) => void;
  onCreateAndAssignTag: (mesa: number, name: string, color: string) => void;
  isCreatingTag: boolean;
  draggedTag: Tag | null;
  onDragStart: (e: React.DragEvent, tag: Tag) => void;
}

export function TagsPanel({
  isOpen,
  onClose,
  selectedQrMesa,
  availableTags,
  qrTags,
  onAddTag,
  onRemoveTag,
  onCreateAndAssignTag,
  isCreatingTag,
  draggedTag,
  onDragStart,
}: TagsPanelProps) {
  const t = useTranslations('qrs');
  const [showCreateTagForm, setShowCreateTagForm] = useState(false);
  const [newTagForm, setNewTagForm] = useState({ name: '', color: '#FF6B6B' });

  if (!isOpen) return null;

  const normalizedSelectedQr = String(selectedQrMesa);
  const assignedTags = qrTags[normalizedSelectedQr] || [];

  const handleCreateAndAssign = () => {
    if (newTagForm.name.trim()) {
      onCreateAndAssignTag(selectedQrMesa, newTagForm.name.trim(), newTagForm.color);
      setNewTagForm({ name: '', color: '#FF6B6B' });
      setShowCreateTagForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">
            {t('manageTags', { defaultValue: 'Manage Tags' })} - {t('table', { defaultValue: 'Table' })} {selectedQrMesa}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700">
              {t('availableTags', { defaultValue: 'Available Tags' })}
            </h4>
            <button
              type="button"
              onClick={() => setShowCreateTagForm(!showCreateTagForm)}
              className="px-3 py-1 bg-pink-500 text-white text-xs rounded-full hover:bg-pink-600 transition-colors flex items-center gap-1"
            >
              <Plus size={12} />
              {t('createTag', { defaultValue: 'Create Tag' })}
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            {t('dragTagsHint', { defaultValue: 'Drag tags to QR cards or click to add' })}
          </p>

          {showCreateTagForm && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
              <h5 className="text-sm font-semibold mb-3 text-gray-700">
                {t('createNewTag', { defaultValue: 'Create New Tag' })}
              </h5>
              <div className="space-y-3">
                <div>
                  <label htmlFor="tag-name" className="block text-xs font-medium text-gray-600 mb-1">
                    {t('name', { defaultValue: 'Name' })}
                  </label>
                  <input
                    id="tag-name"
                    type="text"
                    value={newTagForm.name}
                    onChange={(e) => setNewTagForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder={t('tagNamePlaceholder', { defaultValue: 'e.g., Patio, VIP Room...' })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <div>
                  <label htmlFor="tag-color" className="block text-xs font-medium text-gray-600 mb-1">
                    {t('color', { defaultValue: 'Color' })}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="tag-color"
                      type="color"
                      value={newTagForm.color}
                      onChange={(e) => setNewTagForm((prev) => ({ ...prev, color: e.target.value }))}
                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newTagForm.color}
                      onChange={(e) => setNewTagForm((prev) => ({ ...prev, color: e.target.value }))}
                      placeholder="#FF6B6B"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCreateAndAssign}
                    disabled={!newTagForm.name.trim() || isCreatingTag}
                    className="flex-1 px-3 py-2 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    {isCreatingTag ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        {t('creating', { defaultValue: 'Creating...' })}
                      </>
                    ) : (
                      t('createAndAssign', { defaultValue: 'Create and Assign' })
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateTagForm(false);
                      setNewTagForm({ name: '', color: '#FF6B6B' });
                    }}
                    className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    {t('cancel', { defaultValue: 'Cancel' })}
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isAssigned = assignedTags.includes(tag.id);
              return (
                <div
                  key={tag.id}
                  draggable={!isAssigned}
                  onDragStart={(e) => !isAssigned && onDragStart(e, tag)}
                  onClick={() => !isAssigned && onAddTag(selectedQrMesa, tag.id)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    isAssigned
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'
                      : 'text-white cursor-pointer hover:scale-105 active:scale-95'
                  }`}
                  style={{
                    backgroundColor: isAssigned ? undefined : tag.color,
                    cursor: isAssigned ? 'not-allowed' : 'grab',
                  }}
                >
                  <span>{tag.name}</span>
                  {isAssigned && <span className="text-xs">({t('assigned', { defaultValue: 'assigned' })})</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-2 text-gray-700">
            {t('assignedTags', { defaultValue: 'Assigned Tags' })}
          </h4>
          <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border-2 border-dashed border-gray-200 rounded-lg">
            {assignedTags.length > 0 ? (
              assignedTags.map((tagId) => {
                const tag = availableTags.find((t) => t.id === tagId);
                if (!tag) return null;
                return (
                  <div
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm text-white font-medium"
                    style={{ backgroundColor: tag.color }}
                  >
                    <span>{tag.name}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveTag(selectedQrMesa, tag.id)}
                      className="hover:bg-black hover:bg-opacity-20 rounded-full p-1 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-gray-400 italic flex items-center justify-center w-full">
                {t('noTagsAssigned', { defaultValue: 'No tags assigned' })}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {t('close', { defaultValue: 'Close' })}
          </button>
        </div>
      </div>
    </div>
  );
}

