import * as api from '../../../lib/api';
import React, { useState } from 'react';
import { Property, Agent, ActivityLog, ViewType, SystemUser, UserRole } from '../../../types';
import { Logo } from '../../common/Logo';
import { RichTextEditor } from '../../common/RichTextEditor';
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  UserCheck,
  ShieldCheck, 
  User, 
  LogOut, 
  Search, 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  Filter, 
  Upload, 
  Check, 
  ExternalLink, 
  Lock, 
  KeyRound, 
  Image as ImageIcon,
  CheckCircle2,
  FileText,
  Star,
  UserPlus,
  Shield,
  Layers,
  ChevronRight,
  Camera,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface AdminDashboardViewProps {
  properties: Property[];
  catalogAmenities?: Array<{ id: number; name: string }>;
  agents: Agent[];
  activities: ActivityLog[];
  currentUser: SystemUser;
  onUpdateCurrentUser: (user: SystemUser) => void;
  onNavigatePublic: (view: ViewType) => void;
  onLogout: () => void;
  onAddProperty: (newProp: Property) => Promise<Property | null> | void;
  onUpdateProperty: (updatedProp: Property) => Promise<Property | null> | void;
  onDeleteProperty: (id: string) => void;
  /** Sube todas las fotos de golpe. La primera del array queda como portada. */
  onUploadImages?: (propertyId: string, files: File[]) => Promise<Property>;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

// Initial System Roles
const DEFAULT_ROLES: UserRole[] = [
  {
    id: 'role-admin',
    name: 'Administrador',
    description: 'Acceso total al sistema, gestión de propiedades, usuarios, roles y equipo.',
    permissions: {
      canManageProperties: true,
      canManageUsers: true,
      canManageRoles: true,
      canManageAgents: true
    }
  },
  {
    id: 'role-editor',
    name: 'Editor',
    description: 'Creación y edición de propiedades y artículos de la plataforma.',
    permissions: {
      canManageProperties: true,
      canManageUsers: false,
      canManageRoles: false,
      canManageAgents: false
    }
  }
];

const initialsFor = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U';

const ProfileInitials: React.FC<{ name: string; className?: string }> = ({ name, className = '' }) => (
  <div
    aria-label={`Perfil de ${name}`}
    className={`rounded-full bg-[#03459C] text-white font-bold flex items-center justify-center border border-[#022F70] ${className}`}
  >
    {initialsFor(name)}
  </div>
);

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  properties,
  catalogAmenities = [],
  agents,
  activities,
  currentUser,
  onUpdateCurrentUser,
  onNavigatePublic,
  onLogout,
  onAddProperty,
  onUpdateProperty,
  onDeleteProperty,
  onUploadImages,
  onShowToast
}) => {
  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'users' | 'roles' | 'profile'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Users & Roles Local State
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [savingUser, setSavingUser] = useState(false);

  /** Los usuarios se leen del API: la pestaña ya no es una maqueta. */
  const loadUsers = React.useCallback(() => {
    setUsersLoading(true);
    setUsersError('');
    api
      .fetchUsers()
      .then((list) =>
        setSystemUsers(
          list.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            roleId: u.role === 'admin' ? 'role-admin' : 'role-editor',
            roleName: u.roleName,
            photo: '',
            active: u.isActive,
            createdAt: u.createdAt
          }))
        )
      )
      .catch((err) => setUsersError(err.message || 'No se pudieron cargar los usuarios.'))
      .finally(() => setUsersLoading(false));
  }, []);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);
  const [systemRoles, setSystemRoles] = useState<UserRole[]>(DEFAULT_ROLES);

  // Property Search & Filters
  const [propertySearch, setPropertySearch] = useState('');
  const [propertyStatusFilter, setPropertyStatusFilter] = useState('All');

  // Modals State
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Property Form State
  const [formTitle, setFormTitle] = useState('');
  const [formPrice, setFormPrice] = useState<number>(350000);
  const [formType, setFormType] = useState<Property['type']>('Casa');
  const [formStatus, setFormStatus] = useState<Property['status']>('En Venta');
  const [formCity, setFormCity] = useState('Santo Domingo');
  const [formAddress, setFormAddress] = useState('');
  const [formNeighborhood, setFormNeighborhood] = useState('');
  const [formBedrooms, setFormBedrooms] = useState(3);
  const [formBathrooms, setFormBathrooms] = useState(3);
  const [formParking, setFormParking] = useState(2);
  const [formSqft, setFormSqft] = useState(2800);
  const [formAgentId, setFormAgentId] = useState(agents[0]?.id || 'agent-1');
  const [formDescription, setFormDescription] = useState('');
  const [formAmenities, setFormAmenities] = useState<string[]>([]);

  /**
   * Imágenes.
   * `uploadedImages` guarda solo las vistas previas para mostrar en pantalla.
   * `pendingFiles` guarda los archivos reales que se enviarán al servidor.
   * Ambos arrays se mantienen en el MISMO orden: el índice 0 es la portada.
   */
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<(File | null)[]>([]);
  const [savingProperty, setSavingProperty] = useState(false);

  // User Form State
  const [userFormName, setUserFormName] = useState('');
  const [userFormEmail, setUserFormEmail] = useState('');
  const [userFormPhone, setUserFormPhone] = useState('');
  const [userFormRole, setUserFormRole] = useState('role-editor');
  const [userFormPassword, setUserFormPassword] = useState('');

  // Profile Form State
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || '(809) 499-5808');
  const [profileTitle, setProfileTitle] = useState(currentUser.title || 'Asesor Inmobiliario');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Determine active permissions
  const activeRole = systemRoles.find(r => r.name === currentUser.roleName || r.id === currentUser.roleId) || DEFAULT_ROLES[0];
  const canManageUsers = currentUser.roleName === 'Administrador' || activeRole.permissions.canManageUsers;
  const canManageRoles = currentUser.roleName === 'Administrador' || activeRole.permissions.canManageRoles;
  const canManageAgents = currentUser.roleName === 'Administrador' || activeRole.permissions.canManageAgents;
  const amenityOptions = Array.from(
    new Set([
      ...catalogAmenities.map((amenity) => amenity.name),
      ...properties.flatMap((property) => property.amenities)
    ])
  ).sort();

  /**
   * Selección de fotos. Se pueden elegir todas de una vez.
   * Se guardan los archivos y una vista previa local; la subida real
   * al servidor ocurre al guardar la propiedad.
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: File[] = Array.from(files);
    const previews = fileList.map((file) => URL.createObjectURL(file));

    setUploadedImages((prev) => [...prev, ...previews]);
    setPendingFiles((prev) => [...prev, ...fileList]);
    onShowToast(
      `${fileList.length} foto(s) añadidas. La primera será la portada.`,
      'success'
    );
    e.target.value = '';
  };

  /** Mueve una foto al primer puesto: pasa a ser la portada. */
  const handleMakeHero = (index: number) => {
    if (index === 0) return;
    setUploadedImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
    setPendingFiles((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
    onShowToast('Esta foto será la portada de la propiedad.', 'info');
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Open Property Modal
  const handleOpenPropertyModal = (propertyToEdit?: Property) => {
    if (propertyToEdit) {
      setEditingProperty(propertyToEdit);
      setFormTitle(propertyToEdit.title);
      setFormPrice(propertyToEdit.price);
      setFormType(propertyToEdit.type);
      setFormStatus(propertyToEdit.status);
      setFormCity(propertyToEdit.city);
      setFormAddress(propertyToEdit.address);
      setFormNeighborhood(propertyToEdit.neighborhood);
      setFormBedrooms(propertyToEdit.bedrooms);
      setFormBathrooms(propertyToEdit.bathrooms);
      setFormParking(propertyToEdit.garageSpaces);
      setFormSqft(propertyToEdit.sqft);
      setFormAgentId(propertyToEdit.agentId);
      setFormDescription(propertyToEdit.description);
      setFormAmenities(propertyToEdit.amenities);

      // Las fotos ya guardadas se muestran como URL; no hay archivo que resubir.
      const existing = propertyToEdit.galleryImages.length
        ? propertyToEdit.galleryImages
        : propertyToEdit.heroImage
          ? [propertyToEdit.heroImage]
          : [];
      setUploadedImages(existing);
      setPendingFiles(existing.map(() => null));
    } else {
      setEditingProperty(null);
      setFormTitle('');
      setFormPrice(0);
      setFormType('Casa');
      setFormStatus('En Venta');
      setFormCity('Santo Domingo');
      setFormAddress('');
      setFormNeighborhood('');
      setFormBedrooms(3);
      setFormBathrooms(2);
      setFormParking(0);
      setFormSqft(0);
      setFormAgentId(agents[0]?.id || 'greizy');
      setFormDescription('');
      setFormAmenities([]);
      setUploadedImages([]);
      setPendingFiles([]);
    }
    setIsPropertyModalOpen(true);
  };

  /**
   * Guarda la propiedad y sube las fotos nuevas en una sola petición.
   * El servidor respeta el orden de envío, así que la primera del array
   * queda como portada y el resto forma la galería.
   */
  const handleSavePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadedImages.length === 0) {
      onShowToast('Añade al menos una foto: la primera será la portada.', 'info');
      return;
    }
    if (!formTitle.trim()) {
      onShowToast('El título es obligatorio.', 'info');
      return;
    }

    setSavingProperty(true);
    try {
      const base = {
        title: formTitle,
        price: Number(formPrice),
        type: formType,
        status: formStatus,
        city: formCity,
        address: formAddress,
        neighborhood: formNeighborhood,
        bedrooms: Number(formBedrooms),
        bathrooms: Number(formBathrooms),
        garageSpaces: Number(formParking),
        sqft: Number(formSqft),
        agentId: formAgentId,
        description: formDescription,
        amenities: formAmenities,
        pricePerSqFt: Math.round(Number(formPrice) / (Number(formSqft) || 1))
      };

      let saved: Property | null = null;

      if (editingProperty) {
        saved = (await onUpdateProperty({ ...editingProperty, ...base } as Property)) || editingProperty;
      } else {
        const newProp = {
          ...base,
          id: '',
          state: '',
          yearBuilt: new Date().getFullYear(),
          lotSize: '—',
          heroImage: uploadedImages[0],
          galleryImages: uploadedImages,
          isFeatured: false,
          coordinates: { lat: 18.4861, lng: -69.9312 }
        } as Property;
        saved = (await onAddProperty(newProp)) || null;
      }

      // Solo se envían los archivos nuevos, en el orden elegido
      const files = pendingFiles.filter((f): f is File => f instanceof File);
      if (saved && files.length && onUploadImages) {
        await onUploadImages(saved.id, files);
      }

      setIsPropertyModalOpen(false);
      setPendingFiles([]);
    } catch (err) {
      onShowToast(`No se pudo guardar: ${(err as Error).message}`, 'info');
    } finally {
      setSavingProperty(false);
    }
  };

  // User Modal Handlers
  const handleOpenUserModal = (userToEdit?: SystemUser) => {
    if (userToEdit) {
      setEditingUser(userToEdit);
      setUserFormName(userToEdit.name);
      setUserFormEmail(userToEdit.email);
      setUserFormPhone(userToEdit.phone || '');
      setUserFormRole(userToEdit.roleId);
    } else {
      setEditingUser(null);
      setUserFormName('');
      setUserFormEmail('');
      setUserFormPhone('');
      setUserFormRole('role-editor');
    }
    setIsUserModalOpen(true);
  };

  /**
   * Crear o actualizar un usuario contra el API.
   * El rol y la contrasena los valida el servidor: aqui solo avisamos.
   */
  const handleSaveUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsersError('');

    const role: 'admin' | 'editor' = userFormRole === 'role-admin' ? 'admin' : 'editor';

    if (!userFormName.trim() || !userFormEmail.trim()) {
      onShowToast('Nombre y correo son obligatorios.', 'info');
      return;
    }

    if (!editingUser) {
      if (userFormPassword.length < 10 || !/\d/.test(userFormPassword)) {
        onShowToast('La contraseña debe tener 10 caracteres e incluir un número.', 'info');
        return;
      }
    }

    setSavingUser(true);
    try {
      if (editingUser) {
        const payload: any = {
          name: userFormName.trim(),
          email: userFormEmail.trim(),
          role
        };
        if (userFormPassword) payload.password = userFormPassword;

        await api.updateUser(editingUser.id, payload);
        onShowToast('Usuario actualizado correctamente.', 'success');
      } else {
        await api.createUser({
          name: userFormName.trim(),
          email: userFormEmail.trim(),
          password: userFormPassword,
          role
        });
        onShowToast('Usuario creado. Ya puede iniciar sesión.', 'success');
      }

      setUserFormPassword('');
      setIsUserModalOpen(false);
      loadUsers();
    } catch (err: any) {
      const msg = err?.details?.length
        ? `${err.message}: ${err.details.map((d: any) => d.message).join(', ')}`
        : err?.message || 'No se pudo guardar el usuario.';
      setUsersError(msg);
      onShowToast(msg, 'info');
    } finally {
      setSavingUser(false);
    }
  };

  /** Activa o desactiva el acceso sin borrar el historial. */
  const handleToggleUserActive = async (user: SystemUser) => {
    try {
      await api.updateUser(user.id, { isActive: !user.active });
      onShowToast(
        user.active ? 'Acceso desactivado.' : 'Acceso reactivado.',
        user.active ? 'info' : 'success'
      );
      loadUsers();
    } catch (err: any) {
      onShowToast(err?.message || 'No se pudo cambiar el estado.', 'info');
    }
  };

  // Profile Update Handler
  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: SystemUser = {
      ...currentUser,
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      title: profileTitle
    };
    onUpdateCurrentUser(updatedUser);
    onShowToast('Perfil de usuario actualizado con éxito.', 'success');
  };

  // Password Change Handler
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      onShowToast('Por favor ingresa tu contraseña actual.', 'info');
      return;
    }
    if (newPassword.length < 6) {
      onShowToast('La nueva contraseña debe tener al menos 6 caracteres.', 'info');
      return;
    }
    if (newPassword !== confirmPassword) {
      onShowToast('La confirmación de la contraseña no coincide.', 'info');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onShowToast('¡Contraseña actualizada correctamente!', 'success');
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(propertySearch.toLowerCase()) ||
      p.id.toLowerCase().includes(propertySearch.toLowerCase()) ||
      p.city.toLowerCase().includes(propertySearch.toLowerCase());
    const matchesStatus = propertyStatusFilter === 'All' || p.status === propertyStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#1F2937] flex flex-col font-montserrat">
      
      {/* TOPBAR */}
      <header className="bg-white border-b border-[#DBE3EE] sticky top-0 z-30 h-16 px-2 sm:px-4 lg:px-6 flex items-center justify-between gap-2 shadow-xs">
        
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-1 sm:gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-[#03459C] rounded-md"
            aria-label={sidebarOpen ? 'Cerrar menú lateral' : 'Abrir menú lateral'}
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 min-w-0">
            <span className="sm:hidden"><Logo size="sm" variant="dark" showText={false} /></span>
            <span className="hidden sm:inline-flex"><Logo size="sm" variant="dark" /></span>
            <span className="hidden lg:inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-[#03459C] text-white rounded-md">
              Panel de Administración
            </span>
          </div>
        </div>

        {/* Center: Active User Role Indicator */}
        <div className="hidden xl:flex items-center gap-2 bg-[#F7FAFC] border border-[#DBE3EE] px-3 py-1.5 rounded-xl text-xs">
          <Shield className="w-4 h-4 text-[#03459C]" />
          <span className="text-gray-500">Sesión activa como:</span>
          <span className="font-bold text-[#03459C]">{currentUser.name}</span>
          <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-[#03459C]/10 text-[#03459C]">
            {currentUser.roleName}
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          
          {/* User Profile Info */}
          <button
            onClick={() => setActiveTab('profile')}
            className="hidden sm:flex items-center gap-2 pl-1 sm:pl-2 hover:opacity-80 transition-opacity"
            title="Ver mi perfil"
          >
            <ProfileInitials name={currentUser.name} className="w-8 h-8 text-[10px]" />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-[#1F2937]">{currentUser.name}</p>
              <p className="text-[9px] text-[#7A8AA3] font-semibold uppercase">{currentUser.roleName}</p>
            </div>
          </button>

          {/* Public Website Button */}
          <button
            onClick={() => onNavigatePublic('home')}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 text-xs font-bold uppercase tracking-wider bg-[#03459C] text-white hover:bg-[#023277] rounded-lg transition-all shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sitio Público</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
            title="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>

      </header>

      <div className="flex-1 flex overflow-hidden min-w-0">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Cerrar menú lateral"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-x-0 top-16 bottom-0 z-10 bg-black/35 lg:hidden"
          />
        )}
        
        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`fixed lg:static top-16 bottom-0 left-0 z-20 w-64 bg-white border-r border-[#DBE3EE] flex flex-col justify-between transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0 overflow-y-auto' : '-translate-x-full lg:translate-x-0 lg:overflow-y-auto'
          }`}
        >
          {/* Sidebar Navigation */}
          <div className="p-4 space-y-6">
            
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-[#7A8AA3] uppercase tracking-widest">
                Menú Principal
              </span>

              <nav className="mt-2 space-y-1">
                
                {/* 1. Panel General */}
                <button
                  onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'overview'
                      ? 'bg-[#03459C] text-white shadow-sm'
                      : 'text-[#1F2937] hover:bg-[#F7FAFC] hover:text-[#03459C]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Panel General</span>
                  </div>
                </button>

                {/* 2. Propiedades */}
                <button
                  onClick={() => { setActiveTab('properties'); setSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'properties'
                      ? 'bg-[#03459C] text-white shadow-sm'
                      : 'text-[#1F2937] hover:bg-[#F7FAFC] hover:text-[#03459C]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building className="w-4 h-4" />
                    <span>Propiedades</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                    activeTab === 'properties' ? 'bg-white text-[#03459C]' : 'bg-[#F7FAFC] text-gray-600 border border-[#DBE3EE]'
                  }`}>
                    {properties.length}
                  </span>
                </button>

                {/* Split Team Section into 3 Views: Usuarios, Roles, Agentes */}
                <div className="pt-3 border-t border-[#DBE3EE] space-y-1">
                  <span className="px-3 text-[10px] font-bold text-[#7A8AA3] uppercase tracking-widest">
                    Gestión de Equipo
                  </span>

                  {/* 3. Usuarios (Only for Admin or permitted roles) */}
                  {canManageUsers && (
                    <button
                      onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        activeTab === 'users'
                          ? 'bg-[#03459C] text-white shadow-sm'
                          : 'text-[#1F2937] hover:bg-[#F7FAFC] hover:text-[#03459C]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4" />
                        <span>Usuarios</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                        activeTab === 'users' ? 'bg-white text-[#03459C]' : 'bg-[#F7FAFC] text-gray-600 border border-[#DBE3EE]'
                      }`}>
                        {systemUsers.length}
                      </span>
                    </button>
                  )}

                  {/* 4. Roles */}
                  {canManageRoles && (
                    <button
                      onClick={() => { setActiveTab('roles'); setSidebarOpen(false); }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        activeTab === 'roles'
                          ? 'bg-[#03459C] text-white shadow-sm'
                          : 'text-[#1F2937] hover:bg-[#F7FAFC] hover:text-[#03459C]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4" />
                        <span>Roles</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                        activeTab === 'roles' ? 'bg-white text-[#03459C]' : 'bg-[#F7FAFC] text-gray-600 border border-[#DBE3EE]'
                      }`}>
                        {systemRoles.length}
                      </span>
                    </button>
                  )}

                </div>

                {/* 5. Perfil */}
                <div className="pt-3 border-t border-[#DBE3EE]">
                  <button
                    onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      activeTab === 'profile'
                        ? 'bg-[#03459C] text-white shadow-sm'
                        : 'text-[#1F2937] hover:bg-[#F7FAFC] hover:text-[#03459C]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4" />
                      <span>Mi Perfil</span>
                    </div>
                  </button>
                </div>

              </nav>
            </div>

            {/* Quick Security Badge */}
            <div className="p-3.5 bg-[#F7FAFC] rounded-xl border border-[#DBE3EE] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#03459C]">
                <ShieldCheck className="w-4 h-4" />
                <span>Greizy González Seguridad</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-normal">
                Sesión segura para el equipo de Greizy González.
              </p>
            </div>

          </div>

          {/* Bottom Logout Button */}
          <div className="p-4 border-t border-[#DBE3EE]">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

        </aside>

        {/* MAIN ADMIN CONTENT AREA */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* VIEW 1: PANEL GENERAL (OVERVIEW) */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DBE3EE] pb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold font-poppins text-[#1F2937]">
                    Panel General
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Resumen general del inventario, equipo disponible y actividades recientes en la plataforma.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenPropertyModal()}
                  className="px-4 py-2.5 bg-[#03459C] hover:bg-[#023277] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 self-start sm:self-auto transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar Nueva Propiedad</span>
                </button>
              </div>

              {/* 2 Main KPI Cards as strictly requested:
                  1. Cantidad de Propiedades
                  2. Agentes o Usuarios Disponibles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* KPI 1: Cantidad de Propiedades */}
                <div className="bg-white p-6 rounded-2xl border border-[#DBE3EE] shadow-sm space-y-3 relative overflow-hidden group hover:border-[#03459C] transition-colors">
                  <div className="flex items-center justify-between text-[#03459C]">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#7A8AA3]">
                      Cantidad de Propiedades
                    </span>
                    <div className="p-3 bg-[#03459C]/10 text-[#03459C] rounded-xl">
                      <Building className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-4xl font-extrabold font-poppins text-[#1F2937]">
                    {properties.length}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 pt-1 border-t border-[#DBE3EE]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Propiedades activas e inmobiliarias disponibles en el catálogo.</span>
                  </p>
                </div>

                {/* KPI 2: Agentes o Usuarios Disponibles */}
                <div className="bg-white p-6 rounded-2xl border border-[#DBE3EE] shadow-sm space-y-3 relative overflow-hidden group hover:border-[#03459C] transition-colors">
                  <div className="flex items-center justify-between text-[#03459C]">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#7A8AA3]">
                      Agentes y Usuarios Disponibles
                    </span>
                    <div className="p-3 bg-[#7A8AA3]/10 text-[#7A8AA3] rounded-xl">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-4xl font-extrabold font-poppins text-[#1F2937]">
                    {systemUsers.length} <span className="text-lg font-medium text-gray-400">({agents.length} Agentes)</span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 pt-1 border-t border-[#DBE3EE]">
                    <UserCheck className="w-4 h-4 text-[#03459C]" />
                    <span>Usuarios y agentes con credenciales de acceso activas.</span>
                  </p>
                </div>

              </div>

              {/* Actividades Recientes */}
              <div className="bg-white rounded-2xl border border-[#DBE3EE] shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#DBE3EE] pb-3">
                  <h2 className="text-lg font-bold font-poppins text-[#1F2937] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#03459C]" />
                    <span>Actividades Recientes</span>
                  </h2>
                  <span className="text-xs text-[#7A8AA3] font-semibold">Registro del sistema</span>
                </div>

                <div className="divide-y divide-[#DBE3EE] text-xs">
                  {activities.map((act) => (
                    <div key={act.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-[#F7FAFC] px-2 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F7FAFC] border border-[#DBE3EE] flex items-center justify-center text-[#03459C] font-bold">
                          <Building className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-[#1F2937] text-sm">{act.action}</p>
                          <span className="text-[11px] text-[#7A8AA3]">Usuario: {act.user}</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-[#F7FAFC] px-2.5 py-1 rounded-full text-gray-500 font-bold border border-[#DBE3EE] whitespace-nowrap">
                        {act.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* VIEW 2: PROPIEDADES (CRUD) */}
          {activeTab === 'properties' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Top Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DBE3EE] pb-4">
                <div>
                  <h1 className="text-2xl font-bold font-poppins text-[#1F2937]">
                    Gestión de Propiedades
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Crea, edita o elimina propiedades publicadas en tiempo real.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenPropertyModal()}
                  className="px-4 py-2.5 bg-[#03459C] hover:bg-[#023277] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar Nueva Propiedad</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="bg-white p-4 rounded-xl border border-[#DBE3EE] flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-[#7A8AA3] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrar por título, ciudad o ID..."
                    value={propertySearch}
                    onChange={(e) => setPropertySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-[#7A8AA3]" />
                  <select
                    value={propertyStatusFilter}
                    onChange={(e) => setPropertyStatusFilter(e.target.value)}
                    className="py-2 px-3 text-xs bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C] text-gray-700"
                  >
                    <option value="All">Todos los estados</option>
                    <option value="En Venta">En Venta</option>
                    <option value="En Alquiler">En Alquiler</option>
                    <option value="Reservada">Reservada</option>
                    <option value="Vendida">Vendida</option>
                  </select>
                </div>
              </div>

              {/* Property Data Table */}
              <div className="bg-white rounded-2xl border border-[#DBE3EE] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-xs text-[#1F2937]">
                    <thead className="bg-[#F7FAFC] text-[10px] uppercase font-bold text-[#7A8AA3] tracking-wider border-b border-[#DBE3EE]">
                      <tr>
                        <th className="p-4">Propiedad</th>
                        <th className="p-4">ID</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4">Precio ($ USD)</th>
                        <th className="p-4">Agente Asignado</th>
                        <th className="p-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DBE3EE]">
                      {filteredProperties.map((prop) => {
                        const assignedAg = agents.find(a => a.id === prop.agentId);
                        return (
                          <tr key={prop.id} className="hover:bg-[#F7FAFC]/70 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <img src={prop.heroImage} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                              <div>
                                <p className="font-bold text-[#1F2937] text-sm line-clamp-1">{prop.title}</p>
                                <p className="text-[11px] text-gray-500">{prop.city}, {prop.neighborhood}</p>
                              </div>
                            </td>
                            <td className="p-4 font-mono text-[11px] text-gray-500">{prop.id}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md ${
                                prop.status === 'En Venta' ? 'bg-emerald-100 text-emerald-800' :
                                prop.status === 'En Alquiler' ? 'bg-blue-100 text-blue-800' :
                                prop.status === 'Reservada' ? 'bg-amber-100 text-amber-800' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {prop.status}
                              </span>
                            </td>
                            <td className="p-4 font-bold text-[#03459C] font-poppins text-sm">
                              ${prop.price.toLocaleString()}
                            </td>
                            <td className="p-4">
                              {assignedAg ? (
                                <div className="flex items-center gap-2">
                                  <ProfileInitials name={assignedAg.name} className="w-6 h-6 text-[8px]" />
                                  <span className="text-xs font-semibold">{assignedAg.name}</span>
                                </div>
                              ) : 'Sin asignar'}
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => handleOpenPropertyModal(prop)}
                                className="p-2 text-gray-600 hover:text-[#03459C] hover:bg-[#F7FAFC] rounded-lg transition-colors"
                                title="Editar Propiedad"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeletingPropertyId(prop.id)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar Propiedad"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* VIEW 3: USUARIOS */}
          {activeTab === 'users' && canManageUsers && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DBE3EE] pb-4">
                <div>
                  <h1 className="text-2xl font-bold font-poppins text-[#1F2937]">
                    Usuarios del Sistema
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Administra las cuentas de usuario y los roles asignados para el acceso al panel.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenUserModal()}
                  className="px-4 py-2.5 bg-[#03459C] hover:bg-[#023277] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 self-start"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Crear Usuario</span>
                </button>
              </div>

              {/* Users Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {systemUsers.map((usr) => (
                  <div key={usr.id} className="bg-white rounded-2xl border border-[#DBE3EE] p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <ProfileInitials name={usr.name} className="w-12 h-12 text-xs border-2" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm font-poppins text-[#1F2937]">{usr.name}</h3>
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                            usr.roleName === 'Administrador' ? 'bg-[#03459C] text-white' :
                            'bg-gray-200 text-gray-700'
                          }`}>
                            {usr.roleName}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#03459C]">{usr.email}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#DBE3EE] text-xs space-y-1 text-gray-600">
                      <p><strong>Teléfono:</strong> {usr.phone || 'No especificado'}</p>
                      <p><strong>Cargo:</strong> {usr.title || 'Miembro del equipo'}</p>
                      <p><strong>Fecha de alta:</strong> {usr.createdAt}</p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-[#DBE3EE]">
                      <button
                        onClick={() => handleOpenUserModal(usr)}
                        className="flex-1 py-1.5 bg-[#F7FAFC] hover:bg-[#DBE3EE] text-[#1F2937] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => setDeletingUserId(usr.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* VIEW 4: ROLES */}
          {activeTab === 'roles' && canManageRoles && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="border-b border-[#DBE3EE] pb-4">
                <h1 className="text-2xl font-bold font-poppins text-[#1F2937]">
                  Roles y Permisos
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Define los privilegios de acceso para cada rol del sistema (Administrador, Editor).
                </p>
              </div>

              {/* Roles Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {systemRoles.map((role) => (
                  <div key={role.id} className="bg-white rounded-2xl border border-[#DBE3EE] p-6 shadow-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-[#DBE3EE] pb-3">
                      <div>
                        <h3 className="font-bold text-base font-poppins text-[#1F2937] flex items-center gap-2">
                          <Shield className="w-4 h-4 text-[#03459C]" />
                          <span>{role.name}</span>
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1">{role.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-[#7A8AA3] uppercase tracking-wider block">
                        Permisos Habilitados
                      </span>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 bg-[#F7FAFC] rounded-lg">
                          <span>Gestionar Propiedades</span>
                          {role.permissions.canManageProperties ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">Sí</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded">No</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-2 bg-[#F7FAFC] rounded-lg">
                          <span>Gestionar Usuarios</span>
                          {role.permissions.canManageUsers ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">Sí</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded">No</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-2 bg-[#F7FAFC] rounded-lg">
                          <span>Gestionar Roles</span>
                          {role.permissions.canManageRoles ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">Sí</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded">No</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-2 bg-[#F7FAFC] rounded-lg">
                          <span>Gestionar Agentes</span>
                          {role.permissions.canManageAgents ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">Sí</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded">No</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onShowToast(`Permisos del rol ${role.name} guardados.`, 'info')}
                      className="w-full py-2 bg-[#F7FAFC] hover:bg-[#DBE3EE] text-[#1F2937] text-xs font-bold rounded-xl transition-colors"
                    >
                      Configurar Permisos
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* VIEW 5: PERFIL */}
          {activeTab === 'profile' && (
            <div className="max-w-3xl space-y-8 animate-fadeIn">
              
              <div className="border-b border-[#DBE3EE] pb-4">
                <h1 className="text-2xl font-bold font-poppins text-[#1F2937]">
                  Perfil de Usuario
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Actualiza tu información de contacto y contraseña de acceso.
                </p>
              </div>

              {/* Profile Details Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#DBE3EE] shadow-sm space-y-6">
                
                <form onSubmit={handleUpdateProfileSubmit} className="space-y-6">
                  
                  {/* Avatar Header */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#DBE3EE]">
                    <ProfileInitials name={profileName} className="w-24 h-24 text-2xl border-4 shadow-md" />

                    <div className="space-y-2 text-center sm:text-left flex-1">
                      <h3 className="font-bold text-lg font-poppins text-[#1F2937]">{profileName}</h3>
                      <p className="text-xs text-[#03459C] font-semibold">{currentUser.roleName}</p>
                    </div>
                  </div>

                  {/* Info Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#1F2937] mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl focus:outline-none focus:border-[#03459C]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#1F2937] mb-1">Cargo / Título</label>
                      <input
                        type="text"
                        required
                        value={profileTitle}
                        onChange={(e) => setProfileTitle(e.target.value)}
                        className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl focus:outline-none focus:border-[#03459C]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#1F2937] mb-1">Correo Electrónico</label>
                      <input
                        type="email"
                        required
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl focus:outline-none focus:border-[#03459C]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#1F2937] mb-1">Teléfono</label>
                      <input
                        type="text"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl focus:outline-none focus:border-[#03459C]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="py-3 px-6 bg-[#03459C] hover:bg-[#023277] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-98"
                  >
                    Guardar Cambios del Perfil
                  </button>
                </form>

              </div>

              {/* Password Change Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#DBE3EE] shadow-sm space-y-6">
                <div className="border-b border-[#DBE3EE] pb-3 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#03459C]" />
                  <h3 className="font-bold text-base font-poppins text-[#1F2937]">
                    Cambiar Contraseña
                  </h3>
                </div>

                <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#1F2937] mb-1">Contraseña Actual</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl focus:outline-none focus:border-[#03459C]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#1F2937] mb-1">Nueva Contraseña</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl focus:outline-none focus:border-[#03459C]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#1F2937] mb-1">Confirmar Nueva Contraseña</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl focus:outline-none focus:border-[#03459C]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="py-3 px-6 bg-[#03459C] hover:bg-[#023277] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-98"
                  >
                    Actualizar Contraseña
                  </button>
                </form>
              </div>

            </div>
          )}

        </main>

      </div>

      {/* MODAL 1: NUEVA / EDITAR PROPIEDAD */}
      {isPropertyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-[#DBE3EE] overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#071B33] text-white p-4 sm:px-6 flex items-center justify-between gap-3">
              <h3 className="font-bold font-poppins text-base flex items-center gap-2">
                <Building className="w-5 h-5 text-[#7A8AA3]" />
                <span>{editingProperty ? 'Editar Detalles de la Propiedad' : 'Publicar Nueva Propiedad'}</span>
              </h3>
              <button onClick={() => setIsPropertyModalOpen(false)} className="text-gray-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePropertySubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* IMAGE UPLOADER SECTION (FIRST IN FORM AS REQUESTED) */}
              <div className="space-y-3 p-4 bg-[#F7FAFC] rounded-xl border border-[#DBE3EE]">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-[#1F2937] text-xs flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#03459C]" />
                    <span>Fotografías de la Propiedad *</span>
                  </label>
                  <span className="text-[10px] font-bold text-[#03459C] bg-[#03459C]/10 px-2 py-0.5 rounded">
                    {uploadedImages.length} Imagen(es)
                  </span>
                </div>

                {/* Clear Explicit Banner Notice */}
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-[11px] leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Nota importante:</strong> Puedes subir múltiples imágenes desde tu computador o celular. La <strong>primera imagen</strong> del listado será automáticamente la imagen principal (Hero) que se mostrará en las tarjetas de la propiedad.
                  </span>
                </div>

                {/* Upload Button */}
                <div className="relative border-2 border-dashed border-[#03459C]/40 hover:border-[#03459C] rounded-xl p-5 text-center bg-white transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <Upload className="w-8 h-8 text-[#03459C]" />
                    <p className="font-bold text-[#1F2937] text-xs">
                      Haz clic aquí o arrastra imágenes para subir desde tu equipo o celular
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Soporta JPG, PNG, WEBP (Múltiples archivos permitidos)
                    </p>
                  </div>
                </div>

                {/* Images Preview Grid */}
                {uploadedImages.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8AA3] block">
                      Galería de Imágenes Subidas:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {uploadedImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden border border-[#DBE3EE] bg-white group">
                          <img src={imgUrl} alt="" className="w-full h-24 object-cover" />
                          
                          {/* Badge if 1st image */}
                          {idx === 0 ? (
                            <span className="absolute top-1 left-1 bg-[#03459C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                              Imagen Hero
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleMakeHero(idx)}
                              className="absolute top-1 left-1 bg-black/70 hover:bg-[#03459C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-90 transition-opacity"
                              title="Hacer imagen principal"
                            >
                              Establecer Hero
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-700 text-white p-1 rounded-full shadow-xs"
                            title="Eliminar imagen"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Basic Data */}
              <div>
                <label className="block font-bold mb-1">Título de la Propiedad *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="ej. Villa Cap Cana Vista al Golfo"
                  className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Precio ($ USD) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Estado del Listado *</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl font-semibold text-[#03459C]"
                  >
                    <option value="En Venta">En Venta</option>
                    <option value="En Alquiler">En Alquiler</option>
                    <option value="Reservada">Reservada</option>
                    <option value="Vendida">Vendida</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Tipo de Propiedad *</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl"
                  >
                    <option value="Casa">Casa</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Villa">Villa</option>
                    <option value="Solar">Solar</option>
                    <option value="Local Comercial">Local Comercial</option>
                    <option value="Oficina">Oficina</option>
                    <option value="Proyecto">Proyecto</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Agente Asignado *</label>
                  <select
                    value={formAgentId}
                    onChange={(e) => setFormAgentId(e.target.value)}
                    className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl"
                  >
                    {agents.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold mb-1">Ciudad / Zona</label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Sector</label>
                  <input
                    type="text"
                    value={formNeighborhood}
                    onChange={(e) => setFormNeighborhood(e.target.value)}
                    className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Dirección</label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold mb-1">Habitaciones</label>
                  <input
                    type="number"
                    value={formBedrooms}
                    onChange={(e) => setFormBedrooms(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Baños</label>
                  <input
                    type="number"
                    value={formBathrooms}
                    onChange={(e) => setFormBathrooms(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Parqueos</label>
                  <input
                    type="number"
                    value={formParking}
                    onChange={(e) => setFormParking(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Metros Cuadrados / Sqft</label>
                  <input
                    type="number"
                    value={formSqft}
                    onChange={(e) => setFormSqft(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl"
                  />
                </div>
              </div>

              {amenityOptions.length > 0 && (
                <fieldset className="space-y-2">
                  <legend className="font-bold mb-1">Amenidades</legend>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-xl border border-[#DBE3EE] bg-[#F7FAFC] p-3">
                    {amenityOptions.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formAmenities.includes(amenity)}
                          onChange={(event) => setFormAmenities((current) =>
                            event.target.checked
                              ? [...current, amenity]
                              : current.filter((item) => item !== amenity)
                          )}
                          className="accent-[#03459C]"
                        />
                        <span>{amenity}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {/* RICH TEXT EDITOR FOR DESCRIPTION (AS REQUESTED) */}
              <RichTextEditor
                value={formDescription}
                onChange={setFormDescription}
                label="Descripción de la Propiedad (Editor Enriquecido) *"
                placeholder="Escribe la descripción de la propiedad con formato..."
              />

              <button
                type="submit"
                className="w-full py-3.5 bg-[#03459C] hover:bg-[#023277] text-white font-bold uppercase tracking-widest rounded-xl shadow-md transition-all active:scale-98"
              >
                {editingProperty ? 'Guardar Cambios de la Propiedad' : 'Publicar Propiedad en la Web'}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREAR / EDITAR USUARIO DEL SISTEMA */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#DBE3EE] p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-[#DBE3EE] pb-2">
              <h3 className="font-bold text-base text-[#1F2937]">
                {editingUser ? 'Editar Usuario' : 'Crear Usuario del Sistema'}
              </h3>
              <button onClick={() => setIsUserModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveUserSubmit} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={userFormName}
                  onChange={(e) => setUserFormName(e.target.value)}
                  className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={userFormEmail}
                  onChange={(e) => setUserFormEmail(e.target.value)}
                  className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Rol Asignado *</label>
                <select
                  value={userFormRole}
                  onChange={(e) => setUserFormRole(e.target.value)}
                  className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl font-semibold text-[#03459C]"
                >
                  {systemRoles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">
                  {editingUser ? 'Nueva contraseña (opcional)' : 'Contraseña *'}
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required={!editingUser}
                  value={userFormPassword}
                  onChange={(e) => setUserFormPassword(e.target.value)}
                  placeholder={editingUser ? 'Dejar vacío para no cambiarla' : '••••••••••'}
                  className="w-full p-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl"
                />
                <p className="mt-1 text-[10px] text-gray-500">
                  Mínimo 10 caracteres, con al menos una letra y un número.
                </p>
              </div>

              {usersError && (
                <p role="alert" className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-[11px] font-semibold">
                  {usersError}
                </p>
              )}

              <button
                type="submit"
                disabled={savingUser}
                className="w-full py-3 bg-[#03459C] disabled:opacity-60 text-white font-bold uppercase tracking-widest rounded-xl shadow-md mt-2"
              >
                {savingUser ? 'Guardando…' : 'Guardar Usuario'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM PROPIEDAD DELETE MODAL */}
      {deletingPropertyId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-sm w-full p-6 rounded-2xl border border-[#DBE3EE] space-y-4 text-center">
            <h4 className="font-bold text-base text-[#1F2937]">Confirmar Eliminación de Propiedad</h4>
            <p className="text-xs text-gray-600">
              ¿Estás seguro de que deseas eliminar permanentemente la propiedad <strong>#{deletingPropertyId}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingPropertyId(null)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteProperty(deletingPropertyId);
                  setDeletingPropertyId(null);
                  onShowToast('Propiedad eliminada del sistema.', 'info');
                }}
                className="flex-1 py-2 bg-red-600 text-white font-bold rounded-xl text-xs"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM USUARIO DELETE MODAL */}
      {deletingUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-sm w-full p-6 rounded-2xl border border-[#DBE3EE] space-y-4 text-center">
            <h4 className="font-bold text-base text-[#1F2937]">Confirmar Eliminación de Usuario</h4>
            <p className="text-xs text-gray-600">
              ¿Estás seguro de que deseas eliminar este usuario del sistema?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingUserId(null)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  const id = deletingUserId;
                  setDeletingUserId(null);
                  try {
                    await api.deleteUser(id!);
                    onShowToast('Usuario eliminado del sistema.', 'info');
                    loadUsers();
                  } catch (err: any) {
                    onShowToast(err?.message || 'No se pudo eliminar el usuario.', 'info');
                  }
                }}
                className="flex-1 py-2 bg-red-600 text-white font-bold rounded-xl text-xs"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
