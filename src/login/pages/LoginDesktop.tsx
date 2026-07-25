/**
 * Simplified desktop login page (login.ftl) for the LoyalEatyAdmin theme.
 * Username + password + remember me + forgot password only — no social login, no registration.
 */
import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/Login.useScript";
import FloatingLabelInput from "../FloatingLabelInput";

export default function LoginDesktop(
  props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const {
    realm,
    url,
    usernameHidden,
    login,
    auth,
    messagesPerField,
    enableWebAuthnConditionalUI,
    authenticators,
  } = kcContext;

  const { msgStr, msg } = i18n;

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
  const [usernameValue, setUsernameValue] = useState(login.username ?? "");
  const [passwordValue, setPasswordValue] = useState("");
  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);

  const webAuthnButtonId = "authenticateWebAuthnButton";

  const translateFieldError = (errorText: string | undefined): string => {
    if (!errorText) return "";
    if (kcContext.locale?.currentLanguageTag !== "sr") {
      return errorText;
    }

    const translations: Record<string, string> = {
      "Invalid username or password.": "Neispravno korisničko ime ili lozinka.",
      "Invalid username or password": "Neispravno korisničko ime ili lozinka.",
      "Invalid email address.": "Neispravna email adresa.",
      "Invalid email address": "Neispravna email adresa.",
    };

    return translations[errorText] || errorText;
  };

  useScript({
    webAuthnButtonId,
    kcContext,
    i18n,
  });

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError("username", "password")}
      headerNode={<div className="headerTitle">LoyalEaty</div>}
    >
      <div id="kc-form">
        <div id="kc-form-wrapper">
          {realm.password && (
            <form
              id="kc-form-login"
              onSubmit={() => {
                setIsLoginButtonDisabled(true);
                return true;
              }}
              action={url.loginAction}
              method="post"
            >
              {!usernameHidden && (
                <div className={kcClsx("kcFormGroupClass")}>
                  <FloatingLabelInput
                    tabIndex={2}
                    id="username"
                    name="username"
                    value={usernameValue}
                    onChange={(e) => setUsernameValue(e.target.value)}
                    label={msgStr("usernamePlaceholder")}
                    type="text"
                    autoFocus
                    autoComplete="username"
                    error={messagesPerField.existsError("username", "password")}
                  />
                  {messagesPerField.existsError("username", "password") && (
                    <span
                      id="input-error"
                      className={kcClsx("kcInputErrorMessageClass")}
                      aria-live="polite"
                      dangerouslySetInnerHTML={{
                        __html: kcSanitize(
                          translateFieldError(
                            messagesPerField.getFirstError(
                              "username",
                              "password",
                            ),
                          ),
                        ),
                      }}
                    />
                  )}
                </div>
              )}

              <div className={kcClsx("kcFormGroupClass")}>
                <FloatingLabelInput
                  tabIndex={3}
                  id="password"
                  name="password"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  label={msgStr("passwordPlaceholder")}
                  type={isPasswordRevealed ? "text" : "password"}
                  autoComplete="current-password"
                  error={messagesPerField.existsError("username", "password")}
                  rightElement={
                    <button
                      type="button"
                      className="floating-input__toggle"
                      aria-label={msgStr(
                        isPasswordRevealed ? "hidePassword" : "showPassword",
                      )}
                      onClick={() => setIsPasswordRevealed((v) => !v)}
                    >
                      <i
                        className={kcClsx(
                          isPasswordRevealed
                            ? "kcFormPasswordVisibilityIconHide"
                            : "kcFormPasswordVisibilityIconShow",
                        )}
                        aria-hidden
                      />
                    </button>
                  }
                />
                {usernameHidden &&
                  messagesPerField.existsError("username", "password") && (
                    <span
                      id="input-error"
                      className={kcClsx("kcInputErrorMessageClass")}
                      aria-live="polite"
                      dangerouslySetInnerHTML={{
                        __html: kcSanitize(
                          translateFieldError(
                            messagesPerField.getFirstError(
                              "username",
                              "password",
                            ),
                          ),
                        ),
                      }}
                    />
                  )}
              </div>

              <div className="form-options-row">
                <div className="remember-me-wrapper">
                  {realm.rememberMe && !usernameHidden && (
                    <label className="remember-me-label">
                      <input
                        tabIndex={5}
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        defaultChecked={!!login.rememberMe}
                      />
                      <span>{msg("rememberMe")}</span>
                    </label>
                  )}
                </div>
                <div className="forgot-password-wrapper">
                  {realm.resetPasswordAllowed && (
                    <a
                      tabIndex={6}
                      href={url.loginResetCredentialsUrl}
                      className="forgot-password-link"
                    >
                      {msg("forgotPassword")}
                    </a>
                  )}
                </div>
              </div>

              <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                <input
                  type="hidden"
                  id="id-hidden-input"
                  name="credentialId"
                  value={auth.selectedCredential}
                />
                <input
                  tabIndex={7}
                  disabled={isLoginButtonDisabled}
                  className={clsx(
                    kcClsx(
                      "kcButtonClass",
                      "kcButtonPrimaryClass",
                      "kcButtonBlockClass",
                      "kcButtonLargeClass",
                    ),
                    "continue-button",
                  )}
                  name="login"
                  id="kc-login"
                  type="submit"
                  value={msgStr("continueButton")}
                />
              </div>
            </form>
          )}
        </div>
      </div>
      {enableWebAuthnConditionalUI && (
        <>
          <form id="webauth" action={url.loginAction} method="post">
            <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
            <input
              type="hidden"
              id="authenticatorData"
              name="authenticatorData"
            />
            <input type="hidden" id="signature" name="signature" />
            <input type="hidden" id="credentialId" name="credentialId" />
            <input type="hidden" id="userHandle" name="userHandle" />
            <input type="hidden" id="error" name="error" />
          </form>

          {authenticators !== undefined &&
            authenticators.authenticators.length !== 0 && (
              <>
                <form id="authn_select" className={kcClsx("kcFormClass")}>
                  {authenticators.authenticators.map((authenticator, i) => (
                    <input
                      key={i}
                      type="hidden"
                      name="authn_use_chk"
                      readOnly
                      value={authenticator.credentialId}
                    />
                  ))}
                </form>
              </>
            )}
          <br />

          <input
            id={webAuthnButtonId}
            type="button"
            className={kcClsx(
              "kcButtonClass",
              "kcButtonDefaultClass",
              "kcButtonBlockClass",
              "kcButtonLargeClass",
            )}
            value={msgStr("passkey-doAuthenticate")}
          />
        </>
      )}
    </Template>
  );
}
