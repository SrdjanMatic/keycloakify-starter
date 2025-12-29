import type { JSX } from "keycloakify/tools/JSX";
import { useState, useLayoutEffect } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import { clsx } from "keycloakify/tools/clsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

type RegisterProps = PageProps<
  Extract<KcContext, { pageId: "register.ftl" }>,
  I18n
> & {
  UserProfileFormFields: LazyOrNot<
    (props: UserProfileFormFieldsProps) => JSX.Element
  >;
  doMakeUserConfirmPassword: boolean;
};

export default function Register(props: RegisterProps) {
  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
    UserProfileFormFields,
    doMakeUserConfirmPassword,
  } = props;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const {
    messageHeader,
    url,
    messagesPerField,
    recaptchaRequired,
    recaptchaVisible,
    recaptchaSiteKey,
    recaptchaAction,
    termsAcceptanceRequired,
  } = kcContext;

  const { msg, msgStr, advancedMsg } = i18n;

  const [isFormSubmittable, setIsFormSubmittable] = useState(false);
  const [areTermsAccepted, setAreTermsAccepted] = useState(false);

  // Funkcija za prevođenje grešaka
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
      "Please specify this field.": "Molimo unesite ovo polje.",
      "Please specify username or email.":
        "Molimo unesite korisničko ime ili email.",
      "Please specify password.": "Molimo unesite lozinku.",
      "Please specify first name.": "Molimo unesite ime.",
      "Please specify last name.": "Molimo unesite prezime.",
    };

    return translations[errorText] || errorText;
  };

  useLayoutEffect(() => {
    (
      window as typeof window & { onSubmitRecaptcha?: () => void }
    ).onSubmitRecaptcha = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      document.getElementById("kc-register-form").requestSubmit();
    };

    return () => {
      delete (window as typeof window & { onSubmitRecaptcha?: () => void })
        .onSubmitRecaptcha;
    };
  }, []);

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={
        messageHeader !== undefined
          ? advancedMsg(messageHeader)
          : msg("registerTitle")
      }
      displayMessage={messagesPerField.exists("global")}
      displayRequiredFields
    >
      <form
        id="kc-register-form"
        className={kcClsx("kcFormClass")}
        action={url.registrationAction}
        method="post"
      >
        <UserProfileFormFields
          kcContext={kcContext}
          i18n={i18n}
          kcClsx={kcClsx}
          onIsFormSubmittableValueChange={setIsFormSubmittable}
          doMakeUserConfirmPassword={doMakeUserConfirmPassword}
        />
        {termsAcceptanceRequired && (
          <TermsAcceptance
            i18n={i18n}
            kcClsx={kcClsx}
            messagesPerField={messagesPerField}
            areTermsAccepted={areTermsAccepted}
            onAreTermsAcceptedValueChange={setAreTermsAccepted}
            translateFieldError={translateFieldError}
            kcContext={kcContext}
          />
        )}
        {recaptchaRequired &&
          (recaptchaVisible || recaptchaAction === undefined) && (
            <div className="form-group">
              <div className={kcClsx("kcInputWrapperClass")}>
                <div
                  className="g-recaptcha"
                  data-size="compact"
                  data-sitekey={recaptchaSiteKey}
                  data-action={recaptchaAction}
                ></div>
              </div>
            </div>
          )}
        <div className={kcClsx("kcFormGroupClass")}>
          <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
            <div className={kcClsx("kcFormOptionsWrapperClass")}>
              <span>
                <a href={url.loginUrl}>{msg("backToLogin")}</a>
              </span>
            </div>
          </div>

          {recaptchaRequired &&
          !recaptchaVisible &&
          recaptchaAction !== undefined ? (
            <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
              <button
                className={clsx(
                  kcClsx(
                    "kcButtonClass",
                    "kcButtonPrimaryClass",
                    "kcButtonBlockClass",
                    "kcButtonLargeClass"
                  ),
                  "g-recaptcha"
                )}
                data-sitekey={recaptchaSiteKey}
                data-callback="onSubmitRecaptcha"
                data-action={recaptchaAction}
                type="submit"
              >
                {msg("doRegister")}
              </button>
            </div>
          ) : (
            <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
              <input
                disabled={
                  !isFormSubmittable ||
                  (termsAcceptanceRequired && !areTermsAccepted)
                }
                className={kcClsx(
                  "kcButtonClass",
                  "kcButtonPrimaryClass",
                  "kcButtonBlockClass",
                  "kcButtonLargeClass"
                )}
                type="submit"
                value={msgStr("doRegister")}
              />
            </div>
          )}
        </div>
      </form>
    </Template>
  );
}

function TermsAcceptance(props: {
  i18n: I18n;
  kcClsx: KcClsx;
  messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
  areTermsAccepted: boolean;
  onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
  translateFieldError: (errorText: string | undefined) => string;
  kcContext: KcContext;
}) {
  const {
    i18n,
    kcClsx,
    messagesPerField,
    areTermsAccepted,
    onAreTermsAcceptedValueChange,
    translateFieldError,
  } = props;

  const { msg } = i18n;

  return (
    <>
      <div className="form-group">
        <div className={kcClsx("kcLabelWrapperClass")}>
          <input
            type="checkbox"
            id="termsAccepted"
            name="termsAccepted"
            className={kcClsx("kcCheckboxInputClass")}
            checked={areTermsAccepted}
            onChange={(e) => onAreTermsAcceptedValueChange(e.target.checked)}
            aria-invalid={messagesPerField.existsError("termsAccepted")}
          />
          <label htmlFor="termsAccepted" className={kcClsx("kcLabelClass")}>
            {msg("acceptTerms")}
          </label>
        </div>
        {messagesPerField.existsError("termsAccepted") && (
          <div className={kcClsx("kcLabelWrapperClass")}>
            <span
              id="input-error-terms-accepted"
              className={kcClsx("kcInputErrorMessageClass")}
              aria-live="polite"
            >
              {translateFieldError(messagesPerField.get("termsAccepted"))}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
