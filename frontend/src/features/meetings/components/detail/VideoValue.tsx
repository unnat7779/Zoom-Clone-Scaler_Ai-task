import styles from "./VideoValue.module.css";

/** Host / Participant on|off, two sub-rows 28px apart (120px name column). */
export function VideoValue({ host, participant }: { host: boolean; participant: boolean }) {
  const lines = [
    { name: "Host", on: host },
    { name: "Participant", on: participant },
  ];
  return (
    <div className={styles.video}>
      {lines.map((line) => (
        <div key={line.name} className={styles.line}>
          <span className={styles.name}>{line.name}</span>
          <span>{line.on ? "on" : "off"}</span>
        </div>
      ))}
    </div>
  );
}
