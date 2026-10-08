import { StaticButton } from "@/shared/ui/StaticButton";
import styles from "./MeetingInfoForm.module.css";

/** `.preview-agreement` — legal links are Static UI only. (Zoom's reCAPTCHA line is omitted, DV8.) */
export function AgreementText() {
  return (
    <p className={styles.agreement}>
      By clicking &quot;Join&quot;, you agree to our <StaticButton className={styles.agreementLink}>Terms of Service</StaticButton> and{" "}
      <StaticButton className={styles.agreementLink}>Privacy Statement</StaticButton>.
    </p>
  );
}
