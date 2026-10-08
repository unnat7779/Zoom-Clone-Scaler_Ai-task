import { SchExternalLinkIcon } from "@/shared/icons/generated/SchExternalLinkIcon";
import { SchZoomLogoIcon } from "@/shared/icons/generated/SchZoomLogoIcon";
import styles from "./AboutPane.module.css";

/** Settings › About (spec 05 §12): logo, version, copyright; the links are static. */
export function AboutPane() {
  return (
    <div className={styles.about}>
      <div className={styles.brand}>
        <SchZoomLogoIcon className={styles.logo} />
        <span className={styles.product}>Workplace</span>
      </div>
      <p className={styles.version}>Version: 7.2.0(12783.ufb8n9u)</p>
      <p className={styles.copyright}>
        Copyright © 2012-{new Date().getFullYear()} Zoom Communications, Inc.
        <br />
        All rights reserved.
      </p>
      <button type="button" className={styles.link}>
        Open Source Software
        <SchExternalLinkIcon className={styles.external} />
      </button>
      <p className={styles.footer}>
        Found a problem?{" "}
        <button type="button" className={styles.report}>
          Send report
        </button>
      </p>
    </div>
  );
}
