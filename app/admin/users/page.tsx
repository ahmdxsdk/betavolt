'use client';

import { useState, useEffect, useTransition } from 'react';
import { Users, Plus, RefreshCw, KeyRound, Trash2, Copy, Check, X, Shield, ChevronDown } from 'lucide-react';
import { useAdminLang } from '@/components/admin/AdminLangProvider';
import {
  fetchAdmins, createAdmin, resetAdminPassword, deleteAdmin, updateAdminRole,
  type AdminUser, type Role,
} from '@/app/actions/admin-auth';
import { ROLES, ROLE_LABEL } from '@/lib/admin-roles';

/* ─── Role badge config ────────────────────────────────── */
const ROLE_BADGE: Record<Role, string> = {
  super_admin:     'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50',
  content_manager: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50',
  sales:           'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
};

/* ─── Bilingual labels ─────────────────────────────────── */
const L = {
  en: {
    title: 'Admin Accounts',
    subtitle: 'Manage administrator accounts and their access roles.',
    btn_add: 'Add Admin',
    btn_refresh: 'Refresh',
    col_email: 'Email',
    col_role: 'Role',
    col_created: 'Created',
    col_last_login: 'Last Sign In',
    col_actions: 'Actions',
    never: 'Never',
    no_role: 'No Role',
    btn_reset: 'Reset Password',
    btn_delete: 'Delete',
    modal_add_title: 'Add New Admin',
    modal_add_email_label: 'Email Address',
    modal_add_email_placeholder: 'admin@example.com',
    modal_add_role_label: 'Access Role',
    modal_add_role_placeholder: 'Select a role…',
    modal_add_submit: 'Create Account',
    modal_add_submitting: 'Creating…',
    modal_reset_title: 'Reset Password',
    modal_reset_body: (email: string) => `Reset password for ${email}?`,
    modal_reset_submit: 'Reset Password',
    modal_reset_submitting: 'Resetting…',
    modal_delete_title: 'Delete Admin',
    modal_delete_body: (email: string) => `Permanently delete account for ${email}? This cannot be undone.`,
    modal_delete_submit: 'Delete Account',
    modal_delete_submitting: 'Deleting…',
    success_created: 'Account created. Save the generated password — it will not be shown again.',
    success_reset: 'Password reset. Save the new password — it will not be shown again.',
    lbl_generated_pw: 'Generated Password',
    btn_copy: 'Copy',
    btn_copied: 'Copied!',
    btn_cancel: 'Cancel',
    btn_close: 'Close',
    err_email_required: 'Email is required.',
    err_email_invalid: 'Enter a valid email address.',
    err_role_required: 'Please select a role.',
    empty_title: 'No admin accounts found.',
    empty_desc: 'Create the first admin account using the button above.',
    role_super_admin: 'Super Admin',
    role_content_manager: 'Content Manager',
    role_sales: 'Sales',
  },
  ar: {
    title: 'حسابات المدير',
    subtitle: 'إدارة حسابات المديرين وصلاحياتهم.',
    btn_add: 'إضافة مدير',
    btn_refresh: 'تحديث',
    col_email: 'البريد الإلكتروني',
    col_role: 'الصلاحية',
    col_created: 'تاريخ الإنشاء',
    col_last_login: 'آخر تسجيل دخول',
    col_actions: 'الإجراءات',
    never: 'لم يسجّل بعد',
    no_role: 'بدون صلاحية',
    btn_reset: 'إعادة تعيين كلمة المرور',
    btn_delete: 'حذف',
    modal_add_title: 'إضافة مدير جديد',
    modal_add_email_label: 'البريد الإلكتروني',
    modal_add_email_placeholder: 'admin@example.com',
    modal_add_role_label: 'الصلاحية',
    modal_add_role_placeholder: 'اختر الصلاحية…',
    modal_add_submit: 'إنشاء الحساب',
    modal_add_submitting: 'جارٍ الإنشاء…',
    modal_reset_title: 'إعادة تعيين كلمة المرور',
    modal_reset_body: (email: string) => `إعادة تعيين كلمة مرور الحساب: ${email}؟`,
    modal_reset_submit: 'إعادة التعيين',
    modal_reset_submitting: 'جارٍ الإعادة…',
    modal_delete_title: 'حذف المدير',
    modal_delete_body: (email: string) => `حذف حساب ${email} نهائيًا؟ لا يمكن التراجع عن هذا الإجراء.`,
    modal_delete_submit: 'حذف الحساب',
    modal_delete_submitting: 'جارٍ الحذف…',
    success_created: 'تم إنشاء الحساب. احفظ كلمة المرور المولّدة — لن تُعرض مرة أخرى.',
    success_reset: 'تم إعادة تعيين كلمة المرور. احفظها — لن تُعرض مرة أخرى.',
    lbl_generated_pw: 'كلمة المرور المولّدة',
    btn_copy: 'نسخ',
    btn_copied: 'تم النسخ!',
    btn_cancel: 'إلغاء',
    btn_close: 'إغلاق',
    err_email_required: 'البريد الإلكتروني مطلوب.',
    err_email_invalid: 'أدخل بريدًا إلكترونيًا صحيحًا.',
    err_role_required: 'يرجى اختيار الصلاحية.',
    empty_title: 'لا توجد حسابات مدير.',
    empty_desc: 'أنشئ أول حساب مدير باستخدام الزر أعلاه.',
    role_super_admin: 'مدير عام',
    role_content_manager: 'مدير المحتوى',
    role_sales: 'المبيعات',
  },
};

/* ─── Helpers ──────────────────────────────────────────── */
function fmtDate(iso: string | null | undefined, never: string) {
  if (!iso) return never;
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function RoleBadge({ role, lang }: { role: Role | null; lang: 'en' | 'ar' }) {
  if (!role) return <span className="text-xs text-slate-400 dark:text-slate-600">—</span>;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${ROLE_BADGE[role]}`}>
      {ROLE_LABEL[role][lang]}
    </span>
  );
}

function CopyButton({ text, label, copied: copiedLabel }: { text: string; label: string; copied: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallback());
    } else { fallback(); }
    function fallback() {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(el);
      el.focus(); el.select();
      try { document.execCommand('copy'); done(); } finally { document.body.removeChild(el); }
    }
  }
  return (
    <button type="button" onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors">
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? copiedLabel : label}
    </button>
  );
}

function PasswordBox({ password, lbl, copyLabel, copiedLabel }: {
  password: string; lbl: string; copyLabel: string; copiedLabel: string;
}) {
  return (
    <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
      <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">{lbl}</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-sm font-mono bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white break-all">
          {password}
        </code>
        <CopyButton text={password} label={copyLabel} copied={copiedLabel} />
      </div>
    </div>
  );
}

const SELECT_CLS = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer';
const INPUT_CLS  = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const LABEL_CLS  = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────── */
export default function AdminUsersPage() {
  const { lang } = useAdminLang();
  const t = L[lang];

  const [users,   setUsers]   = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [isPending, startTransition] = useTransition();

  /* add modal */
  const [addOpen,     setAddOpen]     = useState(false);
  const [addEmail,    setAddEmail]    = useState('');
  const [addRole,     setAddRole]     = useState<Role | ''>('');
  const [addEmailErr, setAddEmailErr] = useState('');
  const [addRoleErr,  setAddRoleErr]  = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addSuccess,  setAddSuccess]  = useState(false);

  /* reset modal */
  const [resetUser,    setResetUser]    = useState<AdminUser | null>(null);
  const [resetPassword, setResetPw]    = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  /* delete modal */
  const [deleteUser,    setDeleteUser]    = useState<AdminUser | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const [actionError, setActionError] = useState('');

  /* ── Load ── */
  async function load() {
    setLoading(true); setError('');
    try { setUsers(await fetchAdmins()); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed to load'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  /* ── Add ── */
  function openAdd() {
    setAddEmail(''); setAddRole(''); setAddEmailErr(''); setAddRoleErr('');
    setAddPassword(''); setAddSuccess(false); setActionError(''); setAddOpen(true);
  }
  function closeAdd() { setAddOpen(false); }

  function handleAddSubmit() {
    const email = addEmail.trim();
    let valid = true;
    if (!email)                                         { setAddEmailErr(t.err_email_required); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ setAddEmailErr(t.err_email_invalid);  valid = false; }
    else                                                 { setAddEmailErr(''); }
    if (!addRole)                                        { setAddRoleErr(t.err_role_required);   valid = false; }
    else                                                 { setAddRoleErr(''); }
    if (!valid) return;

    startTransition(async () => {
      try {
        const { password } = await createAdmin(email, addRole as Role);
        setAddPassword(password); setAddSuccess(true);
        await load();
      } catch (e: unknown) { setActionError(e instanceof Error ? e.message : 'Error'); }
    });
  }

  /* ── Reset ── */
  function openReset(user: AdminUser) { setResetUser(user); setResetPw(''); setResetSuccess(false); setActionError(''); }
  function closeReset() { setResetUser(null); }
  function handleResetSubmit() {
    if (!resetUser) return;
    startTransition(async () => {
      try { const { password } = await resetAdminPassword(resetUser.id); setResetPw(password); setResetSuccess(true); }
      catch (e: unknown) { setActionError(e instanceof Error ? e.message : 'Error'); }
    });
  }

  /* ── Delete ── */
  function openDelete(user: AdminUser) { setDeleteUser(user); setDeleteSuccess(false); setActionError(''); }
  function closeDelete() { setDeleteUser(null); }
  function handleDeleteSubmit() {
    if (!deleteUser) return;
    startTransition(async () => {
      try { await deleteAdmin(deleteUser.id); setDeleteSuccess(true); await load(); }
      catch (e: unknown) { setActionError(e instanceof Error ? e.message : 'Error'); }
    });
  }

  /* ── Role change (inline) ── */
  async function handleRoleChange(user: AdminUser, newRole: Role) {
    try { await updateAdminRole(user.id, newRole); await load(); }
    catch { /* silent — user can refresh */ }
  }

  /* ─── Render ─────────────────────────────────────────── */
  return (
    <>
      <div className="p-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={load} disabled={loading}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              {t.btn_refresh}
            </button>
            <button onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors">
              <Plus size={15} />
              {t.btn_add}
            </button>
          </div>
        </div>

        {/* Role legend */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {ROLES.map(r => (
            <span key={r} className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${ROLE_BADGE[r]}`}>
              {ROLE_LABEL[r][lang]}
            </span>
          ))}
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 dark:text-slate-600 text-sm">
              <RefreshCw size={18} className="animate-spin me-2" /> Loading…
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6">
              <Users size={40} className="text-slate-300 dark:text-slate-700" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">{t.empty_title}</p>
              <p className="text-sm text-slate-400 dark:text-slate-600 max-w-xs">{t.empty_desc}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-start px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.col_email}</th>
                    <th className="text-start px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.col_role}</th>
                    <th className="text-start px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden md:table-cell">{t.col_created}</th>
                    <th className="text-start px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden lg:table-cell">{t.col_last_login}</th>
                    <th className="text-end px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.col_actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      {/* Email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                              {user.email.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">{user.email}</span>
                        </div>
                      </td>
                      {/* Role — inline select */}
                      <td className="px-5 py-4">
                        <div className="relative inline-block">
                          <select
                            value={user.role ?? ''}
                            onChange={e => handleRoleChange(user, e.target.value as Role)}
                            className={`pe-7 ps-2 py-1 rounded-lg text-[11px] font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${user.role ? ROLE_BADGE[user.role] : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}`}
                          >
                            {!user.role && <option value="">{t.no_role}</option>}
                            {ROLES.map(r => (
                              <option key={r} value={r} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-normal text-sm">
                                {ROLE_LABEL[r][lang]}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={10} className="pointer-events-none absolute end-1.5 top-1/2 -translate-y-1/2 opacity-60" />
                        </div>
                      </td>
                      {/* Created */}
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap hidden md:table-cell">
                        {fmtDate(user.created_at, t.never)}
                      </td>
                      {/* Last login */}
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap hidden lg:table-cell">
                        {fmtDate(user.last_sign_in_at, t.never)}
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openReset(user)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <KeyRound size={12} />
                            {t.btn_reset}
                          </button>
                          <button onClick={() => openDelete(user)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                            <Trash2 size={12} />
                            {t.btn_delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Modal ── */}
      {addOpen && (
        <Modal title={t.modal_add_title} onClose={closeAdd}>
          {!addSuccess ? (
            <>
              {/* Email */}
              <div className="mb-4">
                <label className={LABEL_CLS}>{t.modal_add_email_label}</label>
                <input type="email" value={addEmail}
                  onChange={e => { setAddEmail(e.target.value); setAddEmailErr(''); }}
                  placeholder={t.modal_add_email_placeholder}
                  className={INPUT_CLS} />
                {addEmailErr && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{addEmailErr}</p>}
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className={LABEL_CLS}>{t.modal_add_role_label}</label>
                <div className="relative">
                  <select value={addRole}
                    onChange={e => { setAddRole(e.target.value as Role); setAddRoleErr(''); }}
                    className={SELECT_CLS}>
                    <option value="">{t.modal_add_role_placeholder}</option>
                    {ROLES.map(r => (
                      <option key={r} value={r}>{ROLE_LABEL[r][lang]}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                {addRoleErr && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{addRoleErr}</p>}
              </div>

              {actionError && <p className="mb-3 text-xs text-red-600 dark:text-red-400">{actionError}</p>}

              {/* Role descriptions */}
              {addRole && (
                <div className={`mb-4 px-3 py-2.5 rounded-xl text-xs border ${ROLE_BADGE[addRole as Role]}`}>
                  {addRole === 'super_admin'     && (lang === 'ar' ? 'وصول كامل لجميع صفحات لوحة التحكم.' : 'Full access to all admin pages.')}
                  {addRole === 'content_manager' && (lang === 'ar' ? 'وصول للوحة الرئيسية وإدارة المحتوى فقط.' : 'Access to dashboard and content management only.')}
                  {addRole === 'sales'           && (lang === 'ar' ? 'وصول للوحة الرئيسية والاستفسارات فقط.' : 'Access to dashboard and inquiries only.')}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-5">
                <button onClick={closeAdd} className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  {t.btn_cancel}
                </button>
                <button onClick={handleAddSubmit} disabled={isPending}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-60">
                  {isPending ? t.modal_add_submitting : t.modal_add_submit}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t.success_created}</p>
              <PasswordBox password={addPassword} lbl={t.lbl_generated_pw} copyLabel={t.btn_copy} copiedLabel={t.btn_copied} />
              <div className="flex justify-end mt-5">
                <button onClick={closeAdd} className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                  {t.btn_close}
                </button>
              </div>
            </>
          )}
        </Modal>
      )}

      {/* ── Reset Modal ── */}
      {resetUser && (
        <Modal title={t.modal_reset_title} onClose={closeReset}>
          {!resetSuccess ? (
            <>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t.modal_reset_body(resetUser.email)}</p>
              {actionError && <p className="mt-3 text-xs text-red-600 dark:text-red-400">{actionError}</p>}
              <div className="flex justify-end gap-2 mt-5">
                <button onClick={closeReset} className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  {t.btn_cancel}
                </button>
                <button onClick={handleResetSubmit} disabled={isPending}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-60">
                  {isPending ? t.modal_reset_submitting : t.modal_reset_submit}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t.success_reset}</p>
              <PasswordBox password={resetPassword} lbl={t.lbl_generated_pw} copyLabel={t.btn_copy} copiedLabel={t.btn_copied} />
              <div className="flex justify-end mt-5">
                <button onClick={closeReset} className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                  {t.btn_close}
                </button>
              </div>
            </>
          )}
        </Modal>
      )}

      {/* ── Delete Modal ── */}
      {deleteUser && (
        <Modal title={t.modal_delete_title} onClose={closeDelete}>
          {!deleteSuccess ? (
            <>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t.modal_delete_body(deleteUser.email)}</p>
              {actionError && <p className="mt-3 text-xs text-red-600 dark:text-red-400">{actionError}</p>}
              <div className="flex justify-end gap-2 mt-5">
                <button onClick={closeDelete} className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  {t.btn_cancel}
                </button>
                <button onClick={handleDeleteSubmit} disabled={isPending}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-60">
                  {isPending ? t.modal_delete_submitting : t.modal_delete_submit}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {lang === 'ar' ? 'تم حذف الحساب بنجاح.' : 'Account deleted successfully.'}
              </p>
              <div className="flex justify-end mt-5">
                <button onClick={closeDelete} className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                  {t.btn_close}
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
