"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CalendarClock,
  Crown,
  KeyRound,
  LogOut,
  PencilLine,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import {
  IProfilGuncellemeVerisi,
  ISifreDegistirmeVerisi,
  profilGuncellemeSemasi,
  sifreDegistirmeSemasi,
} from "../schema/AuthSchema";
import { NoticeToast } from "./NoticeToast";

const cardShadow =
  "0 22px 54px -34px color-mix(in oklab, var(--foreground) 26%, transparent), inset 1px 1px 0 color-mix(in oklab, white 70%, transparent), inset -1px -1px 0 color-mix(in oklab, var(--foreground) 10%, transparent)";

const interactiveClass =
  "transition duration-300 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.01]";

const ProfileField = ({
  label,
  error,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) => (
  <label className="block space-y-2.5">
    <span className="block text-[12px] font-medium tracking-[0.02em] text-foreground/74">
      {label}
    </span>
    <input
      {...props}
      className={`h-12 w-full rounded-2xl border border-border/80 bg-background/80 px-4 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ${interactiveClass}`}
      style={{
        boxShadow:
          "inset 3px 3px 8px color-mix(in oklab, var(--foreground) 10%, transparent), inset -3px -3px 8px color-mix(in oklab, white 78%, transparent)",
      }}
    />
    {hint ? <p className="text-xs leading-6 text-foreground/62">{hint}</p> : null}
    {error ? <p className="text-xs font-semibold text-rose-600">{error}</p> : null}
  </label>
);

type Notice = {
  tone: "success" | "error" | "info";
  message: string;
} | null;

export const ProfilePageClient = () => {
  const { user, setUser, logout, isLoggingOut } = useAuth();
  const [notice, setNotice] = useState<Notice>(null);

  const form = useForm<IProfilGuncellemeVerisi>({
    resolver: zodResolver(profilGuncellemeSemasi),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      company: user?.company ?? "",
      jobTitle: user?.jobTitle ?? "",
    },
  });

  const passwordForm = useForm<ISifreDegistirmeVerisi>({
    resolver: zodResolver(sifreDegistirmeSemasi),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    form.reset({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      company: user?.company ?? "",
      jobTitle: user?.jobTitle ?? "",
    });
  }, [form, user]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  if (!user) {
    return null;
  }

  const uyeTarihi = new Date(user.createdAt).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setNotice(null);

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setNotice({ tone: "error", message: data.mesaj ?? "Profil güncellenemedi." });
        return;
      }

      setUser(data.veri);
      setNotice({ tone: "success", message: "Profil bilgileri güncellendi." });
    } catch {
      setNotice({ tone: "error", message: "Sunucu ile iletişim kurulamadı." });
    }
  });

  const handlePasswordSubmit = passwordForm.handleSubmit(async (values) => {
    setNotice(null);

    try {
      const response = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setNotice({ tone: "error", message: data.mesaj ?? "Şifre güncellenemedi." });
        return;
      }

      passwordForm.reset();
      setNotice({ tone: "success", message: "Şifre başarıyla güncellendi." });
    } catch {
      setNotice({ tone: "error", message: "Sunucu ile iletişim kurulamadı." });
    }
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-2 lg:p-4">
      {notice ? (
        <NoticeToast
          message={notice.message}
          tone={notice.tone}
          onClose={() => setNotice(null)}
        />
      ) : null}

      <section
        className={`relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/80 p-6 backdrop-blur-2xl lg:p-8 ${interactiveClass}`}
        style={{ boxShadow: cardShadow }}
      >
        <div className="absolute -right-16 top-0 h-52 w-52 rounded-full bg-primary/16 blur-3xl" />
        <div className="absolute left-1/3 top-10 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm font-semibold text-foreground/78">
              <Sparkles className="h-4 w-4 text-primary" />
              Profil Merkezi
            </div>
            <div className="flex items-start gap-4">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-[1.8rem] bg-background/80 text-2xl font-black text-primary ${interactiveClass}`}
                style={{ boxShadow: cardShadow }}
              >
                {user.initials}
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-foreground lg:text-4xl">{user.fullName}</h1>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-primary/12 px-3 py-1 font-semibold text-primary">@{user.username}</span>
                  <span className="rounded-full bg-background/80 px-3 py-1 font-semibold text-foreground/70">
                    {user.jobTitle}
                  </span>
                  <span className="rounded-full bg-background/80 px-3 py-1 font-semibold text-foreground/70">
                    {user.company}
                  </span>
                </div>
              </div>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-foreground/68 lg:text-base">
              Hesap bilgilerini burada güncelleyebilir, rolünü ve üyelik detaylarını görebilir, şifreni değiştirebilir ve tema ayarlarına hızlıca geçebilirsin.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { icon: BadgeCheck, label: "Rol", value: user.role },
              { icon: CalendarClock, label: "Üyelik", value: uyeTarihi },
              { icon: Building2, label: "Şirket", value: user.company },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-[1.6rem] border border-border/60 bg-background/72 p-5 ${interactiveClass}`}
                style={{ boxShadow: cardShadow }}
              >
                <item.icon className="mb-4 h-5 w-5 text-primary" />
                <p className="text-xs font-black uppercase tracking-[0.24em] text-foreground/60">{item.label}</p>
                <h2 className="mt-3 text-lg font-black text-foreground">{item.value}</h2>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className={`h-full rounded-[2rem] border border-border/60 bg-card/82 p-6 backdrop-blur-2xl ${interactiveClass}`} style={{ boxShadow: cardShadow }}>
          <div className="mb-5 flex items-center gap-3">
            <PencilLine className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-xl font-black text-foreground">Profil Bilgileri</h2>
              <p className="mt-1 text-sm text-foreground/62">Temel kullanıcı bilgilerini buradan güncelle.</p>
            </div>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <ProfileField label="Ad" error={form.formState.errors.firstName?.message} placeholder="Ad" {...form.register("firstName")} />
            <ProfileField label="Soyad" error={form.formState.errors.lastName?.message} placeholder="Soyad" {...form.register("lastName")} />
            <ProfileField label="Kullanıcı Adı" error={form.formState.errors.username?.message} placeholder="Kullanıcı adı" {...form.register("username")} />
            <ProfileField label="E-posta" type="email" error={form.formState.errors.email?.message} placeholder="E-posta" {...form.register("email")} />
            <ProfileField label="Telefon" hint="Opsiyonel" error={form.formState.errors.phone?.message} placeholder="Telefon" {...form.register("phone")} />
            <ProfileField label="Şirket" error={form.formState.errors.company?.message} placeholder="Şirket" {...form.register("company")} />
            <div className="md:col-span-2">
              <ProfileField label="Ünvan" error={form.formState.errors.jobTitle?.message} placeholder="Ünvan" {...form.register("jobTitle")} />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3 pt-1">
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className={`inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-70 ${interactiveClass}`}
                style={{ boxShadow: "0 18px 32px -20px color-mix(in oklab, var(--primary) 70%, transparent)" }}
              >
                {form.formState.isSubmitting ? "Kaydediliyor..." : "Profili Kaydet"}
              </button>
              <button
                type="button"
                onClick={() => form.reset()}
                className={`inline-flex h-12 items-center justify-center rounded-2xl border border-border/70 bg-background/75 px-5 text-sm font-semibold text-foreground ${interactiveClass}`}
              >
                Formu Sıfırla
              </button>
            </div>
          </form>
        </section>

        <section className={`h-full rounded-[2rem] border border-border/60 bg-card/82 p-6 backdrop-blur-2xl ${interactiveClass}`} style={{ boxShadow: cardShadow }}>
          <div className="mb-7 flex items-center gap-3">
            <KeyRound className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-xl font-black text-foreground">Şifre Değiştir</h2>
              <p className="mt-1 text-sm text-foreground/62">Mevcut şifreni doğrula ve yeni şifre belirle.</p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handlePasswordSubmit}>
            <ProfileField
              label="Mevcut Şifre"
              type="password"
              placeholder="Mevcut şifre"
              error={passwordForm.formState.errors.currentPassword?.message}
              {...passwordForm.register("currentPassword")}
            />
            <ProfileField
              label="Yeni Şifre"
              type="password"
              placeholder="Yeni şifre"
              error={passwordForm.formState.errors.newPassword?.message}
              {...passwordForm.register("newPassword")}
            />
            <ProfileField
              label="Yeni Şifre Tekrar"
              type="password"
              placeholder="Yeni şifre tekrar"
              error={passwordForm.formState.errors.confirmPassword?.message}
              {...passwordForm.register("confirmPassword")}
            />

            <button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
              className={`inline-flex h-12 w-full items-center justify-center rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-70 ${interactiveClass}`}
              style={{ boxShadow: "0 18px 32px -20px color-mix(in oklab, var(--primary) 70%, transparent)" }}
            >
              {passwordForm.formState.isSubmitting ? "Şifre güncelleniyor..." : "Şifreyi Güncelle"}
            </button>
          </form>
        </section>

        <section className={`h-full rounded-[2rem] border border-border/60 bg-card/82 p-6 backdrop-blur-2xl ${interactiveClass}`} style={{ boxShadow: cardShadow }}>
          <div className="mb-7 flex items-center gap-3">
            {user.role === "ADMIN" ? <Crown className="h-5 w-5 text-primary" /> : <UserRound className="h-5 w-5 text-primary" />}
            <div>
              <h2 className="text-xl font-black text-foreground">Hesap Durumu</h2>
              <p className="mt-1 text-sm text-foreground/62">Rol, erişim ve hızlı işlemler.</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-background/75 px-4 py-3">
              <span className="text-foreground/62">Rol</span>
              <span className="font-bold text-foreground">{user.role}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-background/75 px-4 py-3">
              <span className="text-foreground/62">Kullanıcı adı</span>
              <span className="font-bold text-foreground">@{user.username}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-background/75 px-4 py-3">
              <span className="text-foreground/62">Güncellendi</span>
              <span className="font-bold text-foreground">{new Date(user.updatedAt).toLocaleDateString("tr-TR")}</span>
            </div>
          </div>
        </section>

        <section className={`h-full rounded-[2rem] border border-border/60 bg-card/82 p-6 backdrop-blur-2xl ${interactiveClass}`} style={{ boxShadow: cardShadow }}>
          <div className="mb-7 flex items-center gap-3">
            <Settings className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-xl font-black text-foreground">Hızlı Kısayollar</h2>
              <p className="mt-1 text-sm text-foreground/62">Profil dışındaki temel kullanıcı aksiyonları.</p>
            </div>
          </div>

          <div className="grid gap-3">
            <Link
              href="/settings"
              className={`flex items-center justify-between rounded-2xl border border-border/60 bg-background/75 px-4 py-4 text-sm font-semibold text-foreground ${interactiveClass}`}
            >
              Tema ve uygulama ayarları
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </Link>
            <button
              type="button"
              onClick={logout}
              disabled={isLoggingOut}
              className={`flex items-center justify-between rounded-2xl border border-rose-300/70 bg-rose-50 px-4 py-4 text-left text-sm font-semibold text-rose-700 transition-colors hover:border-rose-600 hover:bg-rose-600 hover:text-white disabled:opacity-70 ${interactiveClass}`}
            >
              {isLoggingOut ? "Çıkış yapılıyor..." : "Oturumu kapat"}
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
