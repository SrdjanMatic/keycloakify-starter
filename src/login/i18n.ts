/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .withExtraLanguages({
    sr: {
      // cspell: disable-next-line
      label: "Srpski",
      getMessages: () => import("./i18n.rs"),
    },
  })
  .withCustomTranslations({
    en: {
      loginHeaderTitle: "Good to see you 👋",
      loginHeaderDescription: "Sign in for exclusive rewards.",
      registerHeaderTitle: "Welcome! 🎉",
      registerHeaderDescription: "Create your account to get started.",
      usernamePlaceholder: "Username or email",
      passwordPlaceholder: "Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      dontHaveAccount: "Don't have an account?",
      signUp: "Sign up",
      orDivider: "OR",
      continueButton: "Continue",
      firstName: "First Name",
      lastName: "Last Name",
    },
    // cspell: disable
    sr: {
      loginHeaderTitle: "Drago nam je što te vidimo 👋",
      loginHeaderDescription: "Prijavite se za ekskluzivne nagrade.",
      registerHeaderTitle: "Dobrodošli! 🎉",
      registerHeaderDescription: "Kreirajte svoj nalog da započnete.",
      usernamePlaceholder: "Korisničko ime ili email",
      passwordPlaceholder: "Lozinka",
      rememberMe: "Zapamti me",
      forgotPassword: "Zaboravili ste lozinku?",
      dontHaveAccount: "Nemate nalog?",
      signUp: "Registruj se",
      orDivider: "ILI",
      continueButton: "Nastavi",
      firstName: "Ime",
      lastName: "Prezime",
    },
    // cspell: enable
  })
  .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
