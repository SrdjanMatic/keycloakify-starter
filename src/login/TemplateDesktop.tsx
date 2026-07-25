import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";

export default function TemplateDesktop(props: TemplateProps<KcContext, I18n>) {
  const {
    displayInfo = false,
    displayMessage = true,
    socialProvidersNode = null,
    infoNode = null,
    documentTitle,
    bodyClassName,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
    children,
  } = props;

  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

  const { msg, msgStr } = i18n;

  const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

  useEffect(() => {
    document.title = documentTitle ?? msgStr("loginTitle", realm.displayName);
  }, []);

  useSetClassName({
    qualifiedName: "html",
    className: kcClsx("kcHtmlClass"),
  });

  useSetClassName({
    qualifiedName: "body",
    className: bodyClassName ?? kcClsx("kcBodyClass"),
  });

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

  const translateMessage = (messageText: string) => {
    if (kcContext.locale?.currentLanguageTag !== "sr") {
      return messageText;
    }

    const translations: Record<string, string> = {
      "Invalid username or password.": "Neispravno korisničko ime ili lozinka.",
      "Invalid username or password": "Neispravno korisničko ime ili lozinka.",
      "Invalid email address.": "Neispravna email adresa.",
      "Invalid email address": "Neispravna email adresa.",
      "Account is disabled, contact your administrator.":
        "Nalog je onemogućen, kontaktirajte administratora.",
      "Account is disabled, contact your administrator":
        "Nalog je onemogućen, kontaktirajte administratora.",
      "Account temporarily disabled.": "Nalog je privremeno onemogućen.",
      "Account temporarily disabled": "Nalog je privremeno onemogućen.",
    };

    return translations[messageText] || messageText;
  };

  if (!isReadyToRender) {
    return null;
  }

  return (
    <>
      <div className={clsx(kcClsx("kcLoginClass"), "desktop-admin-login")}>
        <div className={clsx(kcClsx("kcFormCardClass"), "desktop-admin-card")}>
          <header className={kcClsx("kcFormHeaderClass")}>
            {!(
              auth !== undefined &&
              auth.showUsername &&
              !auth.showResetCredentials
            ) ? (
              <h1 id="kc-page-title">
                <div className="headerCustom">
                  <div className="headerTitle">LoyalEaty</div>
                </div>
              </h1>
            ) : (
              <div id="kc-username" className={kcClsx("kcFormGroupClass")}>
                <label id="kc-attempted-username">
                  {auth.attemptedUsername}
                </label>
                <a
                  id="reset-login"
                  href={url.loginRestartFlowUrl}
                  aria-label={msgStr("restartLoginTooltip")}
                >
                  <div className="kc-login-tooltip">
                    <i className={kcClsx("kcResetFlowIcon")}></i>
                    <span className="kc-tooltip-text">
                      {msg("restartLoginTooltip")}
                    </span>
                  </div>
                </a>
              </div>
            )}
          </header>
          <div id="kc-content">
            <div id="kc-content-wrapper">
              {displayMessage &&
                message !== undefined &&
                (message.type !== "warning" || !isAppInitiatedAction) && (
                  <div
                    className={clsx(
                      `alert-${message.type}`,
                      kcClsx("kcAlertClass"),
                      `pf-m-${message?.type === "error" ? "danger" : message.type}`
                    )}
                  >
                    <div className="pf-c-alert__icon">
                      {message.type === "success" && (
                        <span
                          className={kcClsx("kcFeedbackSuccessIcon")}
                        ></span>
                      )}
                      {message.type === "warning" && (
                        <span
                          className={kcClsx("kcFeedbackWarningIcon")}
                        ></span>
                      )}
                      {message.type === "error" && (
                        <span className={kcClsx("kcFeedbackErrorIcon")}></span>
                      )}
                      {message.type === "info" && (
                        <span className={kcClsx("kcFeedbackInfoIcon")}></span>
                      )}
                    </div>
                    <span
                      className={kcClsx("kcAlertTitleClass")}
                      dangerouslySetInnerHTML={{
                        __html: kcSanitize(translateMessage(message.summary)),
                      }}
                    />
                  </div>
                )}
              {children}
              {displayInfo && (
                <div id="kc-info" className={kcClsx("kcSignUpClass")}>
                  <div
                    id="kc-info-wrapper"
                    className={kcClsx("kcInfoAreaWrapperClass")}
                  >
                    {infoNode}
                  </div>
                </div>
              )}
              {socialProvidersNode}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
