import styles from "./index.module.scss";
import React from "react";

type BaseTitleProps = {
  level?: number;
  border?: boolean;
  center?: boolean;
  children?: React.ReactNode;
};

export default function BaseTitle(props: BaseTitleProps) {
  const { level = 1, border, center } = props;

  const style: any = {};
  if (border) {
    style.borderBottom = "1px solid #e8e8e8";
  }
  if (center) {
    style.textAlign = "center";
  }

  return React.createElement(
    `h${level}`,
    {
      style: style,
      className: styles.container,
    },
    props.children
  );
}
