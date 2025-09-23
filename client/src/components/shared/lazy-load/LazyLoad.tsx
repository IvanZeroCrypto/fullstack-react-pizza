import { Suspense } from "react";
import ProgressBar from "../progress-bar/ProgressBar";

const LazyLoad = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<ProgressBar />}>{children}</Suspense>;
};

export default LazyLoad;
