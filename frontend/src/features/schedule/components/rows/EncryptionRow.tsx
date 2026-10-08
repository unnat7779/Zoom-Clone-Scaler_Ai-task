"use client";

import { useState } from "react";
import clsx from "clsx";
import { useLingering } from "@/shared/hooks/useLingering";
import { SchShieldCheckIcon } from "@/shared/icons/generated/SchShieldCheckIcon";
import { SchShieldLockIcon } from "@/shared/icons/generated/SchShieldLockIcon";
import { Banner } from "@/shared/ui/Banner";
import { Radio, RadioGroup } from "@/shared/ui/Radio";
import { useToast } from "@/shared/ui/Toast";
import type { EncryptionMode } from "../../types";
import { InfoButton } from "../controls/InfoButton";
import formStyles from "../form/Form.module.css";
import { FormRow } from "../form/FormRow";
import styles from "./EncryptionRow.module.css";

/** `.zoom-banner{transition:opacity .3s}` — the `zoom-banner-fade` leave before the banner unmounts */
const BANNER_FADE_MS = 300;

interface EncryptionRowProps {
  mode: EncryptionMode;
  onChange: (mode: EncryptionMode) => void;
}

/**
 * Encryption (static, not stored): Enhanced | End-to-end radios with shield icons and ⓘ popovers.
 * End-to-end shows Zoom's closable warning banner (03-schedule.md §5.13); the form hides the rows it disables.
 */
export function EncryptionRow({ mode, onChange }: EncryptionRowProps) {
  const toast = useToast();
  const [bannerClosed, setBannerClosed] = useState(false);
  const bannerOpen = mode === "e2e" && !bannerClosed;
  const bannerLeaving = useLingering(bannerOpen, BANNER_FADE_MS);
  const choose = (next: EncryptionMode) => {
    setBannerClosed(false);
    onChange(next);
  };
  return (
    <FormRow label="Encryption" labelId="schedule-encryption-label">
      <RadioGroup value={mode} onChange={choose} aria-labelledby="schedule-encryption-label" className={styles.radios}>
        <Radio
          value="enhanced"
          label={
            <span className={formStyles.inlineLabel}>
              <SchShieldCheckIcon className={styles.shield} />
              Enhanced encryption
              <InfoButton kind="suffix" label="Learn more about Enhanced encryption" content="Encryption key stored in the cloud." />
            </span>
          }
        />
        <Radio
          value="e2e"
          label={
            <span className={formStyles.inlineLabel}>
              <SchShieldLockIcon className={styles.shield} />
              End-to-end encryption
              <InfoButton
                kind="suffix"
                label="Learn more about End-to-end encryption"
                content="Encryption key stored on your local device. No one else can obtain your encryption key, not even Zoom."
              />
            </span>
          }
        />
      </RadioGroup>
      {bannerOpen || bannerLeaving ? (
        <Banner
          kind="warning"
          className={clsx(styles.banner, { [styles.bannerLeaving ?? ""]: bannerLeaving })}
          onClose={() => setBannerClosed(true)}
        >
          <p className={styles.text}>
            Several features will be automatically disabled when using end-to-end encryption, including cloud recording and
            phone/SIP/H.323 dial-in.
            <button type="button" className={styles.learnMore} onClick={toast.notAvailable}>
              Learn More
            </button>
          </p>
        </Banner>
      ) : null}
    </FormRow>
  );
}
