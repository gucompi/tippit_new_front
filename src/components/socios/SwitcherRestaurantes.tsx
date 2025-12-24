'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, X } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface Restaurant {
  id: string;
  name: string;
  address?: string;
}

interface SwitcherRestaurantesProps {
  onAddComparison?: (restaurantId: string, restaurantName: string) => void;
  onSwitchComplete?: (restaurantId: string, restaurantName: string) => void;
  comparisonRestaurantId?: string | null;
  onRemoveComparison?: (restaurantId: string) => void;
}

export function SwitcherRestaurantes({
  onAddComparison,
  onSwitchComplete,
  comparisonRestaurantId,
  onRemoveComparison,
}: SwitcherRestaurantesProps) {
  const t = useTranslations('socios.switcher');
  const { user } = useUser();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [pendingRestaurant, setPendingRestaurant] = useState<Restaurant | null>(null);

  // Mock restaurants - in real app, this would come from API
  useEffect(() => {
    setRestaurants([
      { id: 'restaurant-1', name: 'Restaurant Centro', address: 'Av. Corrientes 1234' },
      { id: 'restaurant-2', name: 'Restaurant Norte', address: 'Av. Libertador 5678' },
      { id: 'restaurant-3', name: 'Restaurant Sur', address: 'Av. San Martin 9012' },
    ]);
    setSelectedRestaurantId('restaurant-1');
  }, []);

  const handleRestaurantClick = useCallback(
    (restaurant: Restaurant) => {
      if (restaurant.id === selectedRestaurantId) return;

      setPendingRestaurant(restaurant);
      setShowSwitchModal(true);
    },
    [selectedRestaurantId]
  );

  const handleSwitchConfirm = useCallback(() => {
    if (!pendingRestaurant) return;

    setSelectedRestaurantId(pendingRestaurant.id);
    if (onSwitchComplete) {
      onSwitchComplete(pendingRestaurant.id, pendingRestaurant.name);
    }
    setShowSwitchModal(false);
    setPendingRestaurant(null);
  }, [pendingRestaurant, onSwitchComplete]);

  const handleCompareConfirm = useCallback(() => {
    if (!pendingRestaurant) return;

    if (onAddComparison) {
      onAddComparison(pendingRestaurant.id, pendingRestaurant.name);
    }
    setShowSwitchModal(false);
    setPendingRestaurant(null);
  }, [pendingRestaurant, onAddComparison]);

  return (
    <>
      <div className="w-11/12 max-w-[900px] mx-auto mt-4 flex justify-center">
        <div className="flex items-center gap-2 bg-white rounded-full p-2 border border-[#E1E1E1] shadow-sm">
          {restaurants.map((restaurant) => (
            <button
              key={restaurant.id}
              type="button"
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                selectedRestaurantId === restaurant.id
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleRestaurantClick(restaurant)}
            >
              {restaurant.name}
            </button>
          ))}
          {comparisonRestaurantId && (
            <button
              type="button"
              onClick={() => onRemoveComparison && onRemoveComparison(comparisonRestaurantId)}
              className="ml-2 px-3 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center gap-1"
            >
              <X size={16} />
              {t('removeComparison', { defaultValue: 'Remove Comparison' })}
            </button>
          )}
        </div>
      </div>

      {showSwitchModal && pendingRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-sm mx-auto">
            <h3 className="text-lg font-bold mb-4">{t('switchOrCompare', { defaultValue: 'Switch or Compare' })}</h3>
            <p className="mb-4">
              {t('doYouWantToSwitch', { defaultValue: 'Do you want to switch to' })} <strong>{pendingRestaurant.name}</strong>{' '}
              {t('orAddForComparison', { defaultValue: 'or add it for comparison?' })}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                onClick={() => {
                  setShowSwitchModal(false);
                  setPendingRestaurant(null);
                }}
              >
                {t('cancel', { defaultValue: 'Cancel' })}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-[#FF5EA3] text-white rounded-lg hover:bg-opacity-90"
                onClick={handleSwitchConfirm}
              >
                {t('switchTo', { defaultValue: 'Switch to' })}
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-[#FF5EA3] text-[#FF5EA3] rounded-lg hover:bg-gray-50"
                onClick={handleCompareConfirm}
              >
                {t('compareWith', { defaultValue: 'Compare with' })}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

