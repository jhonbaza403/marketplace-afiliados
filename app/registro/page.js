'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegistroPage() {
  const router = Router();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    rif: '',
    phone: '',
    documentFile: null,
    selfieFront: null,
    selfieRight: null,
    selfieLeft: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      // AQUÍ IMPLEMENTAS LA LÓGICA DE REGISTRO / SUPABASE
      // Ejemplo: Creación de usuario y carga de documentos de KYC
      
      setSuccessMsg('¡Registro completado con éxito! Revisa tu correo o inicia sesión.');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Error al procesar el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="modal-card" style={{ maxWidth: '600px', width: '100%', animation: 'none' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>🏢 Registro Comercial & KYC</h2>
        <p className="modal-sub" style={{ textAlign: 'center' }}>
          Crea tu cuenta en CrediOfertas para publicar tus productos, servicios y verificar tu perfil.
        </p>

        {errorMsg && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: '#dcfce7', color: '#166534', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            ✅ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* DATOS DE ACCESO */}
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico *</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="tu@empresa.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="password">Contraseña *</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

          {/* DATOS COMERCIALES / KYC */}
          <div className="form-group">
            <label htmlFor="companyName">Nombre Comercial / Empresa *</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              required
              placeholder="Inversiones Global C.A."
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="rif">RIF Fiscal / ID *</label>
              <input
                type="text"
                id="rif"
                name="rif"
                required
                placeholder="J-12345678-0"
                value={formData.rif}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Teléfono / WhatsApp *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                placeholder="+58 412 000 0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* CARGA DE DOCUMENTOS E IDENTIDAD */}
          <div className="form-group">
            <label htmlFor="documentFile">Documento RIF / Cédula (Imagen) *</label>
            <input
              type="file"
              id="documentFile"
              name="documentFile"
              accept="image/*"
              required
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="selfieFront">Foto Frontal (Selfie Rostro) *</label>
            <input
              type="file"
              id="selfieFront"
              name="selfieFront"
              accept="image/*"
              required
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="selfieRight">Perfil Derecho *</label>
              <input
                type="file"
                id="selfieRight"
                name="selfieRight"
                accept="image/*"
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="selfieLeft">Perfil Izquierdo *</label>
              <input
                type="file"
                id="selfieLeft"
                name="selfieLeft"
                accept="image/*"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Procesando Registro...' : '✅ Enviar para Verificación'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </main>
  );
}
