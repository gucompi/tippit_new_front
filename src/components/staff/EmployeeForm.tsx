'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { X, Upload, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'react-hot-toast';

interface Employee {
  id?: string;
  nombre?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  telefono?: string;
  cuit: string;
  rol?: string;
  alias?: string;
  foto?: string | null;
}

interface Role {
  id: string;
  name: string;
  color: string;
  percentage: number;
}

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  onEmployeeFound?: (employeeData: any) => { isValid: boolean; message?: string } | null;
  isEditing?: boolean;
  employeeData?: Employee | null;
  backendRoles?: Role[];
  isSubmitting?: boolean;
}

export function EmployeeForm({
  isOpen,
  onClose,
  onSubmit,
  onEmployeeFound,
  isEditing = false,
  employeeData = null,
  backendRoles = [],
  isSubmitting = false,
}: EmployeeFormProps) {
  const t = useTranslations('staff');
  const [formData, setFormData] = useState({
    nombre: '',
    first_name: '',
    last_name: '',
    email: '',
    telefono: '',
    cuit: '',
    rol: '',
    alias: '',
    foto: null as File | null,
  });
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [searchCuit, setSearchCuit] = useState('');
  const [foundEmployee, setFoundEmployee] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const utils = trpc.useUtils();

  useEffect(() => {
    if (isOpen) {
      if (isEditing && employeeData) {
        setFormData({
          nombre: employeeData.nombre || '',
          first_name: employeeData.first_name || '',
          last_name: employeeData.last_name || '',
          email: employeeData.email || '',
          telefono: employeeData.telefono || '',
          cuit: employeeData.cuit || '',
          rol: employeeData.rol || '',
          alias: employeeData.alias || '',
          foto: null,
        });
        if (employeeData.foto && employeeData.foto !== 'public/Tippit-logo-cuadrado-trasparente-300x300.png') {
          setFotoPreview(employeeData.foto);
        } else {
          setFotoPreview(null);
        }
      } else {
        setSearchCuit('');
        setFoundEmployee(null);
        setSearchError('');
        setSelectedRole('');
        setFormData({
          nombre: '',
          first_name: '',
          last_name: '',
          email: '',
          telefono: '',
          cuit: '',
          rol: '',
          alias: '',
          foto: null,
        });
        setFotoPreview(null);
      }
    }
  }, [isOpen, isEditing, employeeData]);

  const handleCuitChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const limitedValue = numericValue.slice(0, 15);
    setSearchCuit(limitedValue);
    if (searchError) {
      setSearchError('');
    }
  };

  const validateCuit = (cuit: string) => {
    if (!cuit || cuit.length === 0) {
      return t('pleaseEnterCuit', { defaultValue: 'Please enter a CUIT' });
    }
    if (cuit.length < 8) {
      return t('cuitMinimumDigits', { defaultValue: 'CUIT must have at least 8 digits' });
    }
    if (cuit.length > 11) {
      return t('cuitMaximumDigits', { defaultValue: 'CUIT cannot have more than 11 digits' });
    }
    if (!/^\d+$/.test(cuit)) {
      return t('cuitNumbersOnly', { defaultValue: 'CUIT can only contain numbers' });
    }
    return null;
  };

  const searchEmployeeByCuit = useCallback(async () => {
    const validationError = validateCuit(searchCuit);
    if (validationError) {
      setSearchError(validationError);
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setFoundEmployee(null);

    try {
      const result = await utils.staff.searchEmployeeByCuit.fetch({ cuit: searchCuit });
      if (result.found && result.employee) {
        if (onEmployeeFound) {
          const validationResult = onEmployeeFound(result.employee);
          if (validationResult && !validationResult.isValid) {
            setSearchError(validationResult.message || '');
            setFoundEmployee(null);
            return;
          }
        }
        setFoundEmployee(result.employee);
        setSearchError('');
      } else {
        setSearchError(t('noEmployeeFoundCuit', { defaultValue: 'No employee found with that CUIT' }));
      }
    } catch (error: any) {
      console.error('Error searching employee:', error);
      setFoundEmployee(null);
      setSearchError(t('noEmployeeFoundCuit', { defaultValue: 'No employee found with that CUIT' }));
    } finally {
      setIsSearching(false);
    }
  }, [searchCuit, utils, onEmployeeFound, t]);

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value;

    if (field === 'nombre') {
      processedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 70);
    } else if (field === 'first_name' || field === 'last_name') {
      processedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 35);
    } else if (field === 'telefono') {
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 15);
    } else if (field === 'email') {
      processedValue = value.slice(0, 60);
    } else if (field === 'alias') {
      processedValue = value.replace(/[^a-zA-Z0-9.-]/g, '').slice(0, 20);
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors((prev) => ({ ...prev, foto: 'File size must be less than 5MB' }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setValidationErrors((prev) => ({ ...prev, foto: 'File must be an image' }));
        return;
      }
      setFormData((prev) => ({ ...prev, foto: file }));
      setFotoPreview(URL.createObjectURL(file));
      if (validationErrors.foto) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.foto;
          return newErrors;
        });
      }
    }
  };

  const handleDropFoto = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors((prev) => ({ ...prev, foto: 'File size must be less than 5MB' }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setValidationErrors((prev) => ({ ...prev, foto: 'File must be an image' }));
        return;
      }
      setFormData((prev) => ({ ...prev, foto: file }));
      setFotoPreview(URL.createObjectURL(file));
      if (validationErrors.foto) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.foto;
          return newErrors;
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      if (!formData.first_name || formData.first_name.trim().length === 0) {
        setValidationErrors({ first_name: t('firstNameRequired', { defaultValue: 'First name is required' }) });
        return;
      }
      onSubmit(formData);
    } else {
      if (!foundEmployee || !selectedRole) {
        setSearchError(t('pleaseSearchEmployeeSelectRole', { defaultValue: 'Please search for an employee and select a role' }));
        return;
      }

      const linkEmployeeData = {
        cuit: foundEmployee.cuit,
        role: selectedRole,
        employee: foundEmployee,
      };

      onSubmit(linkEmployeeData);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      first_name: '',
      last_name: '',
      email: '',
      telefono: '',
      cuit: '',
      rol: '',
      alias: '',
      foto: null,
    });
    setFotoPreview(null);
    setSearchCuit('');
    setFoundEmployee(null);
    setSearchError('');
    setSelectedRole('');
    setValidationErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-[#FAFAFA] rounded-2xl shadow-lg p-8 w-full max-w-3xl relative animate-fade-in max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl"
          onClick={handleClose}
        >
          <X size={24} />
        </button>
        <h2 className="text-[28px] font-semibold mb-6">
          {isEditing ? t('editWorker', { defaultValue: 'Edit Worker' }) : t('addWorker', { defaultValue: 'Add Worker' })}
        </h2>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="employee-first-name" className="text-sm font-semibold">
                  {t('firstName', { defaultValue: 'First Name' })}
                </label>
                <input
                  id="employee-first-name"
                  type="text"
                  className={`border rounded-full px-4 py-2 ${
                    validationErrors.first_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('enterFirstName', { defaultValue: 'Enter first name' })}
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  required
                />
                {validationErrors.first_name && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.first_name}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="employee-last-name" className="text-sm font-semibold">
                  {t('lastName', { defaultValue: 'Last Name' })}
                </label>
                <input
                  id="employee-last-name"
                  type="text"
                  className={`border rounded-full px-4 py-2 ${
                    validationErrors.last_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('enterLastName', { defaultValue: 'Enter last name' })}
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                />
                {validationErrors.last_name && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.last_name}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="employee-email" className="text-sm font-semibold">
                  {t('email', { defaultValue: 'Email' })}
                </label>
                <input
                  id="employee-email"
                  type="email"
                  className={`border rounded-full px-4 py-2 ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('enterWorkerEmail', { defaultValue: 'Enter worker email' })}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="employee-phone" className="text-sm font-semibold">
                  {t('phone', { defaultValue: 'Phone' })}
                </label>
                <input
                  id="employee-phone"
                  type="tel"
                  className={`border rounded-full px-4 py-2 ${
                    validationErrors.telefono ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('enterWorkerPhone', { defaultValue: 'Enter worker phone' })}
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                />
                {validationErrors.telefono && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.telefono}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="employee-cuit" className="text-sm font-semibold">
                  {t('cuit', { defaultValue: 'CUIT' })}
                </label>
                <input
                  id="employee-cuit"
                  type="text"
                  className={`border rounded-full px-4 py-2 ${
                    validationErrors.cuit ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('enterWorkerCuit', { defaultValue: 'Enter worker CUIT' })}
                  value={formData.cuit}
                  onChange={(e) => handleInputChange('cuit', e.target.value)}
                  required
                />
                {validationErrors.cuit && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.cuit}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="employee-alias" className="text-sm font-semibold">
                  {t('alias', { defaultValue: 'Alias' })}
                </label>
                <input
                  id="employee-alias"
                  type="text"
                  className={`border rounded-full px-4 py-2 ${
                    validationErrors.alias ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('enterWorkerAlias', { defaultValue: 'Enter worker alias' })}
                  value={formData.alias}
                  onChange={(e) => handleInputChange('alias', e.target.value)}
                />
                {validationErrors.alias && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.alias}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="employee-role" className="text-sm font-semibold">
                  {t('role', { defaultValue: 'Role' })}
                </label>
                <select
                  id="employee-role"
                  className={`border rounded-full px-4 py-2 ${
                    validationErrors.rol ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.rol}
                  onChange={(e) => handleInputChange('rol', e.target.value)}
                  required
                >
                  <option value="">{t('select', { defaultValue: 'Select' })}</option>
                  {backendRoles.length > 0 ? (
                    backendRoles.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>{t('noRolesAvailable', { defaultValue: 'No roles available' })}</option>
                  )}
                </select>
                {validationErrors.rol && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.rol}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="input-foto-trabajador" className="text-sm font-semibold mb-2 block">
                {t('profileImage', { defaultValue: 'Profile Image' })}
              </label>
              <div
                className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-pink-50 transition relative ${
                  validationErrors.foto ? 'border-red-500' : 'border-pink-300'
                }`}
                onDrop={handleDropFoto}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('input-foto-trabajador')?.click()}
              >
                {fotoPreview ? (
                  <Image
                    src={fotoPreview}
                    alt="preview"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover mb-2"
                  />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-pink-500 mb-2" />
                    <span className="font-semibold text-gray-500">{t('selectFromDevice', { defaultValue: 'Select from my device' })}</span>
                    <span className="text-xs text-gray-400">{t('alsoDragHere', { defaultValue: 'You can also drag it here.' })}</span>
                  </>
                )}
                <input
                  id="input-foto-trabajador"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFotoChange}
                />
              </div>
              {validationErrors.foto && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.foto}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-pink-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isSubmitting || !formData.first_name || !formData.cuit || !formData.rol}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('updating', { defaultValue: 'Updating...' })}
                  </>
                ) : (
                  t('updateWorker', { defaultValue: 'Update Worker' })
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#FFFFFF] rounded-xl p-6 border-[#E1E1E1]">
              <h3 className="text-lg font-semibold mb-4">{t('searchPersonByCuit', { defaultValue: 'Search person by CUIT' })}</h3>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label htmlFor="search-cuit" className="text-sm mb-2 block">
                    <span className="font-bold text-black">{t('cuit', { defaultValue: 'CUIT' })}</span>{' '}
                    <span className="text-gray-500 font-normal">
                      {t('noDashesSpaces', { defaultValue: '(No dashes or spaces)' })}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="search-cuit"
                      type="text"
                      className={`w-full border rounded-full px-4 py-[11px] pr-16 ${
                        searchCuit.length >= 8 && searchCuit.length <= 11
                          ? 'border-[#EB5998] focus:ring-[#EB5998]'
                          : searchCuit.length > 0
                            ? 'border-red-300 focus:ring-red-300'
                            : 'border-gray-300 focus:ring-pink-300'
                      }`}
                      placeholder="20456987651"
                      value={searchCuit}
                      onChange={(e) => handleCuitChange(e.target.value)}
                      maxLength={11}
                      inputMode="numeric"
                    />
                    <span
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs ${
                        searchCuit.length >= 8 && searchCuit.length <= 11
                          ? 'text-[#EB5998]'
                          : searchCuit.length > 0
                            ? 'text-red-600'
                            : 'text-gray-400'
                      }`}
                    >
                      {searchCuit.length}/11
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="border border-[#EB5998] bg-white text-[#EB5998] px-8 py-[12px] rounded-[10px] hover:bg-[#EB5998] hover:text-white transition disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed mt-6 text-[14px] flex items-center gap-2"
                  onClick={searchEmployeeByCuit}
                  disabled={isSearching || !searchCuit.trim() || searchCuit.length < 8 || !!searchError}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('searching', { defaultValue: 'Searching...' })}
                    </>
                  ) : (
                    t('search', { defaultValue: 'Search' })
                  )}
                </button>
              </div>

              {searchError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">{searchError}</div>
                    <button
                      type="button"
                      className="ml-3 text-red-600 hover:text-red-800 font-semibold text-sm underline"
                      onClick={() => {
                        setSearchError('');
                        setSearchCuit('');
                        setFoundEmployee(null);
                      }}
                    >
                      {t('searchAnother', { defaultValue: 'Search another' })}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {foundEmployee && (
              <div className="border-2 border-pink-300 rounded-xl p-6 bg-[#FFFFFF]">
                <div className="flex items-center gap-4 mb-4">
                  {foundEmployee.foto ? (
                    <Image
                      src={foundEmployee.foto}
                      alt="Employee"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center text-white text-xl font-bold">
                      {(foundEmployee.nombre || foundEmployee.name || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl font-bold">
                      {foundEmployee.nombre || foundEmployee.name}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-bold text-black">{t('cuit', { defaultValue: 'CUIT' })}:</span>{' '}
                        {foundEmployee.cuit}
                      </p>
                      <p>
                        <span className="font-bold text-black">{t('phone', { defaultValue: 'Phone' })}:</span>{' '}
                        {foundEmployee.telefono || foundEmployee.phone || t('notAvailable', { defaultValue: 'Not available' })}
                      </p>
                      <p>
                        <span className="font-bold text-black">{t('alias', { defaultValue: 'Alias' })}:</span>{' '}
                        {foundEmployee.alias || t('notAvailable', { defaultValue: 'Not available' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {foundEmployee && (
              <div className="bg-[#FFFFFF] rounded-xl p-6 border-[#E1E1E1]">
                <h3 className="text-[22px] font-semibold mb-4">{t('assignRole', { defaultValue: 'Assign a role!' })}</h3>
                <div className="flex flex-col gap-2">
                  <label htmlFor="assign-role" className="text-sm font-semibold">
                    {t('role', { defaultValue: 'Role' })}
                  </label>
                  <select
                    id="assign-role"
                    className="border border-gray-300 rounded-full px-4 py-2"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    required
                  >
                    <option value="">{t('selectRole', { defaultValue: 'Select a role' })}</option>
                    {backendRoles.length > 0 ? (
                      backendRoles.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>{t('noRolesAvailable', { defaultValue: 'No roles available' })}</option>
                    )}
                  </select>
                </div>
              </div>
            )}

            {foundEmployee && selectedRole && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-pink-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('adding', { defaultValue: 'Adding...' })}
                    </>
                  ) : (
                    t('add', { defaultValue: 'Add' })
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

