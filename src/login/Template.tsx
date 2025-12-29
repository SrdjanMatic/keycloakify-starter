import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";

export default function Template(props: TemplateProps<KcContext, I18n>) {
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

  const { realm, auth, url, message, isAppInitiatedAction, pageId } = kcContext;

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

  // Funkcija za prevođenje poruka grešaka
  const translateMessage = (messageText: string) => {
    console.log("translateMessage pozvana!");
    console.log("messageText:", messageText);
    console.log("currentLanguageTag:", kcContext.locale?.currentLanguageTag);

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

    const translated = translations[messageText] || messageText;
    console.log("translated:", translated);
    return translated;
  };

  console.log("Template render - message:", message);
  console.log("Template render - displayMessage:", displayMessage);

  if (!isReadyToRender) {
    return null;
  }

  return (
    <>
      <div className={kcClsx("kcLoginClass")}>
        <div className={kcClsx("kcFormCardClass")}>
          <header className={kcClsx("kcFormHeaderClass")}>
            {(() => {
              const node = !(
                auth !== undefined &&
                auth.showUsername &&
                !auth.showResetCredentials
              ) ? (
                <h1 id="kc-page-title">
                  {(() => {
                    switch (pageId) {
                      case "login.ftl":
                        return (
                          <div className="headerCustom">
                            <div className="headerTitle">
                              {msg("loginHeaderTitle")}
                            </div>
                            <div className="headerDescription">
                              {msg("loginHeaderDescription")}
                            </div>
                          </div>
                        );
                      case "register.ftl":
                        return (
                          <div className="headerCustom">
                            <div className="headerTitle">
                              {msg("registerHeaderTitle")}
                            </div>
                            <div className="headerDescription">
                              {msg("registerHeaderDescription")}
                            </div>
                          </div>
                        );
                      default:
                        return null;
                    }
                  })()}
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
              );

              return node;
            })()}
          </header>
          <div id="kc-content">
            <div id="kc-content-wrapper">
              {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
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
              {auth !== undefined && auth.showTryAnotherWayLink && (
                <form
                  id="kc-select-try-another-way-form"
                  action={url.loginAction}
                  method="post"
                >
                  <div className={kcClsx("kcFormGroupClass")}>
                    <input type="hidden" name="tryAnotherWay" value="on" />
                    <a
                      href="#"
                      id="try-another-way"
                      onClick={() => {
                        document.forms[
                          "kc-select-try-another-way-form" as never
                        ].requestSubmit();
                        return false;
                      }}
                    >
                      {msg("doTryAnotherWay")}
                    </a>
                  </div>
                </form>
              )}
              {socialProvidersNode}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
