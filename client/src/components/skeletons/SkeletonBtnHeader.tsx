import React from "react";
import ContentLoader from "react-content-loader";

const SkeletonBtnHeader = () => {
  return (
    <ContentLoader
      rtl
      speed={2}
      width={117}
      height={44}
      viewBox="0 0 117 44"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      style={{ borderRadius: "18px" }}
      data-testid="skeleton-btn-header"
    >
      <rect x="267" y="347" rx="0" ry="0" width="0" height="3" />
      <rect x="25" y="360" rx="0" ry="0" width="1" height="9" />
      <rect x="105" y="36" rx="0" ry="0" width="258" height="0" />
      <rect x="380" y="17" rx="0" ry="0" width="117" height="23" />
      <rect x="1" y="0" rx="0" ry="0" width="170" height="74" />
    </ContentLoader>
  );
};

export default SkeletonBtnHeader;
