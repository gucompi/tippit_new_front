'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { trpc } from '@/lib/trpc';
import { PageHeader } from '@/components/business/PageHeader';
import { AddCard } from '@/components/qrs/AddCard';
import { EmployeeCard } from './EmployeeCard';
import { RoleCard } from './RoleCard';
import { FiltersAndTabs } from './FiltersAndTabs';
import { Skeleton } from '@/components/ui';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { EmployeeForm } from './EmployeeForm';
import { VincularMPForm } from './VincularMPForm';
import { EmployeePagination } from './EmployeePagination';
import { toast } from 'react-hot-toast';
import { Plus } from 'lucide-react';

export function StaffScreen() {
  const t = useTranslations('staff');
  const [tab, setTab] = useState<'personal' | 'roles'>('personal');
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showAddRole, setShowAddRole] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [newRole, setNewRole] = useState({ nombre: '', color: '#FF6B6B', porcentaje: 0 });
  const [menuOpen, setMenuOpen] = useState<{ type: string | null; id: string | null }>({
    type: null,
    id: null,
  });
  const cardMenuRef = useRef<Record<string, HTMLDivElement | null>>({});
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    type: string | null;
    id: string | null;
    name: string;
  }>({
    isOpen: false,
    type: null,
    id: null,
    name: '',
  });
  const [showAddPersonal, setShowAddPersonal] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [editingPersonalData, setEditingPersonalData] = useState<Employee | null>(null);
  const [vincularMPData, setVincularMPData] = useState<Employee | null>(null);
  const [showVincularMP, setShowVincularMP] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalConfig, setSuccessModalConfig] = useState({
    title: '',
    message: '',
    type: 'success' as 'success' | 'error',
  });
  const [showPercentageError, setShowPercentageError] = useState(false);
  const [percentageErrorMessage, setPercentageErrorMessage] = useState('');
  const [page, setPage] = useState(1);
  const employeesPerPage = 10;

  // Fetch employees
  const { data: employeesData, isLoading: isLoadingEmployees, refetch: refetchEmployees } =
    trpc.staff.getEmployees.useQuery(
      { page, per_page: employeesPerPage, search: searchTerm.length >= 3 ? searchTerm : undefined },
      {
        staleTime: 30 * 1000,
      }
    );

  // Fetch all employees (for role assignment)
  const { data: allEmployeesData } = trpc.staff.getAllEmployees.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  // Fetch roles
  const { data: rolesData, refetch: refetchRoles } = trpc.staff.getRoles.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  // Mutations
  const createRoleMutation = trpc.staff.createRole.useMutation({
    onSuccess: () => {
      setSuccessModalConfig({
        title: t('roleCreated', { defaultValue: 'Role Created' }),
        message: t('roleCreatedSuccessfully', { defaultValue: 'The new role has been created successfully.' }),
        type: 'success',
      });
      setShowSuccessModal(true);
      refetchRoles();
      setShowAddRole(false);
      setNewRole({ nombre: '', color: '#FF6B6B', porcentaje: 0 });
    },
    onError: (error: any) => {
      if (error.message?.includes('percentage') || error.message?.includes('100%')) {
        setPercentageErrorMessage(error.message);
        setShowPercentageError(true);
      } else {
        toast.error(error.message || t('roleCreateError', { defaultValue: 'Error creating role' }));
      }
    },
  });

  const updateRoleMutation = trpc.staff.updateRole.useMutation({
    onSuccess: () => {
      setSuccessModalConfig({
        title: t('roleUpdated', { defaultValue: 'Role Updated' }),
        message: t('roleUpdatedSuccessfully', { defaultValue: 'The role has been updated successfully.' }),
        type: 'success',
      });
      setShowSuccessModal(true);
      refetchRoles();
      setShowEditRole(false);
      setEditingRole(null);
      setNewRole({ nombre: '', color: '#FF6B6B', porcentaje: 0 });
    },
    onError: (error: any) => {
      if (error.message?.includes('percentage') || error.message?.includes('100%')) {
        setPercentageErrorMessage(error.message);
        setShowPercentageError(true);
      } else {
        toast.error(error.message || t('roleUpdateError', { defaultValue: 'Error updating role' }));
      }
    },
  });

  const deleteRoleMutation = trpc.staff.deleteRole.useMutation({
    onSuccess: () => {
      setSuccessModalConfig({
        title: t('roleDeleted', { defaultValue: 'Role Deleted' }),
        message: t('roleDeletedSuccessfully', { defaultValue: 'The role has been deleted successfully.' }),
        type: 'success',
      });
      setShowSuccessModal(true);
      refetchRoles();
      refetchEmployees();
      setConfirmDelete({ isOpen: false, type: null, id: null, name: '' });
    },
    onError: (error: any) => {
      toast.error(error.message || t('roleDeleteError', { defaultValue: 'Error deleting role' }));
    },
  });

  const deleteEmployeeMutation = trpc.staff.deleteEmployee.useMutation({
    onSuccess: () => {
      setSuccessModalConfig({
        title: t('employeeDeleted', { defaultValue: 'Employee Deleted' }),
        message: t('employeeDeletedSuccessfully', { defaultValue: 'The employee has been deleted successfully.' }),
        type: 'success',
      });
      setShowSuccessModal(true);
      refetchEmployees();
      setConfirmDelete({ isOpen: false, type: null, id: null, name: '' });
    },
    onError: (error: any) => {
      toast.error(error.message || t('employeeDeleteError', { defaultValue: 'Error deleting employee' }));
    },
  });

  const updateEmployeeRoleMutation = trpc.staff.updateEmployeeRole.useMutation({
    onSuccess: () => {
      toast.success(t('employeeRoleUpdated', { defaultValue: 'Employee role updated successfully' }));
      refetchEmployees();
    },
    onError: (error: any) => {
      toast.error(error.message || t('employeeRoleUpdateError', { defaultValue: 'Error updating employee role' }));
    },
  });

  interface Employee {
    id: string;
    nombre: string;
    telefono?: string;
    email?: string;
    rol: string;
    foto?: string | null;
    cuit: string;
    alias?: string;
    vinculado_mp?: boolean;
    has_link_to_mp?: boolean;
  }

  const employees = employeesData?.employees || [];
  const allEmployees = allEmployeesData?.employees || [];
  const roles = rolesData?.roles || [];

  const roleNames = useMemo(() => roles.map((r) => r.name), [roles]);

  const totalRolesPercentage = useMemo(() => {
    return roles.reduce((sum, role) => sum + (role.percentage || 0), 0);
  }, [roles]);

  const remainingPercentage = useMemo(() => {
    if (editingRole) {
      const currentRolePercentage = editingRole.percentage || 0;
      return 100 - (totalRolesPercentage - currentRolePercentage);
    }
    return 100 - totalRolesPercentage;
  }, [totalRolesPercentage, editingRole]);

  const orderOptions = useMemo(() => [t('name', { defaultValue: 'Name' })], [t]);

  const handleOrderChange = useCallback(
    (selectedOrder: string) => {
      if (selectedOrder === order) {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setOrder(selectedOrder);
        setSortDirection('asc');
      }
    },
    [order]
  );

  const filteredEmployees = useMemo(() => {
    // For paginated results, we don't need to filter again as the API handles it
    return employees;
  }, [employees]);

  const filteredRoles = useMemo(() => {
    return roles;
  }, [roles]);

  const handleAddRole = useCallback(() => {
    setShowAddRole(true);
    setShowEditRole(false);
    setEditingRole(null);
    setNewRole({ nombre: '', color: '#FF6B6B', porcentaje: 0 });
  }, []);

  const handleCloseAddRole = useCallback(() => {
    setShowAddRole(false);
    setNewRole({ nombre: '', color: '#FF6B6B', porcentaje: 0 });
  }, []);

  const handleEditRole = useCallback((type: string, id: string, role: any) => {
    setEditingRole(role);
    setNewRole({ nombre: role.name, color: role.color, porcentaje: role.percentage });
    setShowEditRole(true);
    setShowAddRole(false);
  }, []);

  const handleCloseEditRole = useCallback(() => {
    setShowEditRole(false);
    setEditingRole(null);
    setNewRole({ nombre: '', color: '#FF6B6B', porcentaje: 0 });
  }, []);

  const handleSubmitRole = useCallback(() => {
    if (!newRole.nombre || !newRole.color || !newRole.porcentaje) {
      toast.error(t('pleaseCompleteFields', { defaultValue: 'Please complete all required fields' }));
      return;
    }

    if (editingRole) {
      updateRoleMutation.mutate({
        id: editingRole.id,
        name: newRole.nombre,
        color: newRole.color,
        percentage: newRole.porcentaje,
      });
    } else {
      createRoleMutation.mutate({
        name: newRole.nombre,
        color: newRole.color,
        percentage: newRole.porcentaje,
      });
    }
  }, [newRole, editingRole, createRoleMutation, updateRoleMutation, t]);

  const handleMenuOpen = useCallback((type: string | null, id: string | null) => {
    setMenuOpen({ type, id });
  }, []);

  const handleDelete = useCallback((type: string, id: string) => {
    const item = type === 'personal' ? employees.find((e) => e.id === id) : roles.find((r) => r.id === id);
    setConfirmDelete({
      isOpen: true,
      type,
      id,
      name: item?.nombre || item?.name || '',
    });
  }, [employees, roles]);

  const handleConfirmDelete = useCallback(() => {
    if (confirmDelete.type === 'personal') {
      deleteEmployeeMutation.mutate({ id: confirmDelete.id! });
    } else if (confirmDelete.type === 'rol') {
      deleteRoleMutation.mutate({ id: confirmDelete.id! });
    }
  }, [confirmDelete, deleteEmployeeMutation, deleteRoleMutation]);

  const handleCancelDelete = useCallback(() => {
    setConfirmDelete({ isOpen: false, type: null, id: null, name: '' });
  }, []);

  const handleRoleChange = useCallback(
    (cuit: string, newRole: string) => {
      const employee = employees.find((e) => e.cuit === cuit);
      if (!employee) return;

      const role = roles.find((r) => r.name === newRole);
      if (!role) return;

      updateEmployeeRoleMutation.mutate({
        employee_id: employee.id,
        role_id: role.id,
      });
    },
    [employees, roles, updateEmployeeRoleMutation]
  );

  const createEmployeeMutation = trpc.staff.createEmployee.useMutation({
    onSuccess: () => {
      setSuccessModalConfig({
        title: t('employeeAdded', { defaultValue: 'Employee Added' }),
        message: t('employeeAddedSuccessfully', { defaultValue: 'The new employee has been added successfully.' }),
        type: 'success',
      });
      setShowSuccessModal(true);
      refetchEmployees();
      setShowAddPersonal(false);
    },
    onError: (error: any) => {
      toast.error(error.message || t('errorAddingEmployee', { defaultValue: 'Error adding the employee.' }));
    },
  });

  const updateEmployeeMutation = trpc.staff.updateEmployee.useMutation({
    onSuccess: () => {
      setSuccessModalConfig({
        title: t('employeeUpdated', { defaultValue: 'Employee Updated' }),
        message: t('employeeUpdatedSuccessfully', { defaultValue: 'The employee data has been updated successfully.' }),
        type: 'success',
      });
      setShowSuccessModal(true);
      refetchEmployees();
      setShowAddPersonal(false);
      setIsEditingPersonal(false);
      setEditingPersonalData(null);
    },
    onError: (error: any) => {
      toast.error(error.message || t('errorUpdatingEmployee', { defaultValue: 'Error updating the employee.' }));
    },
  });

  const linkMercadoPagoMutation = trpc.staff.linkMercadoPago.useMutation({
    onSuccess: () => {
      setSuccessModalConfig({
        title: t('employeeLinked', { defaultValue: 'Employee Linked' }),
        message: t('employeeLinkedSuccessfully', { defaultValue: 'The employee has been linked successfully.' }),
        type: 'success',
      });
      setShowSuccessModal(true);
      refetchEmployees();
      setShowVincularMP(false);
      setVincularMPData(null);
    },
    onError: (error: any) => {
      toast.error(error.message || t('errorLinkingMP', { defaultValue: 'Error linking MercadoPago' }));
    },
  });

  const handleAddPersonal = useCallback(() => {
    setShowAddPersonal(true);
    setIsEditingPersonal(false);
    setEditingPersonalData(null);
  }, []);

  const handleEditEmployee = useCallback((employee: Employee) => {
    setEditingPersonalData(employee);
    setIsEditingPersonal(true);
    setShowAddPersonal(true);
  }, []);

  const handleVincularMP = useCallback((employee: Employee) => {
    setVincularMPData(employee);
    setShowVincularMP(true);
  }, []);

  const handleCloseAddPersonal = useCallback(() => {
    setShowAddPersonal(false);
    setIsEditingPersonal(false);
    setEditingPersonalData(null);
  }, []);

  const handleCloseVincularMP = useCallback(() => {
    setShowVincularMP(false);
    setVincularMPData(null);
  }, []);

  const handleSubmitPersonal = useCallback(
    async (data: any) => {
      if (isEditingPersonal && editingPersonalData) {
        const role = roles.find((r) => r.name === data.rol);
        await updateEmployeeMutation.mutateAsync({
          id: editingPersonalData.id!,
          nombre: data.nombre || `${data.first_name} ${data.last_name}`.trim(),
          email: data.email,
          telefono: data.telefono,
          role_id: role?.id,
          foto: data.foto ? await fileToBase64(data.foto) : undefined,
        });
      } else {
        const role = roles.find((r) => r.name === data.role);
        await createEmployeeMutation.mutateAsync({
          cuit: data.cuit,
          nombre: data.employee.nombre || data.employee.name,
          email: data.employee.email,
          telefono: data.employee.telefono || data.employee.phone,
          role_id: role?.id || '',
        });
      }
    },
    [isEditingPersonal, editingPersonalData, roles, createEmployeeMutation, updateEmployeeMutation]
  );

  const handleSubmitVincularMP = useCallback(
    async (data: { phoneNumber: string; cuit: string }) => {
      if (!vincularMPData?.id) return;
      await linkMercadoPagoMutation.mutateAsync({
        employee_id: vincularMPData.id,
        mp_data: {
          access_token: 'mock_token',
          user_id: 'mock_user_id',
        },
      });
    },
    [vincularMPData, linkMercadoPagoMutation]
  );

  const handleEmployeeFound = useCallback(
    (employeeData: any) => {
      const existingEmployee = allEmployees.find((emp) => emp.cuit === employeeData.cuit);
      if (existingEmployee) {
        return {
          isValid: false,
          message: `${t('employeeAlreadyRegistered', { defaultValue: 'The employee is already registered in your restaurant with the role' })} "${existingEmployee.rol}". ${t('cannotSameEmployeeMultipleRoles', { defaultValue: 'It is not possible to have the same employee with multiple roles.' })}`,
        };
      }
      return { isValid: true };
    },
    [allEmployees, t]
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen.type && cardMenuRef.current) {
        const menuKey = menuOpen.type + menuOpen.id;
        const cardElement = cardMenuRef.current[menuKey];
        if (cardElement && !cardElement.contains(event.target as Node)) {
          setMenuOpen({ type: null, id: null });
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const colorOptions = [
    { value: '#FF6B6B', label: t('red', { defaultValue: 'Red' }) },
    { value: '#4ECDC4', label: t('green', { defaultValue: 'Green' }) },
    { value: '#45B7D1', label: t('blue', { defaultValue: 'Blue' }) },
    { value: '#FFA07A', label: t('orange', { defaultValue: 'Orange' }) },
    { value: '#DDA0DD', label: t('purple', { defaultValue: 'Purple' }) },
  ];

  const porcentajeOptions = Array.from({ length: 20 }, (_, i) => (i + 1) * 5); // 5, 10, 15, ..., 100

  return (
    <main className="flex-1">
      <PageHeader titleKey="staff.title" tooltipKey="staff.pageHeaderTooltip" showNotificationIcon={true} />

      <FiltersAndTabs
        tab={tab}
        setTab={setTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        order={order}
        setOrder={handleOrderChange}
        orderOptions={orderOptions}
        sortDirection={sortDirection}
        filteredItems={tab === 'personal' ? filteredEmployees : filteredRoles}
        totalItems={tab === 'personal' ? (employeesData?.total || employees.length) : roles.length}
        totalRolesPercentage={totalRolesPercentage}
        loading={isLoadingEmployees}
      />

      {/* Role Forms */}
      {tab === 'roles' && showAddRole && (
        <div className="bg-white rounded-xl border border-[#E1E1E1] p-6 mb-6 flex flex-col gap-4 relative mx-4 my-6">
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl"
            onClick={handleCloseAddRole}
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-2">{t('addRole', { defaultValue: 'Add Role' })}</h2>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">
                {t('percentageAvailable', { defaultValue: 'Percentage available' })}: {remainingPercentage}%
              </span>
              <br />
              <span className="text-xs">{t('totalRolesCannotExceed', { defaultValue: 'The total of all roles cannot exceed 100%' })}</span>
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 flex flex-col gap-2">
              <label htmlFor="role-name" className="text-sm font-semibold">
                {t('name', { defaultValue: 'Name' })}
              </label>
              <input
                id="role-name"
                type="text"
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder={t('enterRoleName', { defaultValue: 'Enter the role name' })}
                value={newRole.nombre}
                onChange={(e) => setNewRole((prev) => ({ ...prev, nombre: e.target.value }))}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label htmlFor="role-color" className="text-sm font-semibold">
                {t('color', { defaultValue: 'Color' })}
              </label>
              <select
                id="role-color"
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={newRole.color}
                onChange={(e) => setNewRole((prev) => ({ ...prev, color: e.target.value }))}
              >
                <option value="">{t('selectColor', { defaultValue: 'Select color' })}</option>
                {colorOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label htmlFor="role-percentage" className="text-sm font-semibold">
                {t('percentage', { defaultValue: 'Percentage' })}
              </label>
              <select
                id="role-percentage"
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={newRole.porcentaje}
                onChange={(e) => setNewRole((prev) => ({ ...prev, porcentaje: Number(e.target.value) }))}
              >
                <option value={0}>{t('selectPercentage', { defaultValue: 'Select percentage' })}</option>
                {porcentajeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}%
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 mt-auto">
              <button
                type="button"
                className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition mt-6 md:mt-0 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleSubmitRole}
                disabled={createRoleMutation.isLoading || !newRole.nombre || !newRole.color || !newRole.porcentaje}
              >
                {createRoleMutation.isLoading ? t('creating', { defaultValue: 'Creating...' }) : t('addRoleButton', { defaultValue: 'Add Role' })}
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'roles' && showEditRole && (
        <div className="bg-white rounded-xl border border-[#E1E1E1] p-6 mb-6 flex flex-col gap-4 relative mx-4 my-6">
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl"
            onClick={handleCloseEditRole}
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-2">{t('editRole', { defaultValue: 'Edit Role' })}</h2>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">
                {t('percentageAvailable', { defaultValue: 'Percentage available' })}: {remainingPercentage}%
              </span>
              <br />
              <span className="text-xs">{t('totalRolesCannotExceed', { defaultValue: 'The total of all roles cannot exceed 100%' })}</span>
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 flex flex-col gap-2">
              <label htmlFor="edit-role-name" className="text-sm font-semibold">
                {t('name', { defaultValue: 'Name' })}
              </label>
              <input
                id="edit-role-name"
                type="text"
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder={t('enterRoleName', { defaultValue: 'Enter the role name' })}
                value={newRole.nombre}
                onChange={(e) => setNewRole((prev) => ({ ...prev, nombre: e.target.value }))}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label htmlFor="edit-role-color" className="text-sm font-semibold">
                {t('color', { defaultValue: 'Color' })}
              </label>
              <select
                id="edit-role-color"
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={newRole.color}
                onChange={(e) => setNewRole((prev) => ({ ...prev, color: e.target.value }))}
              >
                <option value="">{t('selectColor', { defaultValue: 'Select color' })}</option>
                {colorOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label htmlFor="edit-role-percentage" className="text-sm font-semibold">
                {t('percentage', { defaultValue: 'Percentage' })}
              </label>
              <select
                id="edit-role-percentage"
                className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                value={newRole.porcentaje}
                onChange={(e) => setNewRole((prev) => ({ ...prev, porcentaje: Number(e.target.value) }))}
              >
                <option value={0}>{t('selectPercentage', { defaultValue: 'Select percentage' })}</option>
                {porcentajeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}%
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 mt-auto">
              <button
                type="button"
                className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition mt-6 md:mt-0 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleSubmitRole}
                disabled={updateRoleMutation.isLoading || !newRole.nombre || !newRole.color || !newRole.porcentaje}
              >
                {updateRoleMutation.isLoading ? t('updating', { defaultValue: 'Updating...' }) : t('updateRoleButton', { defaultValue: 'Update Role' })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee/Role Grid */}
      <div className="employee-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 justify-items-center items-start mx-4 my-6">
        {tab === 'personal' ? (
          <>
            <AddCard
              title={t('addWorker', { defaultValue: 'Add Worker' })}
              description={t('addWorkerDescription', { defaultValue: 'Add a new worker and then assign a role to them.' })}
              buttonText={t('add', { defaultValue: 'Add' })}
              onClick={handleAddPersonal}
              icon={Plus}
            />
            {isLoadingEmployees ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">{t('loadingEmployees', { defaultValue: 'Loading employees...' })}</p>
                </div>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">{t('noEmployeesFound', { defaultValue: 'No employees found' })}</p>
              </div>
            ) : (
              filteredEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  backendRoles={roles}
                  roleNames={roleNames}
                  menuOpen={menuOpen}
                  onMenuOpen={handleMenuOpen}
                  onEditEmployee={handleEditEmployee}
                  onVincularMP={handleVincularMP}
                  onDeleteEmployee={handleDelete}
                  onRoleChange={handleRoleChange}
                  cardMenuRef={cardMenuRef}
                />
              ))
            )}
          </>
        ) : (
          <>
            <AddCard
              title={t('addRole', { defaultValue: 'Add Role' })}
              description={t('addRoleDescription', { defaultValue: 'Add a new role and then assign a percentage of tip.' })}
              buttonText={t('addRole', { defaultValue: 'Add Role' })}
              onClick={handleAddRole}
              icon={Plus}
            />
            {roles.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">{t('noRolesFound', { defaultValue: 'No roles found. Add your first role.' })}</p>
              </div>
            ) : (
              filteredRoles.map((role, index) => {
                const employeesWithThisRole = allEmployees.filter((emp) => emp.rol === role.name);
                return (
                  <RoleCard
                    key={role.id}
                    role={role}
                    index={index}
                    menuOpen={menuOpen}
                    onMenuOpen={handleMenuOpen}
                    onEditRole={handleEditRole}
                    onDeleteRole={handleDelete}
                    cardMenuRef={cardMenuRef}
                    totalRoles={roles.length}
                    employeesCount={employeesWithThisRole.length}
                  />
                );
              })
            )}
          </>
        )}
      </div>

      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={
          confirmDelete.type === 'personal'
            ? t('confirmEmployeeDeletion', { defaultValue: 'Confirm employee deletion' })
            : t('confirmRoleDeletion', { defaultValue: 'Confirm role deletion' })
        }
        message={
          confirmDelete.type === 'personal'
            ? `${t('sureDeleteEmployee', { defaultValue: 'Are you sure you want to delete the employee' })} ${confirmDelete.name}?`
            : `${t('sureDeleteRole', { defaultValue: 'Are you sure you want to delete the role' })} ${confirmDelete.name}?`
        }
        confirmText={t('delete', { defaultValue: 'Delete' })}
        cancelText={t('cancel', { defaultValue: 'Cancel' })}
        isLoading={deleteEmployeeMutation.isLoading || deleteRoleMutation.isLoading}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successModalConfig.title}
        message={successModalConfig.message}
        type={successModalConfig.type}
      />

      <SuccessModal
        isOpen={showPercentageError}
        onClose={() => setShowPercentageError(false)}
        title={t('error', { defaultValue: 'Error' })}
        message={percentageErrorMessage}
        type="error"
      />

      <EmployeeForm
        isOpen={showAddPersonal}
        onClose={handleCloseAddPersonal}
        onSubmit={handleSubmitPersonal}
        onEmployeeFound={handleEmployeeFound}
        isEditing={isEditingPersonal}
        employeeData={editingPersonalData}
        backendRoles={roles}
        isSubmitting={createEmployeeMutation.isLoading || updateEmployeeMutation.isLoading}
      />

      <VincularMPForm
        isOpen={showVincularMP}
        onClose={handleCloseVincularMP}
        onSubmit={handleSubmitVincularMP}
        vincularMPData={vincularMPData}
      />
    </main>
  );
}

