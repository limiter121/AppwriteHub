import { SegmentedControl } from "@mantine/core";
import classes from "./GradientSegmentedControl.module.css";

export function GradientSegmentedControl(props) {
  return <SegmentedControl {...props} classNames={classes} />;
}
