import React from "react";
import styles from "./index.module.scss";

type BaseFrameProps = {
  children?: React.ReactNode;
};

export default function BaseFrame(props: BaseFrameProps) {
  return (
    <article className={styles.container}>
      <main>{props.children}</main>
    </article>
  );
}
