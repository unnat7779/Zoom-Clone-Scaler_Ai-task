"use client";

import { useState } from "react";
import { SchCloseIcon } from "@/shared/icons/generated/SchCloseIcon";
import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";
import { Radio, RadioGroup } from "@/shared/ui/Radio";
import { SelectChevron } from "@/shared/ui/Select";
import styles from "./RegionDialog.module.css";

interface RegionDialogProps {
  open: boolean;
  /** Save: the option stays ticked */
  onSave: () => void;
  /** Cancel / × / Escape: the option is unticked again */
  onCancel: () => void;
}

/**
 * "Approve or block entry to users from specific regions/countries" (static; 03-schedule.md §6.11,
 * §8.6, sch-17): 640 wide zoom-dialog, allow/block radios, a Countries/Regions field with "India ×".
 */
export function RegionDialog({ open, onSave, onCancel }: RegionDialogProps) {
  const [mode, setMode] = useState("allow");
  const [regions, setRegions] = useState(["India"]);
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Approve or block entry to users from specific regions/countries"
      className={styles.dialog}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <RadioGroup value={mode} onChange={setMode} direction="vertical" aria-label="Region rule" className={styles.radios}>
        <Radio value="allow" label="Only allow users from selected countries/regions" />
        <Radio value="block" label="Block users from selected countries/regions" />
      </RadioGroup>
      <p className={styles.subtitle}>Countries/Regions</p>
      <div className={styles.field} role="group" aria-label="Countries/Regions">
        {regions.map((region) => (
          <span key={region} className={styles.tag}>
            {region}
            <button type="button" className={styles.tagRemove} aria-label={`Remove ${region}`} onClick={() => setRegions((current) => current.filter((item) => item !== region))}>
              <SchCloseIcon />
            </button>
          </span>
        ))}
        <SelectChevron open={false} />
      </div>
    </Modal>
  );
}
