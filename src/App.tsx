import React, { useState, useEffect, useCallback } from 'react';
import { ViewType, Property, Agent, Lead, ActivityLog, SystemUser } from './types';
import { AGENTS } from './data/staticData';
import * as api from './lib/api';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast, ToastMessage } from './components/common/Toast';
import { ContactModal } from './components/modals/ContactModal';
import { LoginModal } from './components/modals/LoginModal';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';

// Views
import { HomeView } from './components/views/HomeView';
import { AboutView } from './components/views/AboutView';
import { ServicesView } from './components/views/ServicesView';
import { ContactView } from './components/views/ContactView';
import { ListingsView } from './components/views/ListingsView';
import { PropertyDetailView } from './components/views/PropertyDetailView';
import { AdminDashboardView } from './components/views/admin/AdminDashboardView';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  /* ---------------- Sesión ---------------- */
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // La sesión se valida contra el API: un token caducado no da acceso.
  useEffect(() => {
    api.verifySession().then(setCurrentUser);
  }, []);

  /* ---------------- Datos ---------------- */
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [catalog, setCatalog] = useState<any>({ types: [], locations: [], amenities: [] });
  const [loading, setLoading] = useState(true);
  const [apiDown, setApiDown] = useState(false);

  // El perfil de la asesora es contenido estático de la marca: es una asesora individual.
  const [agents] = useState<Agent[]>(AGENTS);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  const loadPublicData = useCallback(async () => {
    setLoading(true);
    try {
      const [props, cat] = await Promise.all([api.fetchProperties(), api.fetchCatalog()]);
      setProperties(props);
      setCatalog(cat);
      setApiDown(false);
    } catch (err) {
      console.error('[api] no se pudieron cargar las propiedades:', err);
      setProperties([]);
      setApiDown(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  // Cargar propiedad desde query parameter si existe
  useEffect(() => {
    if (properties.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    const propertyId = params.get('property');

    if (propertyId && properties.find(p => p.id === propertyId)) {
      setSelectedPropertyId(propertyId);
      setActiveView('property-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [properties]);

  // Con sesión abierta se recargan incluyendo borradores, más los contactos.
  useEffect(() => {
    if (!currentUser) return;
    api.adminFetchProperties().then(setProperties).catch(() => { });
    api.adminFetchLeads().then(setLeads).catch(() => { });
  }, [currentUser]);

  /* ---------------- Favoritos ---------------- */
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('greizy_saved_properties');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('greizy_saved_properties', JSON.stringify(savedIds));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }
  }, [savedIds]);

  /* ---------------- Avisos ---------------- */
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const logActivity = (action: string, type: ActivityLog['type'] = 'property') => {
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        action,
        timestamp: 'Ahora mismo',
        user: currentUser ? currentUser.name : 'Administrador',
        type
      },
      ...prev
    ]);
  };

  /* ---------------- Contacto ---------------- */
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactProperty, setContactProperty] = useState<Property | null>(null);

  const handleOpenContactModal = (property?: Property) => {
    setContactProperty(property || null);
    setContactModalOpen(true);
  };

  const toggleSaveProperty = (id: string) => {
    setSavedIds((prev) => {
      if (prev.includes(id)) {
        showToast('Propiedad removida de guardados.', 'info');
        return prev.filter((p) => p !== id);
      }
      showToast('Propiedad guardada en favoritos.', 'success');
      return [...prev, id];
    });
  };

  const handleNavigate = (view: ViewType, propertyId?: string) => {
    if (view === 'admin-dashboard' && !currentUser) {
      setLoginModalOpen(true);
      return;
    }
    if (propertyId) setSelectedPropertyId(propertyId);
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: SystemUser) => {
    setCurrentUser(user);
    setLoginModalOpen(false);
    setActiveView('admin-dashboard');
    showToast(`¡Bienvenida de nuevo, ${user.name.split(' ')[0]}!`, 'success');
  };

  const handleLogout = () => {
    api.clearSession();
    setCurrentUser(null);
    setActiveView('home');
    loadPublicData();
    showToast('Has cerrado sesión correctamente.', 'info');
  };

  /* ---------------- CRUD contra el API ---------------- */

  const handleAddProperty = async (newProp: Property): Promise<Property | null> => {
    try {
      const created = await api.createProperty(newProp, catalog);
      setProperties((prev) => [created, ...prev]);
      logActivity(`Publicada nueva propiedad: "${created.title}"`);
      showToast('Propiedad creada correctamente.', 'success');
      return created;
    } catch (err) {
      showToast(`No se pudo crear: ${(err as Error).message}`, 'info');
      return null;
    }
  };

  const handleUpdateProperty = async (updatedProp: Property): Promise<Property | null> => {
    try {
      const saved = await api.updateProperty(updatedProp.id, updatedProp, catalog);
      setProperties((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      logActivity(`Actualizada propiedad: "${saved.title}"`);
      showToast('Cambios guardados.', 'success');
      return saved;
    } catch (err) {
      showToast(`No se pudo guardar: ${(err as Error).message}`, 'info');
      return null;
    }
  };

  const handleDeleteProperty = async (id: string) => {
    const previous = properties;
    setProperties((prev) => prev.filter((p) => p.id !== id));
    try {
      await api.deleteProperty(id);
      logActivity(`Eliminada propiedad #${id}`);
      showToast('Propiedad eliminada.', 'info');
    } catch (err) {
      setProperties(previous);
      showToast(`No se pudo eliminar: ${(err as Error).message}`, 'info');
    }
  };

  /**
   * Sube todas las fotos de una vez.
   * El orden de envío se conserva: la primera queda como portada.
   */
  const handleUploadImages = async (propertyId: string, files: File[]) => {
    const updated = await api.uploadImages(propertyId, files);
    setProperties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`${files.length} imagen(es) subidas.`, 'success');
    return updated;
  };

  const handleCreateLeadFromContact = async (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    await api.submitLead({
      name: leadData.name,
      email: leadData.email || undefined,
      phone: leadData.phone || undefined,
      message: leadData.message,
      propertySlug: contactProperty?.slug || null,
      source: contactProperty ? 'ficha-propiedad' : 'web'
    });
  };

  const selectedProperty =
    properties.find((p) => p.id === selectedPropertyId) || properties[0] || null;
  const selectedAgent = agents[0];

  /* ---------------- Panel ---------------- */
  if (activeView === 'admin-dashboard' && currentUser) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] text-[#1F2937] font-montserrat antialiased selection:bg-[#03459C] selection:text-white">
        <AdminDashboardView
          properties={properties}
          catalogAmenities={catalog.amenities}
          agents={agents}
          activities={activities}
          currentUser={currentUser}
          onUpdateCurrentUser={setCurrentUser}
          onNavigatePublic={handleNavigate}
          onLogout={handleLogout}
          onAddProperty={handleAddProperty}
          onUpdateProperty={handleUpdateProperty}
          onDeleteProperty={handleDeleteProperty}
          onUploadImages={handleUploadImages}
          onShowToast={showToast}
        />
        <Toast toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFC] text-[#1F2937] font-montserrat antialiased selection:bg-[#03459C] selection:text-white">

      <Navbar
        activeView={activeView}
        onNavigate={handleNavigate}
        savedCount={savedIds.length}
        onOpenContactModal={() => handleOpenContactModal()}
      />

      {apiDown && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center text-xs font-semibold text-amber-900">
          No hay conexión con el servidor de propiedades. Revisa que el API esté encendido.
        </div>
      )}

      <main className="flex-1">
        {activeView === 'home' && (
          <HomeView
            properties={properties}
            onNavigate={handleNavigate}
            savedIds={savedIds}
            onToggleSave={toggleSaveProperty}
            onOpenContactModal={handleOpenContactModal}
          />
        )}

        {activeView === 'about' && <AboutView onNavigate={handleNavigate} />}

        {activeView === 'services' && (
          <ServicesView onNavigate={handleNavigate} onShowToast={showToast} />
        )}

        {activeView === 'contact' && <ContactView onShowToast={showToast} />}

        {activeView === 'listings' && (
          <ListingsView
            properties={properties}
            onNavigate={handleNavigate}
            savedIds={savedIds}
            onToggleSave={toggleSaveProperty}
            onOpenContactModal={handleOpenContactModal}
          />
        )}

        {activeView === 'property-detail' && selectedProperty && (
          <PropertyDetailView
            property={selectedProperty}
            agent={selectedAgent}
            onNavigate={handleNavigate}
            isSaved={savedIds.includes(selectedProperty.id)}
            onToggleSave={toggleSaveProperty}
            onOpenScheduleTour={() => handleOpenContactModal(selectedProperty)}
            onShowToast={showToast}
          />
        )}

        {activeView === 'property-detail' && !selectedProperty && !loading && (
          <div className="max-w-3xl mx-auto px-4 py-24 text-center">
            <h1 className="font-poppins text-2xl text-[#1F2937]">Propiedad no disponible</h1>
            <p className="mt-3 text-sm text-gray-600">
              Es posible que se haya retirado del catálogo.
            </p>
            <button
              onClick={() => handleNavigate('listings')}
              className="mt-6 px-6 py-3 bg-[#03459C] text-white text-xs font-bold uppercase tracking-wider rounded-lg"
            >
              Ver todas las propiedades
            </button>
          </div>
        )}
      </main>

      <Footer onNavigate={handleNavigate} onShowToast={showToast} />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        property={contactProperty}
        onSubmitLead={handleCreateLeadFromContact}
        onSuccess={(msg) => showToast(msg, 'success')}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />

      {!contactModalOpen && !loginModalOpen && (
        <FloatingWhatsApp onOpenContactModal={() => handleOpenContactModal()} />
      )}
    </div>
  );
}
