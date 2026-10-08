"use client";

import { Banner } from "@/shared/ui/Banner";
import { useToast } from "@/shared/ui/Toast";
import formStyles from "../form/Form.module.css";
import styles from "./BasicPlanBanner.module.css";

/** Basic-plan 40-minute warning under Duration (static; only with NEXT_PUBLIC_PLAN=basic). */
export function BasicPlanBanner() {
  const toast = useToast();
  return (
    <Banner kind="warning" className={styles.banner}>
      <p className={formStyles.bannerText}>
        You can schedule meetings for up to 40 minutes each with your current Basic plan. Need more time?
        <br />
        <button type="button" className={styles.link} onClick={toast.notAvailable}>
          Upgrade to Zoom Workplace Pro
        </button>
      </p>
    </Banner>
  );
}
