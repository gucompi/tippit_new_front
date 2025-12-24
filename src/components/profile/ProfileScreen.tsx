'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Save, PenSquare, User, Mail, CreditCard, Home, Wallet, UserPlus } from 'lucide-react';
import { tokens } from '@/styles/tokens';
import { trpc } from '@/lib/trpc';
import { PageHeader } from '@/components/business/PageHeader';
import { StatCard } from '@/components/business/StatCard';
import { ProfilePhoto } from './ProfilePhoto';
import { ProfileModal } from './ProfileModal';
import { Skeleton } from '@/components/ui';

export function ProfileScreen() {
  const t = useTranslations('profile');
  const tMozo = useTranslations('profile.mozo');
  const tStaff = useTranslations('profile.staff');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nombre: '',
    email: '',
    cuit: '',
    address: '',
    alias: '',
    photo: '',
    rol: '',
  });
  const photoRef = useRef<HTMLImageElement>(null);

  // Get profile data
  const { data: profile, isLoading: isLoadingProfile } = trpc.profile.getProfile.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  // Get mozo stats (only for Mozo role)
  const { data: mozoStats, isLoading: isLoadingMozoStats } = trpc.profile.getMozoStats.useQuery(
    undefined,
    {
      enabled: profile?.rol === 'Mozo',
      staleTime: 30 * 1000,
    }
  );

  // Get roles (only for admin roles)
  const { data: roles = [] } = trpc.profile.getRoles.useQuery(undefined, {
    enabled:
      profile?.rol === 'Manager' ||
      profile?.rol === 'Restaurante' ||
      profile?.rol === 'Duenio',
    staleTime: 10 * 60 * 1000,
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    nombre: string;
    foto: string;
    cuit: string;
  } | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [cuitInput, setCuitInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Search employee mutation
  const searchEmployee = trpc.profile.searchEmployee.useMutation();
  const linkMozo = trpc.profile.linkMozo.useMutation();
  const unlinkMozo = trpc.profile.unlinkMozo.useMutation();

  // Update profile mutation
  const updateProfile = trpc.profile.updateProfile.useMutation({
    onSuccess: () => {
      setIsEditing(false);
    },
  });

  // Update local state when profile data loads
  useEffect(() => {
    if (profile) {
      setProfileData({
        nombre: profile.nombre || '',
        email: profile.email || '',
        cuit: profile.cuit || '',
        address: profile.address || '',
        alias: profile.alias || '',
        photo: profile.photo || '',
        rol: profile.rol || '',
      });
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    const photo = photoRef.current?.src || profileData.photo;
    await updateProfile.mutateAsync({
      nombre: profileData.nombre,
      photo,
      alias: profileData.alias,
      address: profileData.address,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoSave = (photo: string) => {
    setProfileData((prev) => ({ ...prev, photo }));
  };

  const handleSearchEmployee = async () => {
    if (!cuitInput) {
      setErrorMessage('Please enter a CUIT');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await searchEmployee.mutateAsync({ cuit: cuitInput });
      if (result.detail === 'Empleado no encontrado') {
        setModalContent(null);
        setErrorMessage('Employee not found');
        setIsModalOpen(true);
      } else {
        setModalContent({
          nombre: result.nombre || '',
          foto: result.foto || '/profile_he.jpg',
          cuit: cuitInput,
        });
        setIsModalOpen(true);
      }
    } catch (error) {
      setErrorMessage(tStaff('networkErrorMessage'));
    }
  };

  const handleAddStaff = async () => {
    if (!selectedRole || !cuitInput) {
      setErrorMessage(tStaff('errorMessage'));
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    try {
      await linkMozo.mutateAsync({ cuit: cuitInput, rol: selectedRole });
      setSuccessMessage(tStaff('successMessage'));
    } catch (error) {
      setErrorMessage(tStaff('networkErrorMessage'));
    }
  };

  const handleDeleteStaff = async () => {
    if (!cuitInput || !selectedRole) {
      setErrorMessage(tStaff('errorMessage'));
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    try {
      await unlinkMozo.mutateAsync({ cuit: cuitInput, rol: selectedRole });
      setSuccessMessage(tStaff('successMessageDelete'));
    } catch (error) {
      setErrorMessage(tStaff('networkErrorMessage'));
    }
  };

  const mapRoles: Record<string, string> = {
    restaurante: t('business'),
    mozo: t('employee'),
  };

  const isAdmin =
    profileData.rol === 'Restaurante' ||
    profileData.rol === 'Manager' ||
    profileData.rol === 'Duenio';

  if (isLoadingProfile) {
    return (
      <div className="flex flex-col gap-6 mb-4 md:mb-8 mx-[18px]">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <main className="flex-1">
      <div className="flex flex-col gap-2">
        <PageHeader
          titleKey="profile.title"
          tooltipKey="profile.tooltip"
          showProfileIcon={true}
          showNotificationIcon={true}
        />
        <div className="flex mt-2 justify-center gap-2">
          {!isEditing ? (
            <>
              <button
                className="px-4 py-2 border border-gray-300 rounded-[30px] flex items-center hover:bg-gray-100 bg-white text-gray-800 font-semibold transition-colors"
                onClick={handleEdit}
              >
                <PenSquare className="mr-2 h-4 w-4" /> {t('editProfile')}
              </button>
              {isAdmin && (
                <button
                  className="px-4 py-2 border border-gray-300 rounded-[30px] flex items-center hover:bg-gray-100 bg-white text-gray-800 font-semibold transition-colors"
                  onClick={() => {
                    setIsModalOpen(true);
                    setCuitInput('');
                    setModalContent(null);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                >
                  <UserPlus className="mr-2 h-4 w-4" /> {tStaff('addStaffToRestaurant')}
                </button>
              )}
            </>
          ) : (
            <button
              className="px-4 py-2 border border-gray-300 rounded-[30px] flex items-center hover:bg-gray-100 bg-white text-gray-800 font-semibold transition-colors"
              onClick={handleSave}
              disabled={updateProfile.isPending}
            >
              <Save className="mr-2 h-4 w-4" /> {t('saveChanges')}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6 mb-4 md:mb-8 mx-[18px]">
        <div className="flex flex-col lg:flex-row gap-6 mt-10">
          {/* Photo Card */}
          <StatCard>
            {isEditing && (
              <ProfilePhoto
                photoRef={photoRef}
                onSave={handlePhotoSave}
                initialPhoto={profileData.photo}
              />
            )}
            <div className="flex flex-col items-center justify-center gap-5 h-full">
              <div
                className={`rounded-full ${
                  isEditing ? 'w-0 h-0' : 'w-20 h-20 lg:w-[150px] lg:h-[150px]'
                }`}
              >
                <img
                  ref={photoRef}
                  src={profileData.photo || '/profile_he.jpg'}
                  alt="Profile"
                  className="rounded-full object-cover w-full h-full"
                  hidden={isEditing}
                />
              </div>
              {!isEditing && (
                <div className="text-center lg:text-left flex flex-col items-center">
                  <h2
                    className="text-lg md:text-2xl font-medium"
                    style={{ color: tokens.colors.textMuted }}
                  >
                    {profileData.nombre}
                  </h2>
                  <span
                    className="inline-block rounded-full px-[14px] py-[5px] text-xs font-medium mt-3 mb-2 border"
                    style={{
                      backgroundColor: `${tokens.colors.primary}40`,
                      borderColor: tokens.colors.primary,
                      color: tokens.colors.textPrimary,
                    }}
                  >
                    {isAdmin
                      ? t('admin')
                      : mapRoles[profileData.rol.toLowerCase()] || profileData.rol}
                  </span>
                </div>
              )}
            </div>
          </StatCard>

          {/* Personal Information Card */}
          <StatCard
            title={t('personalInformation')}
            className="w-full lg:w-2/3 flex flex-col justify-center"
          >
            <div className="flex flex-col gap-4 text-sm md:text-base px-6 pb-4">
              {/* Name */}
              <div className="flex items-center gap-4">
                <User size={32} style={{ color: tokens.colors.primary }} />
                {isEditing ? (
                  <input
                    name="nombre"
                    value={profileData.nombre}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 flex-1"
                    style={{
                      borderColor: tokens.colors.border,
                      color: tokens.colors.textInput,
                    }}
                  />
                ) : (
                  <span
                    className="flex-1 truncate"
                    title={profileData.nombre || ''}
                    style={{ color: tokens.colors.textPrimary }}
                  >
                    {profileData.nombre || ''}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <Mail size={32} style={{ color: tokens.colors.primary }} />
                <span
                  className="flex-1 truncate"
                  title={profileData.email || ''}
                  style={{ color: tokens.colors.textPrimary }}
                >
                  {profileData.email || ''}
                </span>
              </div>

              {/* CUIT */}
              <div className="flex items-center gap-4">
                <CreditCard size={32} style={{ color: tokens.colors.primary }} />
                <span
                  className="flex-1 truncate"
                  title={profileData.cuit}
                  style={{ color: tokens.colors.textPrimary }}
                >
                  {profileData.cuit}
                </span>
              </div>

              {/* Address (Admin) or Alias (Mozo) */}
              {isAdmin ? (
                <div className="flex items-center gap-4">
                  <Home size={32} style={{ color: tokens.colors.primary }} />
                  {isEditing ? (
                    <input
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 flex-1"
                      style={{
                        borderColor: tokens.colors.border,
                        color: tokens.colors.textInput,
                      }}
                    />
                  ) : (
                    <span
                      className="flex-1 truncate"
                      title={profileData.address}
                      style={{ color: tokens.colors.textPrimary }}
                    >
                      {profileData.address}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Wallet size={32} style={{ color: tokens.colors.primary }} />
                  {isEditing ? (
                    <input
                      name="alias"
                      value={profileData.alias}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 flex-1"
                      style={{
                        borderColor: tokens.colors.border,
                        color: tokens.colors.textInput,
                      }}
                    />
                  ) : (
                    <span
                      className="flex-1 truncate"
                      title={profileData.alias}
                      style={{ color: tokens.colors.textPrimary }}
                    >
                      {profileData.alias}
                    </span>
                  )}
                </div>
              )}
            </div>
          </StatCard>

          {/* Mozo Stats Cards */}
          {profileData.rol === 'Mozo' && (
            <div className="grid grid-rows-3 gap-6 hidden md:grid">
              <StatCard title={tMozo('totalTipsAmount')} isLoading={isLoadingMozoStats}>
                <div className="text-lg font-bold" style={{ color: tokens.colors.textPrimary }}>
                  $ {mozoStats?.tips || 0}
                </div>
                <p className="text-xs" style={{ color: tokens.colors.textMuted }}>
                  {tMozo('last7Days')}
                </p>
              </StatCard>
              <StatCard title={tMozo('averageRating')} isLoading={isLoadingMozoStats}>
                <div className="text-lg font-bold" style={{ color: tokens.colors.textPrimary }}>
                  {mozoStats?.promedio || 0}
                  <span className="ml-1" style={{ color: tokens.colors.primary }}>
                    ★
                  </span>
                </div>
                <p className="text-xs" style={{ color: tokens.colors.textMuted }}>
                  {tMozo('weeklyReviews')}
                </p>
              </StatCard>
              <StatCard title={tMozo('attendedTables')} isLoading={isLoadingMozoStats}>
                <div className="text-lg font-bold" style={{ color: tokens.colors.textPrimary }}>
                  {mozoStats?.cant || 0}
                </div>
                <p className="text-xs" style={{ color: tokens.colors.textMuted }}>
                  {tMozo('thisWeek')}
                </p>
              </StatCard>
            </div>
          )}
        </div>
      </div>

      {/* Staff Management Modal */}
      {isAdmin && (
        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setErrorMessage('');
            setSuccessMessage('');
            setSelectedRole('');
            setCuitInput('');
            setModalContent(null);
          }}
          modalContent={modalContent}
          roles={roles}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          cuitInput={cuitInput}
          onCuitInputChange={setCuitInput}
          onSearch={handleSearchEmployee}
          onAdd={handleAddStaff}
          onDelete={handleDeleteStaff}
          errorMessage={errorMessage}
          successMessage={successMessage}
          showSearch={true}
        />
      )}
    </main>
  );
}

