"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  Crown,
  MoonStar,
  Sparkles,
  SunMedium,
} from "lucide-react";
import { useTheme } from "@/core/providers/ThemeProvider";
import {
  girisSemasi,
  IGirisVerisi,
  IKayitOlVerisi,
  kayitOlSemasi,
} from "../schema/AuthSchema";
import { NoticeToast } from "./NoticeToast";

type AuthMode = "login" | "signup";

const neumorphShadow =
  "0 24px 60px -32px color-mix(in oklab, var(--foreground) 24%, transparent), inset 1px 1px 0 color-mix(in oklab, white 68%, transparent), inset -1px -1px 0 color-mix(in oklab, var(--foreground) 8%, transparent)";

const softTileShadow =
  "14px 14px 30px -24px color-mix(in oklab, var(--foreground) 20%, transparent), -10px -10px 24px -18px color-mix(in oklab, white 72%, transparent)";

const interactiveClass =
  "transition duration-300 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.01]";

const InputField = ({
  label,
  error,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
}) => (
  <label className="block space-y-2.5">
    <span className="block text-[12px] font-medium tracking-[0.02em] text-foreground/74">
      {label}
    </span>
    <input
      {...props}
      className={`h-12 w-full rounded-2xl border border-border/80 bg-background/80 px-4 text-sm text-foreground outline-none backdrop-blur-xl focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ${interactiveClass}`}
      style={{
        boxShadow:
          "inset 3px 3px 8px color-mix(in oklab, var(--foreground) 10%, transparent), inset -3px -3px 8px color-mix(in oklab, white 78%, transparent)",
      }}
    />
    {hint ? <p className="text-xs leading-6 text-muted-foreground">{hint}</p> : null}
    {error ? <p className="text-xs font-semibold text-rose-600">{error}</p> : null}
  </label>
);

export const AuthPageClient = ({ mode }: { mode: AuthMode }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginForm = useForm<IGirisVerisi>({
    resolver: zodResolver(girisSemasi),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const signupForm = useForm<IKayitOlVerisi>({
    resolver: zodResolver(kayitOlSemasi),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      password: "",
    },
  });

  const isLogin = mode === "login";

  useEffect(() => {
    if (!formError) return;
    const timeout = window.setTimeout(() => setFormError(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [formError]);

  const handleSubmit = async (payload: IGirisVerisi | IKayitOlVerisi) => {
    setFormError(null);
    setIsSubmitting(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.mesaj ?? "İşlem tamamlanamadı.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setFormError("Sunucu ile iletişim kurulamadı.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {formError ? (
        <NoticeToast message={formError} tone="error" onClose={() => setFormError(null)} />
      ) : null}

      <div className="absolute inset-0 opacity-90">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/18 blur-3xl [animation:float_8s_ease-in-out_infinite]" />
        <div className="absolute right-[-6rem] top-24 h-80 w-80 rounded-full bg-amber-300/25 blur-3xl [animation:float_9s_ease-in-out_infinite_reverse]" />
        <div className="absolute bottom-[-5rem] left-1/3 h-72 w-72 rounded-full bg-sky-300/18 blur-3xl [animation:float_11s_ease-in-out_infinite]" />
      </div>

      <button
        type="button"
        onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
        className={`absolute right-5 top-5 z-20 flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-card/85 text-muted-foreground backdrop-blur-xl ${interactiveClass}`}
        style={{ boxShadow: neumorphShadow }}
        aria-label="Temayı değiştir"
      >
        {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
      </button>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div
          className={`w-full rounded-[2.2rem] border border-border/70 bg-card/82 p-6 backdrop-blur-2xl lg:p-8 ${
            isLogin ? "max-w-xl" : "max-w-3xl"
          }`}
          style={{ boxShadow: neumorphShadow }}
        >
          <div className="space-y-4 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm font-semibold text-foreground/78">
              <Sparkles className="h-4 w-4 text-primary" />
              {isLogin ? "Mumex.iL" : "Mumex.iL ailesine katıl!"}
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground lg:text-4xl">
              {isLogin ? "Hesabınla giriş yap." : "Yeni kullanıcı hesabını oluştur."}
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-foreground/68 lg:text-base">
              {isLogin
                ? "Hesabını şimdi oluştur ve tüm saha çalışmalarının takibini profesyonelce yönet!"
                : "Hesabını şimdi oluştur ve tüm saha çalışmalarının takibini profesyonelce yönet!"}
            </p>
          </div>

          {isLogin ? (
            <div className="mx-auto mt-8 max-w-lg space-y-5">
              <div
                className={`rounded-[1.6rem] border border-border/60 bg-background/75 p-5 text-left ${interactiveClass}`}
                style={{ boxShadow: softTileShadow }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Crown className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-base font-black text-foreground">Merhaba Mümessil !</h2>
                    <p className="text-sm leading-6 text-foreground/70">
                      Sahaya çıkmadan önce hesabına giriş yap. 
                    </p>
                  </div>
                </div>
              </div>

              <form
                className="space-y-6 rounded-[1.8rem] border border-border/60 bg-background/60 p-5 backdrop-blur-xl sm:p-6"
                style={{ boxShadow: softTileShadow }}
                onSubmit={loginForm.handleSubmit(handleSubmit)}
              >
                <InputField
                  label="Kullanıcı Adı"
                  placeholder="Kullanıcı adı"
                  autoComplete="username"
                  error={loginForm.formState.errors.username?.message}
                  {...loginForm.register("username")}
                />
                <InputField
                  label="Parola"
                  type="password"
                  placeholder="Parola"
                  autoComplete="current-password"
                  error={loginForm.formState.errors.password?.message}
                  {...loginForm.register("password")}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex h-14 w-full items-center justify-center gap-2 rounded-[1.4rem] bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-70 ${interactiveClass}`}
                  style={{ boxShadow: "0 18px 32px -18px color-mix(in oklab, var(--primary) 70%, transparent)" }}
                >
                  {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="rounded-2xl border border-border/60 bg-card/70 px-4 py-3 text-sm text-foreground/68">
                  Hesabın yoksa{" "}
                  <Link href="/signup" className="font-semibold text-primary">
                    Kayıt Ol ! 
                  </Link>
                  .
                </div>
              </form>
            </div>
          ) : (
            <div className="mt-8">
              <form
                className="grid gap-6 rounded-[1.8rem] border border-border/60 bg-background/60 p-5 backdrop-blur-xl md:grid-cols-2 sm:p-6"
                style={{ boxShadow: softTileShadow }}
                onSubmit={signupForm.handleSubmit(handleSubmit)}
              >
                <InputField
                  label="Ad"
                  placeholder="Ad"
                  autoComplete="given-name"
                  error={signupForm.formState.errors.firstName?.message}
                  {...signupForm.register("firstName")}
                />
                <InputField
                  label="Soyad"
                  placeholder="Soyad"
                  autoComplete="family-name"
                  error={signupForm.formState.errors.lastName?.message}
                  {...signupForm.register("lastName")}
                />
                <InputField
                  label="Kullanıcı Adı"
                  placeholder="Kullanıcı adı"
                  autoComplete="username"
                  error={signupForm.formState.errors.username?.message}
                  {...signupForm.register("username")}
                />
                <InputField
                  label="E-posta"
                  type="email"
                  placeholder="E-posta"
                  autoComplete="email"
                  error={signupForm.formState.errors.email?.message}
                  {...signupForm.register("email")}
                />
                <InputField
                  label="Telefon"
                  placeholder="Telefon"
                  autoComplete="tel"
                  error={signupForm.formState.errors.phone?.message}
                  {...signupForm.register("phone")}
                />
                <InputField
                  label="Şirket"
                  placeholder="Şirket"
                  autoComplete="organization"
                  error={signupForm.formState.errors.company?.message}
                  {...signupForm.register("company")}
                />
                <InputField
                  label="Ünvan"
                  placeholder="Ünvan"
                  autoComplete="organization-title"
                  error={signupForm.formState.errors.jobTitle?.message}
                  {...signupForm.register("jobTitle")}
                />
                <InputField
                  label="Parola"
                  type="password"
                  placeholder="Parola"
                  autoComplete="new-password"
                  error={signupForm.formState.errors.password?.message}
                  {...signupForm.register("password")}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`md:col-span-2 flex h-14 w-full items-center justify-center gap-2 rounded-[1.4rem] bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-70 ${interactiveClass}`}
                  style={{ boxShadow: "0 18px 32px -18px color-mix(in oklab, var(--primary) 70%, transparent)" }}
                >
                  {isSubmitting ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="md:col-span-2 rounded-2xl border border-border/60 bg-card/70 px-4 py-3 text-sm text-foreground/68">
                  Zaten hesabın varsa{" "}
                  <Link href="/login" className="font-semibold text-primary">
                    Giriş Yap
                  </Link>
                  .
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
